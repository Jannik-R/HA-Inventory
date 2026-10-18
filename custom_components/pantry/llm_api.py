"""LLM API "Home Inventory" for Assist agents and HA's MCP Server. Read tools call `inventory`
(trimmed rows, names instead of ids); write tools call the pantry services, so validation,
defaults and the booking user are the services' own. Which tools exist: options `llm_access`."""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from datetime import date
from typing import Any

import probatio
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import llm
from homeassistant.util import dt as dt_util

from . import inventory, todo
from .const import CONF_LLM_ACCESS, DEFAULT_LLM_ACCESS, DOMAIN, LLM_ACCESS
from .ws_common import run

PROMPT = (
    "Home Inventory (Vorrat) tracks the household's stock (food, household goods, medicine, "
    "home-canned jars) by product, location and best-before date, plus recipes, a shopping list "
    "and a meal plan. Refer to products, recipes and locations by the names the read tools return. "
    "Dates are YYYY-MM-DD. Stock is counted in packages."
)
_READ = llm.ToolAnnotations(read_only=True, destructive=False, idempotent=True, open_world=False)
_ADD = llm.ToolAnnotations(read_only=False, destructive=False, idempotent=False, open_world=False)
_BOOK = llm.ToolAnnotations(read_only=False, destructive=True, idempotent=False, open_world=False)

_SEARCH = probatio.Optional("search", description="Part of a name, brand, category or location")
_DATE = "Date YYYY-MM-DD; default today"
_RECIPE = probatio.Required("recipe", description="Recipe name as get_recipes returns it")
_SERVINGS = probatio.Optional("servings", description="Servings; default the household's")
_PRODUCT = probatio.Required(
    "product", description="Product name as get_stock returns it, or its EAN barcode"
)
_LOCATION = probatio.Optional("location", description="Location name, e.g. Kühlschrank")
_PACKAGES = probatio.Optional("packages", description="Number of packages; default 1")
_MEAL = probatio.Optional("meal", description="Meal; default dinner")

type Call = Callable[[HomeAssistant, dict, llm.LLMContext], Awaitable[Any]]


def _day(value: str | None) -> date:
    try:
        return date.fromisoformat(value) if value else dt_util.now().date()
    except ValueError as err:
        raise HomeAssistantError(
            translation_domain=DOMAIN, translation_key="invalid_value"
        ) from err


def _service(name: str, rename: dict[str, str] | None = None) -> Call:
    """A write tool = the service of that name (arguments renamed, e.g. product -> code)."""

    async def call(hass: HomeAssistant, args: dict, ctx: llm.LLMContext) -> Any:
        data = {(rename or {}).get(k, k): v for k, v in args.items()}
        return await hass.services.async_call(
            DOMAIN, name, data, blocking=True, context=ctx.context, return_response=True
        )

    return call


async def _shopping_list(hass: HomeAssistant, args: dict, ctx: llm.LLMContext) -> Any:
    lang = (ctx.language or "de").split("-")[0]
    items = await run(hass, inventory.shopping_list)
    return [{"item": todo.summary(i, lang), "done": i["done"]} for i in items]


async def _add_item(hass: HomeAssistant, args: dict, ctx: llm.LLMContext) -> Any:
    await run(hass, inventory.add_shopping_by_name, args["name"])
    return {"added": args["name"]}


@dataclass(frozen=True)
class Spec:
    level: str  # lowest access level that has this tool
    name: str
    description: str
    parameters: dict
    call: Call
    annotations: llm.ToolAnnotations = _READ


SPECS = [
    Spec("read", "get_stock", "List the stock: one row per product batch and location.",
         {_SEARCH: str},
         lambda h, a, c: run(h, inventory.assist_stock, a.get("search"))),
    Spec("read", "get_expiring", "List stock that is expired or expires soon (the product's own "
         "warning days, or within `days`).",
         {probatio.Optional("days", description="Expiring within this many days"):
          probatio.All(int, probatio.Range(min=0, max=366))},
         lambda h, a, c: run(h, inventory.assist_expiring, _day(None), a.get("days"))),
    Spec("read", "get_recipes", "List the recipes with how many required ingredients are in stock.",
         {_SEARCH: str},
         lambda h, a, c: run(h, inventory.assist_recipes, a.get("search"))),
    Spec("read", "get_recipe", "One recipe: ingredients (scaled to `servings`) with their stock "
         "status (available, partial, missing, skipped, unmatched) and the steps.",
         {_RECIPE: str, _SERVINGS: probatio.All(int, probatio.Range(min=1, max=99))},
         lambda h, a, c: run(h, inventory.assist_recipe, a["recipe"], a.get("servings"))),
    Spec("read", "get_shopping_list", "List the shopping list (what is missing and items added "
         "by hand).", {}, _shopping_list),
    Spec("read", "get_meal_plan", "List the planned dishes of the meal plan.",
         {probatio.Optional("start", description=_DATE): str,
          probatio.Optional("days", description="Number of days; default 7"):
          probatio.All(int, probatio.Range(min=1, max=31))},
         lambda h, a, c: run(h, inventory.assist_meal_plan, _day(a.get("start")),
                             a.get("days") or 7)),
    Spec("plan", "add_to_shopping_list", "Put a product or category on the shopping list "
         "(exact name of a product or category).",
         {probatio.Required("name", description="Product or category name"): str},
         _add_item, _ADD),
    Spec("plan", "add_recipe_to_shopping_list", "Put what is missing for a recipe on the "
         "shopping list.",
         {_RECIPE: str, _SERVINGS: probatio.All(int, probatio.Range(min=1, max=99))},
         _service("shop_recipe"), _ADD),
    Spec("plan", "plan_meal", "Plan a dish in the meal plan: a recipe by name or free text.",
         {probatio.Optional("recipe", description="Recipe name"): str,
          probatio.Optional("text", description="Free text dish when there is no recipe"): str,
          probatio.Optional("day", description=_DATE): str,
          _MEAL: probatio.In(inventory.MEALS),
          _SERVINGS: probatio.All(int, probatio.Range(min=1, max=99))},
         _service("plan_meal"), _ADD),
    Spec("all", "book_in", "Book packages of a known product into the stock.",
         {_PRODUCT: str, _PACKAGES: probatio.All(int, probatio.Range(min=1, max=999)),
          probatio.Optional("expires_on", description="Best-before date YYYY-MM-DD"): str,
          _LOCATION: str},
         _service("book_in", {"product": "code"}), _BOOK),
    Spec("all", "book_out", "Take packages of a product out of the stock (earliest expiry first).",
         {_PRODUCT: str, _PACKAGES: probatio.All(int, probatio.Range(min=1, max=999)),
          _LOCATION: str},
         _service("book_out", {"product": "code"}), _BOOK),
    Spec("all", "open_package", "Mark one package of a product as opened (earliest expiry first).",
         {_PRODUCT: str, _LOCATION: str},
         _service("open_package", {"product": "code"}), _BOOK),
]  # fmt: skip


class PantryTool(llm.Tool):
    def __init__(self, spec: Spec) -> None:
        self.name = spec.name
        self.description = spec.description
        self.parameters = probatio.Schema(spec.parameters)
        self.annotations = spec.annotations
        self.integration = DOMAIN
        self._call = spec.call

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context: llm.LLMContext
    ) -> llm.ToolResult:
        args = self.parameters(tool_input.tool_args)
        result = await self._call(hass, args, llm_context)
        return llm.ToolResult(data={"result": result})


@dataclass(slots=True, kw_only=True)
class PantryAPI(llm.API):
    tools: list[llm.Tool]

    async def async_get_api_instance(self, llm_context: llm.LLMContext) -> llm.APIInstance:
        return llm.APIInstance(
            api=self, api_prompt=PROMPT, llm_context=llm_context, tools=self.tools
        )


def tools_for(access: str) -> list[llm.Tool]:
    """The tools of an access level (read < plan < all)."""
    rank = LLM_ACCESS.index(access if access in LLM_ACCESS else DEFAULT_LLM_ACCESS)
    return [PantryTool(s) for s in SPECS if LLM_ACCESS.index(s.level) <= rank]


@callback
def async_register(hass: HomeAssistant, options: dict) -> CALLBACK_TYPE:
    """Register the API (the entry reloads on an options change, so the tools are fixed here)."""
    tools = tools_for(options.get(CONF_LLM_ACCESS, DEFAULT_LLM_ACCESS))
    return llm.async_register_api(
        hass, PantryAPI(hass=hass, id=DOMAIN, name="Home Inventory", tools=tools)
    )
