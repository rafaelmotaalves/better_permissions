import { sh } from "./deps.ts";
import { generatePermisionsString, PenoOptions } from "./mod.ts";
import { fileExists } from "./src/util.ts";

let options = await loadOptions();
let command: string = buildCommand(options);
await sh(command);

async function loadOptions(): Promise<PenoOptions> {
  let options = {};

  const configPath = Deno.cwd() + "/permissions.config.ts";

  if (await fileExists(configPath)) {
    const configFile = await import(configPath);

    options = configFile.default;
  }

  return options;
}

function buildCommand(options: PenoOptions): string {
  const permissionString = generatePermisionsString(options);
  let command: string[];

  if (Deno.args.length === 0) {
    command = ["deno"];
  } else {
    const firstParameter = Deno.args[0];
    const restOfTheParatemers = Deno.args.slice(1);
    command = [
      "deno",
      firstParameter,
      permissionString,
      ...restOfTheParatemers,
    ];
  }

  return command.join(" ");
}
