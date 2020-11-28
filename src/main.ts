import { FluidCallback, FluidDatalayer, FluidEvent, FluidListeners, FluidObject } from './types';
import { validateType, merge } from './helper';

const DataFluid = (): FluidDatalayer => {
  const events: Array<FluidEvent> = [];
  let currentData: FluidObject = {};

  const set = (newData: FluidObject): void => {
    validateType({
      object: newData,
    });

    const oldData = currentData;
    currentData = merge(oldData, newData);
  };

  const listeners: FluidListeners = {};
  const onceListeners: FluidListeners = {};

  const trigger = (event: string, data: FluidObject): void => {
    validateType({
      string: event,
      object: data,
    });

    if (listeners[event]) {
      listeners[event].forEach((listener) => listener(data));
    }

    if (onceListeners[event]) {
      onceListeners[event].forEach((listener) => listener(data));
      onceListeners[event] = [];
    }

    events.push({
      event,
      data,
    });
  };

  const on = (event: string, callback: FluidCallback): void => {
    validateType({
      string: event,
      function: callback,
    });

    listeners[event] = listeners[event] || [];
    listeners[event].push(callback);

    const previousEvents = events.filter((e) => Object.keys(e)[0] === event);
    previousEvents.forEach((previousEvent) => trigger(previousEvent.event, previousEvent.data));
  };

  const once = (event: string, callback: FluidCallback): void => {
    validateType({
      string: event,
      function: callback,
    });

    onceListeners[event] = onceListeners[event] || [];
    onceListeners[event].push(callback);

    const previousEvents = events.filter((e) => Object.keys(e)[0] === event);
    previousEvents.forEach((previousEvent, ind) => {
      if (ind === 0) {
        trigger(previousEvent.event, previousEvent.data);
      }
    });
  };

  return {
    events,
    data: currentData,
    set,
    on,
    once,
  };
};

window.fluid = DataFluid();
