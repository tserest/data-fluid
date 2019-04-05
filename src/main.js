function DataFluid() {
  this.events = [];
  this.data = {};

  this.set = function set(data) {
    this.typeCheck({
      object: data,
    });

    const prevData = this.data;
    this.data = this.mergeObject(prevData, data);
  };

  const listeners = {};
  const onceListeners = {};

  this.listen = function listen(event, callback) {
    this.typeCheck({
      string: event,
      function: callback,
    });

    listeners[event] = listeners[event] || [];
    listeners[event].push(callback);

    const previousEvents = this.events.filter(e => Object.keys(e)[0] === event);
    previousEvents.forEach(e => this.trigger(event, e[event]));
  };

  this.once = function once(event, callback) {
    this.typeCheck({
      string: event,
      function: callback,
    });

    onceListeners[event] = onceListeners[event] || [];
    onceListeners[event].push(callback);

    const previousEvents = this.events.filter(e => Object.keys(e)[0] === event);
    previousEvents.forEach((e, i) => {
      if (i === 0) {
        this.trigger(event, e[event]);
      }
    });
  };

  this.trigger = function trigger(event, data) {
    this.typeCheck({
      string: event,
      object: data,
    });

    const dataObj = {};
    dataObj[event] = data;

    if (listeners[event]) {
      listeners[event].forEach(listener => listener(dataObj));
    }

    if (onceListeners[event]) {
      onceListeners[event].forEach(listener => listener(dataObj));
      onceListeners[event] = [];
    }

    this.events.push(dataObj);
  };
}

Object.defineProperties(DataFluid.prototype, {
  getType: {
    value: function getType(obj) {
      if (obj === null) {
        return String(obj);
      }
      const typeRegex = /\[object (Boolean|Number|String|Function|Array|Date|RegExp)\]/;
      const match = typeRegex.exec(Object.prototype.toString.call(Object(obj)));
      if (match) {
        return match[1].toLowerCase();
      }
      return 'object';
    },
  },

  typeCheck: {
    value: function typeCheck(checkObj) {
      Object.keys(checkObj).forEach((prop) => {
        const type = this.getType(checkObj[prop]);
        if (type !== prop) {
          throw new Error(`${type} provided. Should be type ${prop}`);
        }
      });
    },
  },

  clone: {
    value: function clone(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
  },

  isEmpty: {
    value: function isEmpty(obj) {
      if (this.getType(obj) === 'object') {
        return JSON.stringify(obj) === '{}';
      }

      if (this.getType(obj) === 'array') {
        return obj.length === 0;
      }
      return false;
    },
  },

  isData: {
    value: function isData(obj) {
      const allowedTypes = /boolean|number|string|date|array|object/;
      const match = allowedTypes.exec(this.getType(obj));
      return match && !this.isEmpty(obj);
    },
  },

  mergeObject: {
    value: function mergeObject(original, addition, scope) {
      const result = original;
      Object.keys(addition).forEach((prop) => {
        const level = scope ? `${scope}.${prop}` : prop;
        const typeCheck = this.getType(result[prop]) === this.getType(addition[prop]);

        if (this.isData(addition[prop])) {
          // Handle Objects
          if (this.isPlainObject(addition[prop])) {
            const archiveOriginal = this.clone(result[prop]);
            const origin = typeCheck ? result[prop] : {};
            result[prop] = this.mergeObject(origin, addition[prop], level);
            if (archiveOriginal !== result[prop]) {
              this.trigger(level, this.clone(result[prop]));
            }
          // Handle Arrays
          } else if (Array.isArray(addition[prop])) {
            const origin = typeCheck ? result[prop] : [];
            result[prop] = Array.prototype.concat.call(origin, addition[prop]);
            this.trigger(level, this.clone(result[prop]));
          // Handle all other values
          } else {
            const change = result[prop] !== addition[prop];
            result[prop] = addition[prop];
            if (change) {
              this.trigger(level, addition[prop]);
            }
          }
        }
      });
      return result;
    },
  },
});

window.dlTest = new DataFluid();
