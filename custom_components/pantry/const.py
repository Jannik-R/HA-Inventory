"""Constants for the Pantry integration."""

DOMAIN = "pantry"
PANEL_URL = "/pantry_static"
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
CONF_AI_TASK = "ai_task_entity"  # AI Task entity that checks recipe imports; unset = no AI
