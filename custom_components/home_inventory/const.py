"""Constants for the Home Inventory integration."""

DOMAIN = "home_inventory"
PANEL_URL = "/home_inventory_static"
SIGNAL_CHANGED = f"{DOMAIN}_changed"  # dispatcher: the DB was written
MAX_LABELS = 20  # per print call (any user may print); also in the panel (label-print.ts)

# Options (config entry); label size in mm. A receipt printer will be a separate setting later.
CONF_LABEL_PRINTER = "label_printer"  # model key, see label_printers.MODELS
CONF_LABEL_PRINTER_HOST = "label_printer_host"
CONF_LABEL_WIDTH = "label_width"
CONF_LABEL_HEIGHT = "label_height"
CONF_PRINT_ON_BOOK_IN = "print_on_book_in"
# Receipt printer (shopping list): device path or host[:port], paper width mm, cutter, serial baud.
CONF_RECEIPT_PRINTER = "receipt_printer"
CONF_RECEIPT_WIDTH = "receipt_width"
CONF_RECEIPT_CUT = "receipt_cut"
CONF_RECEIPT_BAUD = "receipt_baud"
CONF_HOUSEHOLD_SERVINGS = "household_servings"  # default servings of the week planner
DEFAULT_SERVINGS = 3
# Booking in: fill the date field with the guess (today + shelf life); off = empty field, guessed on save.
CONF_PREFILL_EXPIRY = "prefill_expiry"
CONF_AI_TASK = "ai_task_entity"  # AI Task entity that checks recipe imports; unset = no AI
# External services (options step "Externe Dienste"): option key -> default. Every way data leaves HA
# is one entry here, gated with `external()`; the user decides the default of a new one (CLAUDE.md).
EXTERNAL = {
    "off_lookup": True,  # Open Food Facts: unknown EAN, online search
    "recipe_url": True,  # recipe import loads the page of a link
    "ai_recipe_check": True,  # AI checks every recipe import
    "ai_product_check": True,  # AI checks a new product from Open Food Facts
    "ai_import": True,  # AI reads a link without recipe data, pasted text, a photo
    "ai_video": False,  # yt-dlp downloads a post's video for the AI (platform terms forbid it)
    "receipt_import": True,  # AI reads the receipt text; the browser loads OCR libraries from jsDelivr
}
_NEEDS_AI = {"ai_recipe_check", "ai_product_check", "ai_import", "ai_video", "receipt_import"}
# What Assist agents / the MCP Server may do through the LLM API: read, + shopping list and plan, + booking.
CONF_LLM_ACCESS = "llm_access"
LLM_ACCESS = ["read", "plan", "all"]
DEFAULT_LLM_ACCESS = "plan"
# Optional panel parts (tabs, and the todo/calendar entity of shopping/plan); unset = all.
CONF_MODULES = "modules"
MODULES = ["shopping", "recipes", "plan", "canning", "opened"]


def modules_of(options) -> list[str]:
    return options.get(CONF_MODULES, MODULES)


def external(options, key: str) -> bool:
    """An external service is allowed by the options (AI ones also need the AI Task entity)."""
    on = options.get(key, EXTERNAL[key])
    return bool(on and (key not in _NEEDS_AI or options.get(CONF_AI_TASK)))
