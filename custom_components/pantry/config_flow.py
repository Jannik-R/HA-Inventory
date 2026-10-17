"""Config flow for the Pantry integration."""

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.selector import (
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
)

from . import label, receipt
from .const import (
    CONF_LABEL_HEIGHT,
    CONF_LABEL_PRINTER,
    CONF_LABEL_PRINTER_HOST,
    CONF_LABEL_WIDTH,
    CONF_PRINT_ON_BOOK_IN,
    CONF_RECEIPT_BAUD,
    CONF_RECEIPT_CUT,
    CONF_RECEIPT_PRINTER,
    CONF_RECEIPT_WIDTH,
    DOMAIN,
)
from .label_printers import MODELS, printer_of

_TEST = "test_print"


def _mm(maximum: int) -> NumberSelector:
    """Text field in mm (the default slider is hard to set exactly)."""
    return NumberSelector(
        NumberSelectorConfig(
            min=10, max=maximum, step=1, mode=NumberSelectorMode.BOX, unit_of_measurement="mm"
        )
    )


class PantryConfigFlow(ConfigFlow, domain=DOMAIN):
    """Single-step setup; label printing is configured in the options."""

    VERSION = 1

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return PantryOptionsFlow()

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Confirm and create the entry."""
        if user_input is None:
            return self.async_show_form(step_id="user")
        return self.async_create_entry(title="Pantry", data={})


class PantryOptionsFlow(OptionsFlow):
    """Menu: label printer (model, then host and size) or receipt printer. Read at print time, so no
    reload is needed; each part keeps the options of the other."""

    _model = "browser"

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        return self.async_show_menu(step_id="init", menu_options=["label_model", "receipt"])

    def _save(self, data: dict[str, Any]) -> ConfigFlowResult:
        return self.async_create_entry(data={**self.config_entry.options, **data})

    async def async_step_label_model(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            self._model = user_input[CONF_LABEL_PRINTER]
            return await self.async_step_label()
        schema = vol.Schema(
            {
                vol.Required(
                    CONF_LABEL_PRINTER, default=printer_of(self.config_entry.options)[0]
                ): SelectSelector(
                    SelectSelectorConfig(options=list(MODELS), translation_key=CONF_LABEL_PRINTER)
                )
            }
        )
        return self.async_show_form(step_id="label_model", data_schema=schema)

    async def async_step_label(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        model = MODELS[self._model]
        o = self.config_entry.options
        if user_input is not None:
            test = user_input.pop(_TEST, False)
            host = user_input.get(CONF_LABEL_PRINTER_HOST, "").strip()
            user_input[CONF_LABEL_PRINTER] = self._model
            if model.network:
                user_input[CONF_LABEL_PRINTER_HOST] = host
                if not host:
                    errors[CONF_LABEL_PRINTER_HOST] = "host_required"
            if test and not errors:
                info = {
                    "code": "PTRY:P0:",
                    "name": "Testetikett",
                    "brand": "Pantry",
                    "expires_on": None,
                }
                try:
                    image = await self.hass.async_add_executor_job(
                        label.render,
                        info,
                        user_input[CONF_LABEL_WIDTH],
                        user_input[CONF_LABEL_HEIGHT],
                        model.bottom_reserve_mm,
                    )
                    await label.send(host, model.encode([image]), model.port)
                except (HomeAssistantError, OSError):
                    errors["base"] = "printer_unreachable"
            if not errors:
                return self._save(user_input)
            o = user_input
        fields: dict[Any, Any] = {}
        if model.network:
            fields[vol.Required(CONF_LABEL_PRINTER_HOST, default=printer_of(o)[1])] = str
        fields[
            vol.Required(CONF_LABEL_WIDTH, default=o.get(CONF_LABEL_WIDTH, model.default_width))
        ] = _mm(model.max_width)
        fields[
            vol.Required(CONF_LABEL_HEIGHT, default=o.get(CONF_LABEL_HEIGHT, model.default_height))
        ] = _mm(model.max_height)
        fields[vol.Required(CONF_PRINT_ON_BOOK_IN, default=o.get(CONF_PRINT_ON_BOOK_IN, True))] = (
            bool
        )
        if model.network:
            fields[vol.Optional(_TEST, default=False)] = bool
        return self.async_show_form(
            step_id="label",
            data_schema=vol.Schema(fields),
            errors=errors,
            description_placeholders={"port": str(model.port)},
        )

    async def async_step_receipt(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Receipt printer: device path or host[:port] (empty = none), paper, cutter, baud."""
        errors: dict[str, str] = {}
        o = self.config_entry.options
        if user_input is not None:
            test = user_input.pop(_TEST, False)
            user_input[CONF_RECEIPT_PRINTER] = receipt.target_of(user_input)
            user_input[CONF_RECEIPT_WIDTH] = int(user_input[CONF_RECEIPT_WIDTH])
            user_input[CONF_RECEIPT_BAUD] = int(user_input[CONF_RECEIPT_BAUD])
            if test and user_input[CONF_RECEIPT_PRINTER]:
                lines = [("head", "Pantry"), ("item", "Testbon – Äpfel, Öl, Grüße")]
                width = receipt.DOTS[user_input[CONF_RECEIPT_WIDTH]]
                try:
                    img = await self.hass.async_add_executor_job(
                        receipt.render, "Testbon", lines, width
                    )
                    data = receipt.escpos(img, user_input[CONF_RECEIPT_CUT])
                    await receipt.async_send(self.hass, user_input, data)
                except HomeAssistantError:
                    errors["base"] = "printer_unreachable"
            if not errors:
                return self._save(user_input)
            o = user_input
        choices = lambda values: SelectSelector(  # noqa: E731
            SelectSelectorConfig(options=[str(v) for v in values])
        )
        schema = vol.Schema(
            {
                vol.Optional(
                    CONF_RECEIPT_PRINTER,
                    description={"suggested_value": receipt.target_of(o)},
                ): str,
                vol.Required(
                    CONF_RECEIPT_WIDTH, default=str(o.get(CONF_RECEIPT_WIDTH, 80))
                ): choices(receipt.DOTS),
                vol.Required(CONF_RECEIPT_CUT, default=o.get(CONF_RECEIPT_CUT, True)): bool,
                vol.Required(
                    CONF_RECEIPT_BAUD, default=str(o.get(CONF_RECEIPT_BAUD, 9600))
                ): choices(receipt.BAUDS),
                vol.Optional(_TEST, default=False): bool,
            }
        )
        return self.async_show_form(step_id="receipt", data_schema=schema, errors=errors)
