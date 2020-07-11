import {
  assertEquals,
} from "./test-deps.ts";
import { generatePermisions, generatePermisionsString } from "../src/parser.ts";

Deno.test("generatePermissions: with an empty object {}", function () {
  assertEquals(generatePermisions({}), []);
});

Deno.test("generatePermissions: with only the all field", function () {
  assertEquals(generatePermisions({ all: true }), ["--allow-all"]);
});

Deno.test("generatePermissions: with only the env field", function () {
  assertEquals(generatePermisions({ env: true }), ["--allow-env"]);
});

Deno.test("generatePermissions: with the all field and others fields ", function () {
  assertEquals(generatePermisions({ all: true, env: true }), ["--allow-all"]);
});

Deno.test("generatePermissions: with only the hrtime field", function () {
  assertEquals(generatePermisions({ hrtime: true }), ["--allow-hrtime"]);
});

Deno.test("generatePermissions: with only the run field", function () {
  assertEquals(generatePermisions({ run: true }), ["--allow-run"]);
});

Deno.test("generatePermissions: with only the read field", function () {
  assertEquals(generatePermisions({ read: true }), ["--allow-read"]);
  assertEquals(
    generatePermisions({ read: ["/path", "other/path"] }),
    ["--allow-read=/path other/path"],
  );
});

Deno.test("generatePermissions: with only the write field", function () {
  assertEquals(generatePermisions({ write: true }), ["--allow-write"]);
  assertEquals(
    generatePermisions({ write: ["/path", "other/path"] }),
    ["--allow-write=/path other/path"],
  );
});

Deno.test("generatePermissions: with only the net field", function () {
  assertEquals(generatePermisions({ net: true }), ["--allow-net"]);
  assertEquals(
    generatePermisions({ net: ["github.com", "deno.land"] }),
    ["--allow-net=github.com,deno.land"],
  );
});

Deno.test("generatePermissions: with multiple fields configured", function () {
  const options = {
    net: ["github.com", "deno.land"],
    read: true,
    write: ["/etc/tmp"],
    hrtime: true,
    run: true,
  };

  assertEquals(generatePermisions(options), [
    "--allow-hrtime",
    "--allow-run",
    "--allow-read",
    "--allow-write=/etc/tmp",
    "--allow-net=github.com,deno.land",
  ]);
});

Deno.test("generatePermissionsString: with multiple fields configured", function () {
  const options = {
    net: ["github.com", "deno.land"],
    read: true,
    write: ["/etc/tmp"],
    hrtime: true,
    run: true,
  };

  assertEquals(
    generatePermisionsString(options),
    "--allow-hrtime --allow-run --allow-read --allow-write=/etc/tmp --allow-net=github.com,deno.land",
  );
});
