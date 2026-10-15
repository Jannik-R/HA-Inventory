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

from . import label
from .const import (
    CONF_LABEL_HEIGHT,
    CONF_LABEL_PRINTER,
    CONF_LABEL_PRINTER_HOST,
    CONF_LABEL_WIDTH,
    CONF_PRINT_ON_BOOK_IN,
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

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirm and create the entry."""
        if user_input is None:
            return self.async_show_form(step_id="user")
        return self.async_create_entry(title="Pantry", data={})


class PantryOptionsFlow(OptionsFlow):
    """Label printer model, then host and label size. Read at print time, so no reload is needed."""

    _model = "browser"

    async def async_step_init(
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
        return self.async_show_form(step_id="init", data_schema=schema)

    async def async_step_label(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
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
                info = {"code": "PTRY:P0:", "name": "Testetikett", "brand": "Pantry", "expires_on": None}
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
                return self.async_create_entry(data=user_input)
            o = user_input
        fields: dict[Any, Any] = {}
        if model.network:
            fields[vol.Required(CONF_LABEL_PRINTER_HOST, default=printer_of(o)[1])] = str
        fields[vol.Required(CONF_LABEL_WIDTH, default=o.get(CONF_LABEL_WIDTH, model.default_width))] = _mm(model.max_width)
        fields[vol.Required(CONF_LABEL_HEIGHT, default=o.get(CONF_LABEL_HEIGHT, model.default_height))] = _mm(model.max_height)
        fields[vol.Required(CONF_PRINT_ON_BOOK_IN, default=o.get(CONF_PRINT_ON_BOOK_IN, True))] = bool
        if model.network:
            fields[vol.Optional(_TEST, default=False)] = bool
        return self.async_show_form(
            step_id="label",
            data_schema=vol.Schema(fields),
            errors=errors,
            description_placeholders={"port": str(model.port)},
        )
