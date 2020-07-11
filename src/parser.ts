import { PenoOptions, PermissionFlag } from "./types.ts";
import { validateOptions } from "./validate.ts";

export function generatePermisionsString(options: PenoOptions): string {
  return generatePermisions(options).join(" ");
}

export function generatePermisions(
  options: PenoOptions,
): Array<string> {
  const optionsValidation = validateOptions(options);

  if (!optionsValidation.valid) {
    throw new Error("Invalid options object! " + optionsValidation.message);
  }
  const result: Array<string> = [];

  if (options.all) {
    result.push(PermissionFlag.AllowAll);
  } else {
    if (options.env) {
      result.push(PermissionFlag.AllowEnv);
    }

    if (options.hrtime) {
      result.push(PermissionFlag.AllowHrTime);
    }

    if (options.run) {
      result.push(PermissionFlag.AllowRun);
    }

    if (options.read) {
      let readFlag = generateArrayPermissionFlag(
        PermissionFlag.AllowRead,
        options.read,
        generatePathsString,
      );
      result.push(readFlag);
    }

    if (options.write) {
      let writeFlag = generateArrayPermissionFlag(
        PermissionFlag.AllowWrite,
        options.write,
        generatePathsString,
      );
      result.push(writeFlag);
    }

    if (options.net) {
      let netFlag = generateArrayPermissionFlag(
        PermissionFlag.AllowNet,
        options.net,
        generateUrlsString,
      );
      result.push(netFlag);
    }
  }
  return result;
}

function generateArrayPermissionFlag(
  flag: PermissionFlag,
  array: Array<string> | boolean,
  stringifyArrayFn: (array: Array<string>) => string,
): string {
  if (Array.isArray(array)) {
    return flag + stringifyArrayFn(array);
  }
  return flag;
}

function generatePathsString(array: Array<string>): string {
  return "=" + array.join(" ");
}

function generateUrlsString(array: Array<string>): string {
  return "=" + array.join(",");
}
