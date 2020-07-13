# Better Permissions
[Better Permissions](https://github.com/rafaelmotaalves/better-permissions) provides a nicer way for configuring permissions for your [Deno
(https://deno.land/) scripts using Typescript files!

## Usage
[Better Permissions](https://github.com/rafaelmotaalves/better-permissions) provides an API that permits generating [Deno](https://deno.land/) scrips permissions flags, from a defined configuration object:

```typescript
import { 
  generatePermisions, 
  PermissionOptions 
  } from "https://github.com/rafaelmotaalves/better-permissions/blob/master/mod.ts";

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
import { desc, run, task } from "https://deno.land/x/drake@v1.2.4/mod.ts";
import { 
  generatePermisionsString, PermissionOptions 
} from "https://github.com/rafaelmotaalves/better-permissions/blob/master/mod.ts";

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
  console.log(`deno run ${generatePermisionsString(devOptions)} app.ts`);
});

run()
```
 
 also provide a Wrapper CLI for Deno that can installed executing the command:

`
  deno install -A -n bpdeno https://github.com/rafaelmotaalves/better-permissions/blob/master/cli.ts
`

and the we can execute a scripts using the following parameters:

`
  bpdeno run -p permissions.config.ts app.ts
`
being the permissions.config.js a Typescript file that follows the format: 
```typescript
import { PermissionOptions } from "https://github.com/rafaelmotaalves/better-permissions/blob/master/mod.ts";

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
