"""Migration 15 (data only, kept out of db.py for size): non-food categories, shelf life, canning.

- category.food: 0 = not a food (never a recipe ingredient), NULL = inherit (root: food)
- shelf_days (inheritable like warn_days): proposes the expiry date (today / made-on date + days)
- recipe.canning_product_id: a canning recipe and the product it makes (managed in the Einkochen
  tab, not in Rezepte); canning_temp / canning_minutes (both or none) only on such a recipe;
  deleting the product deletes its canning recipes
- canning: the protocol; a charge = made_on + seq (YYYYMMDD-seq)
- batch.canning_id: a charge is its own batch, so the unique key gets the canning id
  (expression index: NULLs would be distinct in a plain UNIQUE). The rebuild keeps batch ids,
  so stock and booking rows stay valid (foreign keys are off during a step, see db.migrate).
"""

SCHEMA_15 = """
ALTER TABLE defaults ADD COLUMN shelf_days INTEGER CHECK (shelf_days > 0);
ALTER TABLE category ADD COLUMN shelf_days INTEGER CHECK (shelf_days > 0);
ALTER TABLE category ADD COLUMN food INTEGER CHECK (food IN (0, 1));
ALTER TABLE product ADD COLUMN shelf_days INTEGER CHECK (shelf_days > 0);
ALTER TABLE recipe ADD COLUMN canning_product_id INTEGER
    REFERENCES product(id) ON DELETE CASCADE;
ALTER TABLE recipe ADD COLUMN canning_temp INTEGER CHECK (canning_temp BETWEEN 1 AND 200);
ALTER TABLE recipe ADD COLUMN canning_minutes INTEGER CHECK (canning_minutes > 0)
    CHECK ((canning_temp IS NULL) = (canning_minutes IS NULL))
    CHECK (canning_minutes IS NULL OR canning_product_id IS NOT NULL);
CREATE TABLE canning (
    id INTEGER PRIMARY KEY,
    made_on TEXT NOT NULL CHECK (date(made_on) IS made_on),
    seq INTEGER NOT NULL CHECK (seq > 0),
    product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES recipe(id) ON DELETE SET NULL,
    jars INTEGER NOT NULL CHECK (jars > 0),
    temp INTEGER CHECK (temp BETWEEN 1 AND 200),
    minutes INTEGER CHECK (minutes > 0),
    notes TEXT NOT NULL DEFAULT '',
    UNIQUE (made_on, seq)
);
CREATE TABLE batch_new (
    id INTEGER PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    expires_on TEXT,
    created_at TEXT NOT NULL,
    canning_id INTEGER UNIQUE REFERENCES canning(id) ON DELETE CASCADE
);
INSERT INTO batch_new (id, product_id, expires_on, created_at)
    SELECT id, product_id, expires_on, created_at FROM batch;
DROP TABLE batch;
ALTER TABLE batch_new RENAME TO batch;
CREATE UNIQUE INDEX batch_key ON batch (product_id, ifnull(expires_on, ''), ifnull(canning_id, 0));
"""
