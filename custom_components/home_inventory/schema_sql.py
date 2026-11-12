"""The 1.0.0 baseline schema (data only): what migrations 1-32 of the 0.x versions ended up with,
plus the one fixed table content they inserted (meal start times).

`db.migrate` runs it on a new file and sets `PRAGMA application_id` and `user_version` (`migrations.APP_ID`, `BASELINE`). Column
order matters (code reads rows by position). Never edit it after 1.0.0: later changes are steps in
`migrations.MIGRATIONS`.
"""

SCHEMA = """
CREATE TABLE batch (
    id INTEGER PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    expires_on TEXT,
    created_at TEXT NOT NULL,
    canning_id INTEGER REFERENCES canning(id) ON DELETE CASCADE,
    opened_on TEXT CHECK (opened_on IS NULL OR date(opened_on) IS opened_on),
    expiry_guessed INTEGER NOT NULL DEFAULT 0 CHECK (expiry_guessed IN (0, 1)),
    frozen_on TEXT CHECK (frozen_on IS NULL OR date(frozen_on) IS frozen_on),
    remaining REAL NOT NULL DEFAULT 1 CHECK (remaining > 0 AND remaining <= 1)
);
CREATE TABLE booking (
    id INTEGER PRIMARY KEY,
    ts TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('in', 'out', 'move', 'correct', 'open', 'freeze', 'thaw', 'remaining')),
    batch_id INTEGER NOT NULL REFERENCES batch(id) ON DELETE CASCADE,
    location_id INTEGER REFERENCES location(id),
    to_location_id INTEGER REFERENCES location(id),
    packages INTEGER NOT NULL,
    source TEXT NOT NULL,
    user_id TEXT,
    reverts_id INTEGER REFERENCES booking(id),
    action_id INTEGER
);
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
    kind TEXT NOT NULL DEFAULT 'canning' CHECK (kind IN ('canning', 'drying', 'leftover')),
    UNIQUE (made_on, seq)
);
CREATE TABLE category (
    id INTEGER PRIMARY KEY,
    parent_id INTEGER REFERENCES category(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    sort INTEGER NOT NULL DEFAULT 0,
    unit_id INTEGER REFERENCES unit(id),
    default_location_id INTEGER REFERENCES location(id),
    expiry_type TEXT CHECK (expiry_type IN ('best_before', 'use_by', 'guide')),
    warn_days INTEGER CHECK (warn_days >= 0),
    min_stock REAL CHECK (min_stock > 0),
    min_stock_unit_id INTEGER REFERENCES unit(id),
    min_packages INTEGER CHECK (min_packages > 0),
    shelf_days INTEGER CHECK (shelf_days > 0),
    food INTEGER CHECK (food IN (0, 1)),
    opened_days INTEGER CHECK (opened_days > 0),
    frozen_goods INTEGER CHECK (frozen_goods IN (0, 1)),
    frozen_days INTEGER CHECK (frozen_days > 0),
    emergency_group TEXT CHECK (emergency_group IN ('drinks', 'grains', 'vegetables', 'fruit_nuts', 'dairy', 'meat_fish_eggs', 'fats', 'none')),
    diet TEXT CHECK (diet IN ('vegan', 'vegetarian', 'none')),
    allergens TEXT,
    UNIQUE (parent_id, name),
    CHECK ((min_stock IS NULL) = (min_stock_unit_id IS NULL))
);
CREATE TABLE category_off_tag (
    category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE CASCADE,
    off_tag_id INTEGER NOT NULL REFERENCES off_tag(id) ON DELETE CASCADE,
    PRIMARY KEY (category_id, off_tag_id)
);
CREATE TABLE defaults (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    unit_id INTEGER NOT NULL REFERENCES unit(id),
    default_location_id INTEGER REFERENCES location(id),
    expiry_type TEXT NOT NULL CHECK (expiry_type IN ('best_before', 'use_by', 'guide')),
    warn_days INTEGER NOT NULL CHECK (warn_days >= 0),
    shelf_days INTEGER CHECK (shelf_days > 0),
    opened_days INTEGER CHECK (opened_days > 0),
    frozen_days INTEGER CHECK (frozen_days > 0),
    seed_lang TEXT NOT NULL DEFAULT 'de' CHECK (seed_lang IN ('de', 'en'))
);
CREATE TABLE learned_category (
    kind TEXT NOT NULL CHECK (kind IN ('ingredient', 'off_tag')),
    key TEXT NOT NULL CHECK (key <> ''),
    category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE CASCADE,
    PRIMARY KEY (kind, key)
);
CREATE TABLE location (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    sort INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
    freezer INTEGER NOT NULL DEFAULT 0 CHECK (freezer IN (0, 1))
);
CREATE TABLE meal_plan (
    id INTEGER PRIMARY KEY,
    day TEXT NOT NULL CHECK (date(day) IS day),
    recipe_id INTEGER REFERENCES recipe(id) ON DELETE SET NULL,
    text TEXT NOT NULL CHECK (trim(text) <> ''),
    slot INTEGER NOT NULL CHECK (slot BETWEEN 0 AND 4),
    servings INTEGER NOT NULL CHECK (servings > 0)
);
CREATE TABLE meal_time (
    slot INTEGER PRIMARY KEY CHECK (slot BETWEEN 0 AND 4),
    start TEXT NOT NULL CHECK (start GLOB '[0-2][0-9]:[0-5][0-9]' AND start < '24:00')
);
CREATE TABLE off_tag (
    id INTEGER PRIMARY KEY,
    tag TEXT NOT NULL UNIQUE
);
CREATE TABLE product (
    id INTEGER PRIMARY KEY,
    ean TEXT UNIQUE,
    name TEXT NOT NULL,
    brand TEXT,
    category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE RESTRICT,
    content_amount REAL CHECK (content_amount > 0),
    content_unit_id INTEGER REFERENCES unit(id),
    default_location_id INTEGER REFERENCES location(id),
    expiry_type TEXT CHECK (expiry_type IN ('best_before', 'use_by', 'guide')),
    warn_days INTEGER CHECK (warn_days >= 0),
    image_url TEXT,
    off_json TEXT,
    updated_at TEXT NOT NULL,
    min_packages INTEGER CHECK (min_packages > 0),
    shelf_days INTEGER CHECK (shelf_days > 0),
    opened_days INTEGER CHECK (opened_days > 0),
    frozen_days INTEGER CHECK (frozen_days > 0),
    diet TEXT CHECK (diet IN ('vegan', 'vegetarian', 'none')),
    allergens TEXT,
    CHECK ((content_amount IS NULL) = (content_unit_id IS NULL))
);
CREATE TABLE receipt_line (
    store TEXT NOT NULL,
    key TEXT NOT NULL CHECK (key <> ''),
    product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    PRIMARY KEY (store, key)
);
CREATE TABLE recipe (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    servings INTEGER NOT NULL CHECK (servings > 0),
    instructions TEXT,
    source_url TEXT,
    image_url TEXT,
    canning_product_id INTEGER REFERENCES product(id) ON DELETE CASCADE,
    canning_temp INTEGER CHECK (canning_temp BETWEEN 1 AND 200),
    canning_minutes INTEGER CHECK (canning_minutes > 0) CHECK ((canning_temp IS NULL) = (canning_minutes IS NULL)) CHECK (canning_minutes IS NULL OR canning_product_id IS NOT NULL),
    canning_kind TEXT NOT NULL DEFAULT 'canning' CHECK (canning_kind IN ('canning', 'drying'))
);
CREATE TABLE recipe_ingredient (
    id INTEGER PRIMARY KEY,
    recipe_id INTEGER NOT NULL REFERENCES recipe(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES category(id) ON DELETE SET NULL,
    amount REAL CHECK (amount > 0),
    unit_id INTEGER REFERENCES unit(id),
    text TEXT NOT NULL,
    note TEXT,
    optional INTEGER NOT NULL DEFAULT 0 CHECK (optional IN (0, 1)),
    skip_stock INTEGER NOT NULL DEFAULT 0 CHECK (skip_stock IN (0, 1)),
    CHECK ((amount IS NULL) = (unit_id IS NULL))
);
CREATE TABLE recipe_step (
    id INTEGER PRIMARY KEY,
    recipe_id INTEGER NOT NULL REFERENCES recipe(id) ON DELETE CASCADE,
    pos INTEGER NOT NULL,
    section TEXT CHECK (section IS NULL OR length(section) BETWEEN 1 AND 100),
    text TEXT NOT NULL CHECK (trim(text) <> '' AND length(text) <= 2000),
    UNIQUE (recipe_id, pos)
);
CREATE TABLE shopping_done (
    category_id INTEGER PRIMARY KEY REFERENCES category(id) ON DELETE CASCADE,
    missing TEXT NOT NULL
);
CREATE TABLE shopping_done_product (
    product_id INTEGER PRIMARY KEY REFERENCES product(id) ON DELETE CASCADE,
    missing TEXT NOT NULL
);
CREATE TABLE shopping_done_recipe (
    uid TEXT PRIMARY KEY,
    missing TEXT NOT NULL
);
CREATE TABLE shopping_item (
    id INTEGER PRIMARY KEY,
    product_id INTEGER UNIQUE REFERENCES product(id) ON DELETE CASCADE,
    category_id INTEGER UNIQUE REFERENCES category(id) ON DELETE CASCADE,
    packages INTEGER NOT NULL DEFAULT 1 CHECK (packages > 0),
    done INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0, 1)),
    created_at TEXT NOT NULL,
    CHECK ((product_id IS NULL) <> (category_id IS NULL))
);
CREATE TABLE shopping_recipe (
    recipe_id INTEGER PRIMARY KEY REFERENCES recipe(id) ON DELETE CASCADE,
    servings INTEGER NOT NULL CHECK (servings > 0)
);
CREATE TABLE shopping_recipe_optional (
    recipe_id INTEGER NOT NULL REFERENCES shopping_recipe(recipe_id) ON DELETE CASCADE,
    ingredient_id INTEGER NOT NULL REFERENCES recipe_ingredient(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, ingredient_id)
);
CREATE TABLE stock (
    batch_id INTEGER NOT NULL REFERENCES batch(id) ON DELETE CASCADE,
    location_id INTEGER NOT NULL REFERENCES location(id) ON DELETE RESTRICT,
    packages INTEGER NOT NULL CHECK (packages > 0),
    PRIMARY KEY (batch_id, location_id)
);
CREATE TABLE unit (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    symbol TEXT NOT NULL,
    base_unit_id INTEGER REFERENCES unit(id),
    factor REAL NOT NULL DEFAULT 1 CHECK (factor > 0),
    is_count INTEGER NOT NULL DEFAULT 0 CHECK (is_count IN (0, 1)),
    recipe_only INTEGER NOT NULL DEFAULT 0 CHECK (recipe_only IN (0, 1))
);
INSERT INTO meal_time (slot, start)
    VALUES (0, '05:00'), (1, '11:00'), (2, '14:30'), (3, '17:00'), (4, '20:30');
CREATE INDEX batch_canning ON batch (canning_id);
CREATE UNIQUE INDEX batch_key ON batch (product_id, ifnull(expires_on, ''), ifnull(canning_id, 0), ifnull(opened_on, ''), ifnull(frozen_on, '')) WHERE remaining = 1;
CREATE INDEX booking_action ON booking (action_id);
CREATE INDEX booking_batch ON booking (batch_id);
CREATE UNIQUE INDEX booking_reverts ON booking (reverts_id);
CREATE UNIQUE INDEX category_root_name ON category (name) WHERE parent_id IS NULL;
CREATE INDEX meal_plan_day ON meal_plan (day);
CREATE INDEX recipe_ingredient_recipe ON recipe_ingredient (recipe_id);
"""
