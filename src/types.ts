declare global {
  interface Window {
    DataFluid: () => FluidDatalayer;
  }
}

export interface FluidObject {
  [key: string]: unknown;
}

export type FluidArray = Array<unknown>;

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

export interface FluidTrigger {
  (event: string, data: FluidObject, isEvent?: boolean): void;
}

export interface FluidSet {
  (newData: FluidObject): void;
}

export interface FluidOn {
  (event: string, callback: FluidCallback): void;
}

export interface FluidListeners {
  [key: string]: Array<FluidCallback>;
}

export interface FluidMerge {
  (original: FluidObject, addition: FluidObject, trigger: FluidTrigger, ancestry?: string): FluidObject;
}

export interface FluidDatalayer {
  events: Array<FluidEvent>;
  data: FluidObject;
  set: FluidSet;
  on: FluidOn;
  once: FluidOn;
  trigger: FluidTrigger;
}
