"""Constants for the Pantry integration."""

DOMAIN = "pantry"
PANEL_URL = "/pantry_static"
SIGNAL_CHANGED = f"{DOMAIN}_changed"  # dispatcher: the DB was written

# Options (config entry); label size in mm. A receipt printer will be a separate setting later.
CONF_LABEL_PRINTER = "label_printer"  # model key, see label_printers.MODELS
CONF_LABEL_PRINTER_HOST = "label_printer_host"
CONF_LABEL_WIDTH = "label_width"
CONF_LABEL_HEIGHT = "label_height"
CONF_PRINT_ON_BOOK_IN = "print_on_book_in"
