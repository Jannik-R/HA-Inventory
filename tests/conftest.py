"""Shared fixtures."""

import pytest

from custom_components.pantry import db


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Load custom_components/ in every test."""


@pytest.fixture
def conn():
    """Migrated and seeded in-memory database."""
    c = db.connect(":memory:")
    db.migrate(c)
    return c
