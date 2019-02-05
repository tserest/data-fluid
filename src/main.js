(function CustomDataLayer(window) {
  const g = window;
  const dataLayerName = 'dl';

  this.events = [];
  this.data = {
    page: {},
    user: {},
    products: {},
  };

  (function createEventModule(target) {
    const listeners = {};
    const obj = target;

    obj.on = (name, callback) => {
      listeners[name] = listeners[name] || [];
      listeners[name].push(callback);
    };

    obj.off = (name, callback) => {
      if (typeof listeners[name] === 'undefined') {
        throw Error('Event listener does not exist');
      }

      listeners[name] = listeners[name].filter(listener => (
        listener.toString() !== callback.toString()
      ));
    };

    obj.trigger = (name, data) => {
      const dataObj = {};
      dataObj[name] = data;

      listeners[name].forEach(listener => listener(dataObj));

      this.events.push(dataObj);
    };

  }(this));
}(window));
