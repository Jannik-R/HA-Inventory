"""Shared fixtures."""

import pytest

from custom_components.home_inventory import db


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Load custom_components/ in every test."""


@pytest.fixture
def hass_config_dir(hass_tmp_config_dir: str) -> str:
    """Own config dir per test: a fresh home_inventory.db, and parallel workers (xdist) never share it."""
    return hass_tmp_config_dir


@pytest.fixture
def conn():
    """Migrated and seeded in-memory database."""
    c = db.connect(":memory:")
    db.migrate(c)
    return c
