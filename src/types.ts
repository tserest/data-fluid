declare global {
  interface Window {
    fluid: FluidDatalayer;
  }
}

export interface FluidObject {
  [key: string]: unknown;
}

export type JsTypes =
  | 'boolean'
  | 'string'
  | 'number'
  | 'array'
  | 'object'
  | 'null'
  | 'undefined'
  | 'symbol'
  | 'math'
  | 'error'
  | 'set'
  | 'function'
  | 'date'
  | 'regexp';

export type Validation = {
  [JsType in JsTypes]?: unknown;
};

export interface FluidEvent {
  event: string;
  data: FluidObject;
}

export interface FluidCallback {
  (data: FluidObject): void;
}

export interface FluidListeners {
  [key: string]: Array<FluidCallback>;
}

export interface FluidDatalayer {
  events: Array<FluidEvent>;
  data: FluidObject;
  set: (newData: FluidObject) => void;
  on: (event: string, callback: FluidCallback) => void;
  once: (event: string, callback: FluidCallback) => void;
}
