import { path, parse, Args } from "./deps.ts";
import { generatePermisions, PermissionOptions } from "./mod.ts";
import { fileExists } from "./src/util.ts";
import { executeCommand } from "./src/cmd.ts";

const CLI_VERSION = "v0.0.1";
const CLI_OPTIONS = [
  {
    key: "help",
    flags: ["-h", "--help"],
    input: false,
    desc: "Prints deno and bpdeno help information",
  },
  {
    key: "permissionsConfig",
    flags: ["-p", "--permissions-config"],
    input: true,
    desc: "Pass the path for the bpdeno permissions config file",
  },
];

async function cli(args: Array<string>): Promise<void> {
  const cliOptions = parseCliOptions(args);
  if (cliOptions.help) {
    await printHelp();
  } else {
    const configFilePath = cliOptions.permissionsConfig;
    let permissionOptions = await loadOptions(configFilePath);

    const denoArgs = removeCliOptionsFromArgs(cliOptions.arr);
    let command: string[] = buildCommand(permissionOptions, denoArgs);
    await executeCommand(command);
  }
}

function parseCliOptions(args: Array<string>): any {
  const options: Args = parse(args);

  return {
    _: options._,
    arr: args,
    ...extractCliOptions(options),
  };
}

function extractCliOptions(options: Args): any {
  return CLI_OPTIONS.reduce((acumulator, option) => {
    const flagThatExists = option.flags
      .map((flag) => flag.startsWith("--") ? flag.slice(2) : flag.slice(1))
      .find(
        (flag) => options[flag],
      );

    if (flagThatExists) {
      const value = options[flagThatExists];
      if (option.input && typeof value !== "string") {
        throw new Error(`Expected an argument for input: ${flagThatExists}`);
      }

      return { ...acumulator, [option.key]: value };
    }
    return acumulator;
  }, {});
}

function removeCliOptionsFromArgs(args: Array<string>): Array<string> {
  const result = [];

  let index = 0;
  while (index < args.length) {
    const arg = args[index];

    const cliArg = CLI_OPTIONS.find((opt) => opt.flags.includes(arg));
    if (cliArg) {
      if (cliArg.input) {
        index += 2; // skip the current parameter and its value
      } else {
        index += 1;
      }
    } else {
      result.push(arg);
      index += 1;
    }
  }
  return result;
}

async function printHelp() {
  const helpString = generateHelp();
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

function generateHelp() {
  const header = `bpdeno ${CLI_VERSION}\n` +
    "A wrapper for handling permissions on deno scripts\n" +
    "OPTIONS:\n";

  const optionsString = CLI_OPTIONS.map(
    (option) =>
      `   ${option.flags.join(",")}
            ${option.desc}\n`,
  );

  return header + optionsString.join("\n");
}

async function loadOptions(configFile?: string): Promise<PermissionOptions> {
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

function buildCommand(
  options: PermissionOptions,
  args: Array<string>,
): string[] {
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

await cli(Deno.args);
