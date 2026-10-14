// PostToolUse hook: format the edited file if the formatter is available. Never blocks.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

let input = "";
for await (const chunk of process.stdin) input += chunk;
const file = JSON.parse(input).tool_input?.file_path ?? "";

if (file.endsWith(".py")) {
  spawnSync("python", ["-m", "ruff", "format", "--quiet", file]);
} else if (/[\\/]frontend[\\/]src[\\/].*\.(ts|json|css)$/.test(file)) {
  const prettier = `${process.env.CLAUDE_PROJECT_DIR ?? "."}/frontend/node_modules/prettier/bin/prettier.cjs`;
  if (existsSync(prettier)) spawnSync("node", [prettier, "--write", "--log-level", "silent", file]);
}
