import { styles } from "../deps.ts";

const ERROR_TAG =
  `${styles.bold.open}${styles.red.open}error${styles.red.close}${styles.bold.close}: `;

export function logError(err: Error): void {
  console.log(ERROR_TAG + err.message);
}
