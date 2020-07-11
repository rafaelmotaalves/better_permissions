import { path, parse } from "./deps.ts";
import { generatePermisions, PenoOptions } from "./mod.ts";
import { fileExists } from "./src/util.ts";

async function cli(args: any): Promise<void> {
  if (args.help) {
    await printHelp();
  } else {
    let argsArray = Deno.args;
    const configFile = validateAndGetConfigPath(args);
    if (configFile) {
      argsArray = removeConfigPathFromArgsArray(argsArray);
    }

    let options = await loadOptions(configFile);
    let command: string[] = buildCommand(options, argsArray);
    await executeCommand(command);
  }
}

function removeConfigPathFromArgsArray(args: Array<string>): Array<string> {
  const argIndex = args.findIndex((arg) =>
    arg === "--permissions-config" || arg === "-p"
  );

  let result = args;
  if (argIndex == 0) {
    result = args.slice(argIndex + 2);
  } else if (argIndex > 0) {
    result = args.slice(0, argIndex - 1).concat(args.slice(argIndex + 2));
  }

  return result;
}

function validateAndGetConfigPath(args: any): string {
  const configFile = args.p || args["permissions-config"];
  if (typeof configFile !== "string") {
    throw new Error("Throw invalid argument");
  }
  return configFile;
}

async function printHelp() {
  const helpString = "bpdeno 0.0.1\n" +
    "A wrapper for handling permissions on deno scripts\n" +
    "OPTIONS:\n" +
    "   -h, --help\n" +
    "       Prints deno and bpdeno help information\n\n" +
    "   -p, --permissions-config <config-file>\n" +
    "     Pass the path for the bpdeno permissions config file\n\n";
  console.log(helpString);

  let helpCommand: string[];
  if (Deno.args.length == 1) {
    helpCommand = ["deno", "--help"];
  } else {
    const firstParameter = Deno.args[0];
    helpCommand = ["deno", firstParameter, "--help"];
  }
  await executeCommand(helpCommand);
}

async function loadOptions(configFile?: string): Promise<PenoOptions> {
  const configPath = path.join(
    Deno.cwd(),
    configFile || "permissions.config.ts",
  );

  let options = {};

  const configFileExists = await fileExists(configPath);
  if (!configFileExists) {
    throw new Error(
      `bpdeno: There was an error loading config file ${configFile}. it doens't exist`,
    );
  }

  try {
    const configFile = await import(configPath);

    options = configFile.default;
  } catch (err) {
    throw new Error(
      `bpdeno: There was an unexpected error loading config file: \n${err.message}`,
    );
  }

  return options;
}

function buildCommand(options: PenoOptions, args: Array<string>): string[] {
  const permissions = generatePermisions(options);

  let command: string[];
  if (args.length === 0) {
    command = ["deno"];
  } else {
    const firstParameter = args[0];
    const restOfTheParatemers = args.slice(1);

    command = [
      "deno",
      firstParameter,
      ...permissions,
      ...restOfTheParatemers,
    ];
  }

  return command;
}

async function executeCommand(command: string[]) {
  const p = Deno.run({ cmd: command, stdout: "inherit", stderr: "inherit" });
  const status = await p.status();

  if (!status.success) {
    Deno.exit(status.code);
  }
}

const args = parse(Deno.args);
await cli(args);
