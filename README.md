# Better Permissions
![License](https://img.shields.io/github/license/rafaelmotaalves/better_permissions.svg)
![Test](https://github.com/rafaelmotaalves/better_permissions/workflows/Test/badge.svg?branch=master&event=push)

[Better Permissions](https://github.com/rafaelmotaalves/better-permissions) provides a nicer way for configuring permissions for your [Deno](https://deno.land/) scripts using Typescript files!

## Usage
[Better Permissions](https://github.com/rafaelmotaalves/better-permissions) provides an API that permits generating [Deno](https://deno.land/) scrips permissions flags, from a defined configuration object:

```typescript
import { 
  generatePermisions, 
  PermissionOptions 
  } from "https://deno.land/x/better_permissions@v0.0.1/mod.ts";

const options: PermissionOptions = {
    env: true,
    net: ["deno.land", "github.com"],
    read: ["./config.json"],
    write: ["/tmp"],
    hrtime: true,
    run: false
}

const flags = generatePermisions(options);

const p = Deno.run({ cmd: ["deno", "run", ...flags, "app.ts"]});
await p.status();
```
Another way the Better Permissions API works nicely is together with [Drake](https://github.com/srackham/drake). 
Example drakefile using better-permisions:

```typescript
import { desc, run, task, sh } from "https://deno.land/x/drake@v1.2.4/mod.ts";
import { 
  generatePermisionsString, PermissionOptions 
} from "https://deno.land/x/better_permissions@v0.0.1/mod.ts";

const devOptions: PermissionOptions = {
    env: true,
    net: ["deno.land", "github.com"],
    read: ["./config.json"],
    write: ["/tmp"],
    hrtime: true,
    run: false
};

desc("Execute application with development permissions");
task("run-dev", [], function() {
  sh(`deno run ${generatePermisionsString(devOptions)} app.ts`);
});

run()
```
 
 Better permissino also provides a Wrapper CLI for Deno that can installed executing the command:

`
  deno install -A -n bpdeno https://deno.land/x/better_permissions@v0.0.1/cli.ts
`

and then we can execute a scripts using the following parameters:

`
  bpdeno run -p permissions.config.ts app.ts
`

being the permissions.config.js a Typescript file that follows the format: 

```typescript
import { PermissionOptions } from "https://deno.land/x/better_permissions@v0.0.1/mod.ts";

const options: PermissionOptions ={
    env: true,
    net: ["deno.land", "github.com"],
    read: true,
    write: false,
    hrtime: true,
    run: false
};

export default options;

```
