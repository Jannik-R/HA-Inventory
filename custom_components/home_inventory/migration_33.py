"""Migration 33: stored Open Food Facts product pictures from the 100/200 px to the 400 px file."""

from __future__ import annotations

import sqlite3

# OFF scheme: .../front_de.12.200.jpg -> .../front_de.12.400.jpg (the Open * Facts family shares it)
_HOSTS = (
    "openfoodfacts.org",
    "openbeautyfacts.org",
    "openpetfoodfacts.org",
    "openproductsfacts.org",
)


def bigger_images(conn: sqlite3.Connection) -> None:
    for host in _HOSTS:
        for old in ("100", "200"):
            conn.execute(
                "UPDATE product SET image_url = substr(image_url, 1, length(image_url) - 8)"
                " || '.400.jpg' WHERE image_url LIKE ? AND image_url LIKE ?",
                (f"https://%{host}/%", f"%.{old}.jpg"),
            )
