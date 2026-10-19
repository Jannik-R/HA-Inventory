"""Development tool only, never part of the integration: run random Chefkoch recipes through the
recipe import parser and print only suspicious rows. It fetches real pages automatically, which
site terms usually forbid: run it rarely, keep -n small (it waits between pages), prefer --cached.

Run in the test container (has Home Assistant installed), see skill `import-check`:
    docker compose -f dev/docker-compose.yml run --rm --entrypoint python test scripts/import_check.py -n 10

Pages are cached in dev/config/import-check/ (git-ignored, never commit: third-party content).
"""

from __future__ import annotations

import argparse
import collections
import pathlib
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from custom_components.home_inventory import db  # noqa: E402
from custom_components.home_inventory import inventory as inv  # noqa: E402

CACHE = ROOT / "dev" / "config" / "import-check"
RANDOM_URL = "https://www.chefkoch.de/rezepte/zufallsrezept/"
UA = "Mozilla/5.0 (home_inventory import check)"
DELAY = 3  # seconds between requests to the site


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None


def _request(url: str) -> urllib.request.Request:
    return urllib.request.Request(url, headers={"User-Agent": UA})


def random_url() -> str:
    """The random recipe's URL without following the redirect: its target carries `?zufall=on`,
    which robots.txt disallows (`/rezepte/*?*`); the clean URL is allowed."""
    try:
        urllib.request.build_opener(_NoRedirect).open(_request(RANDOM_URL), timeout=15)
    except urllib.error.HTTPError as err:
        if err.code in (301, 302, 303, 307, 308):
            return urllib.parse.urljoin(RANDOM_URL, err.headers["Location"]).split("?")[0]
        raise
    raise RuntimeError("random recipe did not redirect")


def fetch(url: str) -> str:
    with urllib.request.urlopen(_request(url), timeout=15) as resp:
        return resp.read().decode(resp.headers.get_content_charset() or "utf-8", "replace")


def pages(n: int, cached: bool, urls: list[str]):
    CACHE.mkdir(parents=True, exist_ok=True)
    if cached:
        for f in sorted(CACHE.glob("*.html"))[:n]:
            yield f.stem, f.read_text(encoding="utf-8")
        return
    seen = set()
    for i in range(len(urls) or n):
        try:
            url = urls[i] if urls else random_url()
            key = re.sub(r"\W+", "_", url.removeprefix("https://www.chefkoch.de/rezepte/"))[:80]
            file = CACHE / f"{key}.html"
            if key in seen:
                continue
            seen.add(key)
            if not file.exists():  # never fetch a page twice
                time.sleep(DELAY)
                file.write_text(fetch(url), encoding="utf-8")
        except urllib.error.HTTPError as err:  # 429/503 etc.: stop, do not retry
            print(f"\n!! stopped: HTTP {err.code} for {err.url}")
            return
        yield url, file.read_text(encoding="utf-8")
        time.sleep(DELAY)


def flags(i: dict) -> list[str]:
    text, line = i["text"], i["line"]
    out = []
    if i["unit_hint"]:
        out.append("HINT")
    if i["category_id"] is None:
        out.append("NOCAT")
    if re.search(r"\d", text):
        out.append("DIGIT")
    if re.search(r"[()/]", text):
        out.append("PUNCT")
    if len(text.split()) > 3:
        out.append("LONG")
    if re.match(r"\s*[\d½¼¾⅓⅔⅛]", line) and i["amount"] is None:
        out.append("NOAMT")
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("-n", type=int, default=10, help="number of recipes")
    ap.add_argument("--cached", action="store_true", help="reuse cached pages, no network")
    ap.add_argument("--all", action="store_true", help="print every row, not only flagged ones")
    ap.add_argument("urls", nargs="*", help="specific recipe URLs instead of random ones")
    args = ap.parse_args()

    conn = db.connect(":memory:")
    db.migrate(conn)  # seeds the default units, categories and product types
    unit = {r["id"]: r["symbol"] for r in conn.execute("SELECT id, symbol FROM unit")}
    cat = {r["id"]: r["name"] for r in conn.execute("SELECT id, name FROM category")}
    stats: collections.Counter = collections.Counter()
    hints: collections.Counter = collections.Counter()
    nocat: collections.Counter = collections.Counter()

    for url, page in pages(args.n, args.cached, args.urls):
        stats["recipes"] += 1
        try:
            d = inv.recipe_import(conn, page, url)
        except inv.InventoryError as err:
            stats["failed"] += 1
            print(f"\n!! {url}: {err}")
            continue
        missing = [k for k in ("image_url", "steps") if not d[k]]
        print(f"\n## {d['name']} | {d['servings']} P | {len(d['ingredients'])} rows"
              f"{' | missing ' + ','.join(missing) if missing else ''} | {url}")  # fmt: skip
        stats.update(f"no_{k}" for k in missing)
        for i in d["ingredients"]:
            stats["rows"] += 1
            f = flags(i)
            stats.update(f)
            if i["unit_hint"]:
                hints[i["unit_hint"]] += 1
            if i["category_id"] is None:
                nocat[i["text"]] += 1
            if f or args.all:
                amount = (
                    "" if i["amount"] is None else f"{i['amount']:g} {unit.get(i['unit_id'], '?')} "
                )
                print(f"  {','.join(f) or 'ok':<16} {i['line']!r} -> {amount}{i['text']!r}"
                      f"{' [' + i['note'] + ']' if i['note'] else ''}"
                      f"{' opt' if i['optional'] else ''}"
                      f" => {cat.get(i['category_id'], '-')}"
                      f"{' hint=' + i['unit_hint'] if i['unit_hint'] else ''}")  # fmt: skip

    print("\n# Summary")
    print(" ".join(f"{k}={v}" for k, v in sorted(stats.items())))
    print("unit hints:", dict(hints.most_common(15)))
    print("no category:", dict(nocat.most_common(25)))


if __name__ == "__main__":
    main()
