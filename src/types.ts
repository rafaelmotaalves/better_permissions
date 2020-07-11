export interface PenoOptions {
  all?: boolean;
  env?: boolean;
  hrtime?: boolean;
  net?: boolean | Array<string>;
  read?: boolean | Array<string>;
  run?: boolean;
  write?: boolean | Array<string>;
}

export enum PermissionFlag {
  AllowAll = "--allow-all",
  AllowEnv = "--allow-env",
  AllowHrTime = "--allow-hrtime",
  AllowNet = "--allow-net",
  AllowRead = "--allow-read",
  AllowRun = "--allow-run",
  AllowWrite = "--allow-write",
}
