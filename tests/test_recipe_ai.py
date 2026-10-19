"""AI recipe import: page sources, prompt, answer -> draft (pure), and the websocket command with
the AI fallback for URLs, pasted text and photos (ai._generate and yt-dlp are always patched)."""

import base64
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from homeassistant.components.ai_task import AITaskEntityFeature
from homeassistant.core import HomeAssistant

from custom_components.pantry import inventory as inv
from custom_components.pantry import recipe_media
from custom_components.pantry.const import CONF_AI_TASK, CONF_AI_VIDEO, DOMAIN

from .test_websocket import ws  # noqa: F401  (fixture)

POST = """<html><head>
<meta property="og:title" content="Kochkanal on Instagram">
<meta content="Pasta &amp; Feta! #food" property="og:description">
<meta property="og:image" content="https://cdn.test/cover.jpg">
<script>var junk = "<div>not text</div>";</script><style>p{color:red}</style>
</head><body><p>Hallo <b>Welt</b></p><script src="x.js"></script></body></html>"""

ANSWER = {
    "found": True,
    "name": "Feta-Pasta",
    "servings": 2,
    "ingredients": ["200 g Spaghetti", "1 Feta", "Salz"],
    "steps": [
        {"text": "Ofen vorheizen.", "section": "Soße"},
        {"text": "Feta backen.", "section": "Soße"},
        {"text": "Nudeln kochen.", "section": "Nudeln"},
    ],
}


def test_page_sources():
    s = inv.ai_page_sources(POST)
    assert s["title"] == "Kochkanal on Instagram"
    assert s["description"] == "Pasta & Feta! #food"
    assert s["image"] == "https://cdn.test/cover.jpg"
    assert s["text"] == "Hallo Welt"  # scripts and styles dropped
    many = "<script>x</script>" * 20_000 + "<p>end</p>"  # stays linear
    assert inv.ai_page_sources(many)["text"] == "end"
    assert inv.ai_page_sources('<meta property="og:image" content="javascript:x">')["image"] is None


def test_prompt_and_answer(conn):
    p = inv.ai_import_prompt({"description": "Pasta & Feta", "text": None})
    assert "Caption / description:\nPasta & Feta" in p and "Text:" not in p
    assert "(only the attached files)" in inv.ai_import_prompt({})
    assert inv.ai_recipe({"found": False}) is None
    assert inv.ai_recipe({"found": True, "ingredients": [], "steps": []}) is None
    recipe = inv.ai_recipe(ANSWER, "https://cdn.test/cover.jpg")
    draft = inv.recipe_draft(conn, recipe, None)
    assert draft["name"] == "Feta-Pasta" and draft["servings"] == 2
    assert draft["image_url"] == "https://cdn.test/cover.jpg" and draft["source_url"] is None
    assert [i["text"] for i in draft["ingredients"]] == ["Spaghetti", "Feta", "Salz"]
    assert draft["ingredients"][0]["amount"] == 200
    assert [(s["section"], s["text"]) for s in draft["steps"]] == [
        ("Soße", "Ofen vorheizen."),
        (None, "Feta backen."),
        ("Nudeln", "Nudeln kochen."),
    ]


def enable_ai(hass: HomeAssistant, media: Path, files: bool = True, video: bool = True) -> None:
    entry = hass.config_entries.async_entries(DOMAIN)[0]
    options = {CONF_AI_TASK: "ai_task.test", CONF_AI_VIDEO: video}
    hass.config_entries.async_update_entry(entry, options=options)
    hass.config.components.add("ai_task")
    hass.config.media_dirs = {"local": str(media)}
    features = AITaskEntityFeature.GENERATE_DATA | (
        AITaskEntityFeature.SUPPORT_ATTACHMENTS if files else 0
    )
    hass.states.async_set("ai_task.test", "unknown", {"supported_features": features})


def generate(answer=ANSWER):
    return patch(
        "custom_components.pantry.ai._generate",
        new=AsyncMock(return_value=SimpleNamespace(data=answer)),
    )


async def test_ws_url_fallback(hass, ws, aioclient_mock, tmp_path):  # noqa: F811
    html = {"Content-Type": "text/html; charset=utf-8"}
    aioclient_mock.get("https://insta.test/p/1", text=POST, headers=html)
    aioclient_mock.get("https://insta.test/403", status=403)
    aioclient_mock.get(
        "https://cdn.test/cover.jpg", content=b"\xff\xd8jpg", headers={"Content-Type": "image/jpeg"}
    )
    msg = {"type": "pantry/recipe_import", "url": "https://insta.test/p/1"}
    # no AI: the schema.org error as before
    assert (await ws.call(msg))["error"]["translation_key"] == "recipe_not_found"

    enable_ai(hass, tmp_path)
    seen: list[str] = []

    def video(url, folder):
        seen.append(url)
        return None  # yt-dlp knows no video there

    with patch.object(recipe_media, "video", video), generate() as gen:
        res = (await ws.call(msg))["result"]
    assert res["name"] == "Feta-Pasta" and res["source_url"] == "https://insta.test/p/1"
    kw = gen.await_args.kwargs
    assert "Pasta & Feta! #food" in kw["instructions"]
    assert kw["task_name"] == "Vorrat: Rezept auslesen"
    [att] = kw["attachments"]  # the og:image, through the hidden media folder
    assert att["media_content_id"].startswith("media-source://media_source/local/.pantry_import/")
    assert att["media_content_type"] == "image/jpeg"
    assert seen == ["https://insta.test/p/1"]
    assert not any((tmp_path / ".pantry_import").iterdir())  # cleaned up

    # a video post: caption from yt-dlp, the clip as attachment; also when the page is blocked
    def clip(url, folder):
        (folder / "video.mp4").write_bytes(b"mp4")
        return {"title": "Reel", "description": "Spoken recipe", "thumbnail": None,
                "file": folder / "video.mp4"}  # fmt: skip

    with patch.object(recipe_media, "video", clip), generate() as gen:
        res = await ws.call({"type": "pantry/recipe_import", "url": "https://insta.test/403"})
    assert res["success"]
    kw = gen.await_args.kwargs
    assert "Spoken recipe" in kw["instructions"]
    assert kw["attachments"][0]["media_content_type"] == "video/mp4"

    # nothing to read, no recipe, AI error
    with patch.object(recipe_media, "video", video), generate({"found": False}):
        res = await ws.call({"type": "pantry/recipe_import", "url": "https://insta.test/403"})
    assert res["error"]["translation_key"] == "recipe_not_found"
    with patch.object(recipe_media, "video", video), generate({"found": False}):
        assert (await ws.call(msg))["error"]["translation_key"] == "recipe_not_found"
    failing = AsyncMock(side_effect=TimeoutError)
    with (
        patch.object(recipe_media, "video", video),
        patch("custom_components.pantry.ai._generate", new=failing),
    ):
        assert (await ws.call(msg))["error"]["translation_key"] == "ai_import_failed"

    # video download off (the default): yt-dlp is not asked, the page is still read
    enable_ai(hass, tmp_path, video=False)
    seen.clear()
    with patch.object(recipe_media, "video", video), generate():
        assert (await ws.call(msg))["success"]
    assert seen == []


async def test_ws_text_and_photo(hass, ws, tmp_path):  # noqa: F811
    text = {"type": "pantry/recipe_import", "text": "Feta-Pasta: 200 g Spaghetti …"}
    photo = "data:image/png;base64," + base64.b64encode(b"\x89PNG").decode()
    assert (await ws.call(text))["error"]["translation_key"] == "ai_off"
    assert not (await ws.call({"type": "pantry/recipe_import"}))["success"]
    both = {**text, "url": "https://x.test/r"}
    assert not (await ws.call(both))["success"]

    enable_ai(hass, tmp_path, files=False)
    img = {"type": "pantry/recipe_import", "image": photo}
    assert (await ws.call(img))["error"]["translation_key"] == "ai_no_files"
    with generate() as gen:
        assert (await ws.call(text))["result"]["name"] == "Feta-Pasta"
    assert "200 g Spaghetti" in gen.await_args.kwargs["instructions"]
    assert gen.await_args.kwargs["attachments"] is None

    enable_ai(hass, tmp_path)
    with generate() as gen:
        assert (await ws.call(img))["success"]
    assert gen.await_args.kwargs["attachments"][0]["media_content_type"] == "image/png"
    bad = {"type": "pantry/recipe_import", "image": "data:image/png;base64,!!"}
    assert (await ws.call(bad))["error"]["translation_key"] == "invalid_value"
    assert not (await ws.call({**img, "image": "data:text/html;base64,AA=="}))["success"]
