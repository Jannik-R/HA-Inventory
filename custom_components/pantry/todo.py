"""Shopping list as a todo entity: categories below their min stock plus items added by hand."""

from __future__ import annotations

from functools import partial
from typing import TYPE_CHECKING

from homeassistant.components.todo import (
    TodoItem,
    TodoItemStatus,
    TodoListEntity,
    TodoListEntityFeature,
)
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
)

from . import inventory
from .const import DOMAIN
from .coordinator import async_coordinator, device_info
from .inventory import InventoryError

if TYPE_CHECKING:
    from . import PantryConfigEntry


async def async_setup_entry(
    hass: HomeAssistant,
    entry: PantryConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    db = entry.runtime_data

    async def update() -> list[dict]:
        return await db.run(inventory.shopping_list)

    async_add_entities([ShoppingList(await async_coordinator(hass, entry, update), entry)])


def summary(item: dict) -> str:
    """'Nudeln – 0,5 kg und 1 Packung fehlen'; by hand: 'Spaghetti (2 Packungen)'."""
    # shortcut: German text and decimal comma like the device name; translate when needed.
    n = item["packages"]
    count = f"{n} {'Packung' if n == 1 else 'Packungen'}" if n else ""
    if item["manual"]:
        return item["name"] if n == 1 else f"{item['name']} ({count})"
    parts = []
    if a := item["amount"]:
        parts.append(f"{a['missing']:g} {a['unit_symbol']}".replace(".", ","))
    if count:
        parts.append(count)
    more = "weitere " if item["any_of_subtree"] else ""
    return f"{item['name']} – {more}{' und '.join(parts)} fehlen"


def uid(item: dict) -> str:
    """'m<id>' for items added by hand, 'c<category id>' for min stock shortages."""
    return f"m{item['id']}" if item["manual"] else f"c{item['category_id']}"


class ShoppingList(CoordinatorEntity[DataUpdateCoordinator[list[dict]]], TodoListEntity):
    """Min stock items: checking one holds until its shortage changes; they cannot be deleted.
    Items by hand: added by the name of a product or category, checked and deleted freely."""

    _attr_has_entity_name = True
    _attr_translation_key = "shopping"
    _attr_supported_features = (
        TodoListEntityFeature.CREATE_TODO_ITEM
        | TodoListEntityFeature.UPDATE_TODO_ITEM
        | TodoListEntityFeature.DELETE_TODO_ITEM
    )

    def __init__(self, coordinator, entry: PantryConfigEntry) -> None:
        super().__init__(coordinator)
        self._db = entry.runtime_data
        self._attr_unique_id = f"{entry.entry_id}_shopping"
        self._attr_device_info = device_info(entry)

    @property
    def todo_items(self) -> list[TodoItem]:
        return [
            TodoItem(
                summary=summary(i),
                uid=uid(i),
                status=TodoItemStatus.COMPLETED if i["done"] else TodoItemStatus.NEEDS_ACTION,
            )
            for i in self.coordinator.data
        ]

    async def _run(self, fn, *args) -> None:
        try:
            await self._db.run(fn, *args)
        except InventoryError as err:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key=err.translation_key,
                translation_placeholders={k: str(v) for k, v in err.placeholders.items()},
            ) from err

    async def async_create_todo_item(self, item: TodoItem) -> None:
        await self._run(inventory.add_shopping_by_name, item.summary or "")

    async def async_update_todo_item(self, item: TodoItem) -> None:
        """Only the check mark counts; the text follows the stock / the product."""
        done = item.status == TodoItemStatus.COMPLETED
        kind, ref = item.uid[0], int(item.uid[1:])
        if kind == "m":
            await self._run(partial(inventory.update_shopping_item, done=done), ref)
        else:
            await self._run(inventory.set_shopping_done, ref, done)

    async def async_delete_todo_items(self, uids: list[str]) -> None:
        """Deletes items by hand; min stock items stay (HA's "clear checked" sends them too)."""
        for u in uids:
            if u.startswith("m"):
                await self._run(inventory.delete_shopping_item, int(u[1:]))
