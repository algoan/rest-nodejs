/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/tslint/config */
/**
 * Represents a generic logger that could be a simple console, winston etc.
 */
export interface Logger {
  debug(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
  [x: string]: any;
}
