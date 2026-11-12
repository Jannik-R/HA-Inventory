"""dev/demo_data.py keeps working with the inventory layer and refuses a non-empty database."""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "dev"))
import demo_data


def test_fill_once(conn):
    demo_data.fill(conn)
    assert conn.execute("SELECT count(*) FROM product").fetchone()[0] > 15
    assert conn.execute("SELECT count(*) FROM recipe").fetchone()[0] >= 4
    with pytest.raises(SystemExit):
        demo_data.fill(conn)
