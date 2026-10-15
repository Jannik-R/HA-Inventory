// Just what playwright.config.ts uses from Node (avoids the @types/node dependency).
declare module "node:fs" {
  export function readdirSync(path: string): string[];
  export function readFileSync(path: string, encoding: "utf8"): string;
}
declare const process: { env: Record<string, string | undefined> };
