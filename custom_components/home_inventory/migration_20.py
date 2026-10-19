"""Migration 20 (kept out of db.py for size): opened packages.

- opened_days (inheritable like shelf_days, NULL = inherit, nothing set = opening changes nothing):
  days an opened package keeps; effective expiry = min(batch date, opened_on + opened_days)
- batch.opened_on: an opened package is its own batch (same product, date and charge). The unique
  key gets opened_on, and canning_id loses its UNIQUE (a charge may have an opened batch beside it).
  The rebuild keeps batch ids, so stock and booking rows stay valid.
- booking kind 'open': one row naming the opened batch (its unopened batch is implied by the key),
  packages +n; an undo writes 'open' with -n and reverts_id. Rebuilt for the CHECK, ids kept.
"""

SCHEMA_20 = """
ALTER TABLE defaults ADD COLUMN opened_days INTEGER CHECK (opened_days > 0);
ALTER TABLE category ADD COLUMN opened_days INTEGER CHECK (opened_days > 0);
ALTER TABLE product ADD COLUMN opened_days INTEGER CHECK (opened_days > 0);
CREATE TABLE batch_new (
    id INTEGER PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    expires_on TEXT,
    created_at TEXT NOT NULL,
    canning_id INTEGER REFERENCES canning(id) ON DELETE CASCADE,
    opened_on TEXT CHECK (opened_on IS NULL OR date(opened_on) IS opened_on)
);
INSERT INTO batch_new (id, product_id, expires_on, created_at, canning_id)
    SELECT id, product_id, expires_on, created_at, canning_id FROM batch;
DROP TABLE batch;
ALTER TABLE batch_new RENAME TO batch;
CREATE UNIQUE INDEX batch_key ON batch
    (product_id, ifnull(expires_on, ''), ifnull(canning_id, 0), ifnull(opened_on, ''));
CREATE INDEX batch_canning ON batch (canning_id);
CREATE TABLE booking_new (
    id INTEGER PRIMARY KEY,
    ts TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('in', 'out', 'move', 'correct', 'open')),
    batch_id INTEGER NOT NULL REFERENCES batch(id) ON DELETE CASCADE,
    location_id INTEGER REFERENCES location(id),
    to_location_id INTEGER REFERENCES location(id),
    packages INTEGER NOT NULL,
    source TEXT NOT NULL,
    user_id TEXT,
    reverts_id INTEGER REFERENCES booking(id)
);
INSERT INTO booking_new SELECT id, ts, kind, batch_id, location_id, to_location_id, packages,
    source, user_id, reverts_id FROM booking;
DROP TABLE booking;
ALTER TABLE booking_new RENAME TO booking;
CREATE INDEX booking_batch ON booking (batch_id);
CREATE UNIQUE INDEX booking_reverts ON booking (reverts_id);
"""
