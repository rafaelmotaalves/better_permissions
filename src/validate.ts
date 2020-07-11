import { PenoOptions } from "./types.ts";

interface ValidationResult {
  valid: boolean;
  message?: String;
}

export function validateOptions(
  { all, read, write, net, hrtime, run, env }: PenoOptions,
): ValidationResult {
  if (all && !isBoolean(all)) {
    return invalidParameterResult(generateInvalidFieldMessage("all"));
  }
  if (env && !isBoolean(env)) {
    return invalidParameterResult(generateInvalidFieldMessage("env"));
  }
  if (hrtime && !isBoolean(hrtime)) {
    return invalidParameterResult(generateInvalidFieldMessage("hrtime"));
  }
  if (run && !isBoolean(run)) {
    return invalidParameterResult(generateInvalidFieldMessage("run"));
  }

  if (read && Array.isArray(read)) {
    let readValidation = validateStringArray(read, "read");
    if (!readValidation.valid) return readValidation;
  } else if (read && !isBoolean(read)) {
    return invalidParameterResult(generateInvalidFieldMessage("read"));
  }

  if (write && Array.isArray(write)) {
    let writeValidation = validateStringArray(write, "write");
    if (!writeValidation.valid) return writeValidation;
  } else if (write && !isBoolean(write)) {
    return invalidParameterResult(generateInvalidFieldMessage("write"));
  }

  if (net && Array.isArray(net)) {
    let netValidation = validateStringArray(net, "net");
    if (!netValidation.valid) return netValidation;
  } else if (net && !isBoolean(net)) {
    return invalidParameterResult(generateInvalidFieldMessage("net"));
  }

  return {
    valid: true,
  };
}

function isBoolean(value: any): boolean {
  return Boolean(value) === value;
}

function validateStringArray(
  array: Array<string>,
  fieldname: string,
): ValidationResult {
  const invalidPathIndex = findInvalidStringIndexOnArray(array);
  if (invalidPathIndex !== -1) {
    return invalidParameterResult(
      generateInvalidArrayItemMessage(fieldname, array[invalidPathIndex]),
    );
  }
  return { valid: true };
}

function findInvalidStringIndexOnArray(value: Array<any>): number {
  return value.findIndex((item: string) => !item || !item.length);
}

function invalidParameterResult(message: string): ValidationResult {
  return {
    valid: false,
    message: message,
  };
}

function generateInvalidFieldMessage(field: string): string {
  return `field "${field}" was passed an invalid value`;
}

function generateInvalidArrayItemMessage(field: string, path: String) {
  return `"${field}" array has an invalid item: "${path}"`;
}
