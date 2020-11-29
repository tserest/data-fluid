import { FluidDatalayer, FluidEvent, FluidListeners, FluidObject, FluidOn, FluidSet, FluidTrigger } from './types';
import { validateType, merge } from './helper';

window.DataFluid = (): FluidDatalayer => {
  const events: Array<FluidEvent> = [];
  let currentData: FluidObject = {};

  const set: FluidSet = (newData) => {
    validateType({
      object: newData,
    });

    const oldData = currentData;
    currentData = merge(oldData, newData, trigger);
  };

  const listeners: FluidListeners = {};
  const onceListeners: FluidListeners = {};

  const trigger: FluidTrigger = (event, data, isEvent = true) => {
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

    if (isEvent) {
      events.push({
        event,
        data,
      });
    }
  };

  const on: FluidOn = (event, callback) => {
    validateType({
      string: event,
      function: callback,
    });

    listeners[event] = listeners[event] || [];
    listeners[event].push(callback);

    const previousEvents = events.filter((e) => Object.keys(e)[0] === event);
    previousEvents.forEach((previousEvent) => trigger(previousEvent.event, previousEvent.data));
  };

  const once: FluidOn = (event, callback) => {
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
    trigger,
  };
};
