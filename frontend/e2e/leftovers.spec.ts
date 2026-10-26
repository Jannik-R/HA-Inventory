import { apiPage, openPage, panelConfig, remove, ws } from "./helpers";
import { expect, test } from "./fixtures";

const STAMP = Date.now();
const MODULES = [
  "shopping",
  "recipes",
  "plan",
  "canning",
  "drying",
  "opened",
  "frozen",
  "leftovers",
];
const plusDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** Delete the leftover products of this run (takes their protocols along) and the recipe. */
async function cleanup(page: Parameters<typeof openPage>[0], recipeId?: number) {
  const api = await apiPage(page.context().browser()!);
  const rows = (await ws(api, { type: "home_inventory/cannings" })) as {
    name: string;
    product_id: number;
  }[];
  for (const r of rows.filter(
    (x) => x.name.startsWith(`Reste: E2E`) && x.name.includes(`${STAMP}`),
  ))
    await remove(api, "product", r.product_id).catch(() => undefined);
  if (recipeId != null) await remove(api, "recipe", recipeId);
  await api.close();
}

test("cooked: store leftovers as a charge, label dialog, row in Haltbarmachen", async ({
  page,
  wsStub,
}) => {
  const NAME = `E2E Suppe ${STAMP}`;
  const api = await apiPage(page.context().browser()!);
  const { id } = (await ws(api, {
    type: "home_inventory/recipe_save",
    data: { name: NAME, servings: 4, ingredients: [{ text: "Linsen" }] },
  })) as { id: number };
  await api.close();
  wsStub("home_inventory/cooked_proposal", [
    {
      ingredient_id: 1,
      text: "Linsen",
      amount: 1,
      unit_symbol: "g",
      optional: false,
      checked: true,
      product_id: 1,
      candidates: [
        {
          product_id: 1,
          name: "Linsen",
          brand: null,
          batches: [
            {
              batch_id: 11,
              location: "Vorratsschrank",
              expires_on: "2027-01-01",
              packages: 2,
              opened: false,
              remaining: 1,
            },
          ],
          action: "out",
          packages: 1,
          open: 0,
          used_up: 0,
          remaining: null,
          batch_id: 11,
        },
      ],
    },
  ]);
  wsStub("home_inventory/cooked_book", {
    bookings: [{ product_id: 1, name: "Linsen", packages: 1, action: "out" }],
    out_ids: [1],
    open_ids: [],
    remaining_ids: [],
  });
  try {
    await openPage(page, "/home_inventory/recipes", "Rezepte");
    await panelConfig(page, { modules: MODULES }); // the dev HA may have its modules saved earlier
    await page.getByTestId("recipe-search").fill(NAME);
    const row = page.getByTestId("recipe-row").filter({ hasText: NAME });
    await row.getByTestId("recipe-toggle").click();
    await row.getByTestId("recipe-cooked").click();
    const dialog = page.locator("home-inventory-cooked-dialog dialog");
    await dialog.getByTestId("cooked-save").click();
    await expect(dialog.getByTestId("cooked-done")).toBeVisible();
    await dialog.getByTestId("leftover-servings").fill("2");
    await dialog.getByTestId("leftover-store").click();
    const done = dialog.getByTestId("leftover-done");
    await expect(done).toContainText("Reste eingelagert: Charge");
    await expect(dialog.getByTestId("cooked-undo")).toHaveCount(0); // no undo after storing
    await dialog.getByTestId("leftover-label").click(); // tests never print
    const labels = dialog.locator("home-inventory-label-dialog dialog");
    await expect(labels.getByTestId("label-count")).toHaveValue("2");
    await labels.getByRole("button", { name: "Abbrechen" }).click();

    await openPage(page, "/home_inventory/canning/leftovers", "Haltbarmachen");
    const protocol = page.getByTestId("canning-row").filter({ hasText: `Reste: ${NAME}` });
    await expect(protocol).toContainText("2 Portionen, 2 vorrätig");
    expect(await protocol.getAttribute("data-charge")).toMatch(/^\d{8}-\d+$/);
  } finally {
    await cleanup(page, id);
  }
});

test("leftovers by hand: free dish name, proposed date, edit", async ({ page }) => {
  const DISH = `E2E Rest ${STAMP}`;
  try {
    await openPage(page, "/home_inventory/canning", "Haltbarmachen");
    await panelConfig(page, { modules: MODULES });
    await page.getByTestId("canning-view-recipes").click(); // re-renders with the new modules
    await page.getByTestId("preserve-leftover").click();
    await page.getByTestId("canning-add").click();
    const dialog = page.locator("home-inventory-leftover-dialog dialog");
    await dialog.getByTestId("leftover-dish").fill(DISH);
    await dialog.getByTestId("leftover-servings").fill("3");
    // shelf life of "Reste": 3 days from the made-on date (today)
    await expect(dialog.getByTestId("leftover-expires_on")).toHaveValue(plusDays(3));
    await dialog.getByTestId("leftover-save").click();
    const labels = page.locator("home-inventory-label-dialog dialog");
    await expect(labels.getByTestId("label-count")).toHaveValue("3");
    await labels.getByRole("button", { name: "Abbrechen" }).click();

    const row = page.getByTestId("canning-row").filter({ hasText: `Reste: ${DISH}` });
    await expect(row).toContainText("3 Portionen, 3 vorrätig");
    await row.getByTestId("canning-edit").click();
    await expect(dialog.getByTestId("leftover-fixed")).toContainText("3 Portionen");
    await dialog.getByTestId("leftover-notes").fill("E2E mit Brot");
    await dialog.getByTestId("leftover-save").click();
    await expect(row).toContainText("E2E mit Brot");
  } finally {
    await cleanup(page);
  }
});
