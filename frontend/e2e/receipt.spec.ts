import { apiPage, cleanupE2E, openPage, ws } from "./helpers";
import { expect, test } from "./fixtures";

type Md = { categories: { id: number; name: string }[] };

test.afterAll(async ({ browser }) => {
  const api = await apiPage(browser);
  await cleanupE2E(api);
  await api.close();
});

test("a receipt photo is read in the browser, checked and booked in", async ({ page, wsStub }) => {
  test.setTimeout(120_000); // the first OCR run loads engine and German data from the CDN
  const api = await apiPage(page.context().browser()!);
  const md = (await ws(api, { type: "pantry/master_data" })) as Md;
  const milk = md.categories.find((c) => c.name === "H-Milch")!.id;
  const name = `E2E Bon-Milch ${Date.now()}`;
  const { product_id } = (await ws(api, {
    type: "pantry/book_in",
    packages: 1,
    expires_on: "2099-01-01",
    product: { name, category_id: milk },
  })) as { product_id: number };
  await api.close();

  // The AI answer is stubbed; the OCR is real (a receipt drawn on a canvas).
  wsStub("pantry/receipt_read", {
    store: "E2E Markt",
    items: [
      {
        text: "JA H-MILCH 3,5%",
        name: "H-Milch",
        packages: 2,
        product_id: null,
        candidates: [
          { id: product_id, name, brand: null, shelf_days: 90 },
          { id: product_id, name: `${name} (2)`, brand: null, shelf_days: 90 },
        ],
        category_id: milk,
      },
      {
        text: "TRAGETASCHE",
        name: "Tasche",
        packages: 1,
        product_id: null,
        candidates: [],
        category_id: null,
      },
    ],
  });
  await openPage(page, "/pantry/stock", "Bestand");
  await page.getByTestId("mode-in").click();
  await page.getByTestId("receipt-import").click();
  await page.getByTestId("receipt-photo").evaluate(async (input: HTMLInputElement) => {
    // a white receipt on a dark table: the scan finds its outline
    const c = document.createElement("canvas");
    c.width = 900;
    c.height = 700;
    const g = c.getContext("2d")!;
    g.fillStyle = "#333";
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = "#fff";
    g.fillRect(100, 100, 700, 400);
    g.fillStyle = "#000";
    g.font = "28px monospace";
    ["E2E MARKT", "JA H-MILCH 3,5%   2 x 0,99", "TRAGETASCHE   0,20"].forEach((l, i) =>
      g.fillText(l, 130, 180 + i * 80),
    );
    const blob = await new Promise<Blob>((done) => c.toBlob((b) => done(b!), "image/png"));
    const files = new DataTransfer();
    files.items.add(new File([blob], "bon.png", { type: "image/png" }));
    input.files = files.files;
    input.dispatchEvent(new Event("change"));
  });
  // outline step: corners found on the receipt, not the whole photo; then black and white
  const corner = page.getByTestId("scan-corner").first();
  await expect(page.getByTestId("camera-apply")).toBeEnabled({ timeout: 60_000 });
  await expect.poll(async () => Number(await corner.getAttribute("cx"))).toBeGreaterThan(50);
  await page.getByTestId("camera-apply").click();
  await expect(page.getByTestId("receipt-preview")).toBeVisible();
  await page.getByTestId("receipt-read").click();

  const rows = page.getByTestId("receipt-row");
  await expect(rows).toHaveCount(2, { timeout: 90_000 });
  await expect(page.getByTestId("receipt-store")).toHaveValue("E2E Markt");
  // two candidates: the user has to choose; the new product without a category blocks too
  await expect(page.getByTestId("receipt-book")).toBeDisabled();
  await rows.nth(0).getByTestId("receipt-product").selectOption(String(product_id));
  await rows.nth(1).getByTestId("receipt-product").selectOption("skip");
  await expect(rows.nth(0).getByTestId("receipt-expires")).toHaveValue("");
  await page.getByTestId("receipt-book").click();
  await expect(page.getByText("2 Pkg. vom Kassenbon eingebucht.")).toBeVisible();

  const api2 = await apiPage(page.context().browser()!);
  const stock = (await ws(api2, { type: "pantry/stock" })) as {
    product_id: number;
    packages: number;
    expiry_guessed: number;
  }[];
  const mine = stock.filter((r) => r.product_id === product_id);
  expect(mine.map((r) => [r.packages, r.expiry_guessed]).sort()).toEqual([
    [1, 0],
    [2, 1],
  ]);
  await api2.close();
});

test("the live camera takes a receipt and a recipe photo", async ({ page }) => {
  test.setTimeout(120_000);
  await openPage(page, "/pantry/stock", "Bestand");
  await page.getByTestId("mode-in").click();
  await page.getByTestId("receipt-import").click();
  await page.getByTestId("receipt-scan").click();
  await page.getByTestId("camera-capture").click();
  await page.getByTestId("camera-uncut").click(); // the fake camera shows no receipt
  await expect(page.getByTestId("receipt-preview")).toBeVisible();
  await expect(page.getByTestId("receipt-read")).toBeEnabled();

  await openPage(page, "/pantry/recipes", "Rezepte");
  await page.getByTestId("recipe-import").click();
  await page.getByTestId("recipe-import-source-photo").click();
  await page.getByTestId("recipe-import-camera").click();
  await page.getByTestId("camera-capture").click();
  await expect(page.getByTestId("recipe-import-submit")).toBeEnabled();
});
