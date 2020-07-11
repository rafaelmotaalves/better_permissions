import {
  assertEquals,
} from "./test-deps.ts";
import { validateOptions } from "../src/validate.ts";

Deno.test("validateOptions: with an empty object {}", function () {
  assertEquals(validateOptions({}), { valid: true });
});

Deno.test("validateOptions: with all valid simple parameters", function () {
  assertEquals(validateOptions({ all: true }), { valid: true });
  assertEquals(validateOptions({ all: false }), { valid: true });

  assertEquals(validateOptions({ run: true }), { valid: true });
  assertEquals(validateOptions({ run: false }), { valid: true });

  assertEquals(validateOptions({ hrtime: true }), { valid: true });
  assertEquals(validateOptions({ hrtime: true }), { valid: true });
});

Deno.test("validateOptions: with all valid simple parameters on optionally complex parameters", function () {
  assertEquals(validateOptions({ net: true }), { valid: true });
  assertEquals(validateOptions({ net: false }), { valid: true });

  assertEquals(validateOptions({ write: true }), { valid: true });
  assertEquals(validateOptions({ write: false }), { valid: true });

  assertEquals(validateOptions({ read: true }), { valid: true });
  assertEquals(validateOptions({ read: false }), { valid: true });
});

Deno.test("validateOptions: with valid path parameters", function () {
  // this actually accepts any string array if if has only length > 0 strings
  assertEquals(validateOptions({ read: ["/path/to/dir"] }), { valid: true });
  assertEquals(validateOptions({ read: ["path"] }), { valid: true });
  assertEquals(
    validateOptions({ read: ["/path/to/dir", "./path"] }),
    { valid: true },
  );

  assertEquals(validateOptions({ write: ["/path/to/dir"] }), { valid: true });
  assertEquals(validateOptions({ write: ["path"] }), { valid: true });
  assertEquals(
    validateOptions({ write: ["/path/to/dir", "./path"] }),
    { valid: true },
  );
});

Deno.test("validateOptions: with invalid path parameters", function () {
  assertEquals(
    validateOptions({ read: [""] }),
    {
      valid: false,
      message: '"read" array has an invalid item: ""',
    },
  );

  assertEquals(
    validateOptions({ write: ["path", ""] }),
    {
      valid: false,
      message: '"write" array has an invalid item: ""',
    },
  );
});

Deno.test("validateOptions: with multiple valid options", function () {
  const options = {
    net: true,
    write: ["path/to/dir"],
    read: false,
    hrtime: true,
  };

  assertEquals(validateOptions(options), { valid: true });
});
