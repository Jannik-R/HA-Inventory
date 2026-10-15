"""Shared fixtures."""

from pathlib import Path

import pytest
from pytest_homeassistant_custom_component.common import get_test_config_dir

from custom_components.pantry import db


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Load custom_components/ in every test."""


@pytest.fixture(autouse=True)
def fresh_db():
    """The test config dir is shared within a run: every test starts with a new pantry.db."""
    Path(get_test_config_dir("pantry.db")).unlink(missing_ok=True)


@pytest.fixture
def conn():
    """Migrated and seeded in-memory database."""
    c = db.connect(":memory:")
    db.migrate(c)
    return c
