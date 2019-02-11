(function constructDataLayers() {
  function DataFluid() {
    (function createUtilities(target) {
      const lib = target;

      lib.mergeObject = function mergeObject(...args) {
        const result = {};

        args.forEach((obj) => {
          Object.keys(obj).forEach((prop) => {
            if (typeof obj[prop] === 'object') {
              if (Array.isArray(obj[prop])) {
                result[prop] = Array.prototype.concat.call(result[prop] || [], obj[prop]);
              } else {
                result[prop] = mergeObject(result[prop] || {}, obj[prop]);
              }
            } else {
              result[prop] = obj[prop];
            }
          });
        });

        return result;
      };

      lib.getCookies = function getDocumentCookies() {
        const cookieObj = {};
        const cookieArr = document.cookie.split('; ');
        cookieArr.forEach((cookie) => {
          const cookieName = cookie.split('=')[0];
          const cookieValue = cookie.split('=')[1];

          cookieObj[cookieName] = cookieValue || '';
        });
        return cookieObj;
      };
    }(this));

    (function createEventModule(target) {
      const listeners = {};
      const onceListeners = {};
      const lib = target;

      lib.events = [];

      lib.listen = function on(event, callback) {
        listeners[event] = listeners[event] || [];
        listeners[event].push(callback);

        // Check for Events of this type that already happened
        const eventsInThePast = lib.events.filter(e => Object.keys(e)[0] === event);

        // Trigger the callback for Each of those events with the data at that time.
        eventsInThePast.forEach(e => lib.trigger(event, e[event]));
      };

      lib.off = function off(event, callback) {
        listeners[event] = listeners[event].filter(listener => (
          listener.toString() !== callback.toString()
        ));
      };

      lib.listenOnce = function once(event, callback) {
        onceListeners[event] = onceListeners[event] || [];
        onceListeners[event].push(callback);
      };

      lib.trigger = function trigger(event, data) {
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
    }(this));

    (function createDataModule(target) {
      const lib = target;

      lib.data = {
        page: {
          url: {
            href: document.location.href,
            pathname: document.location.pathname,
            hostname: document.location.hostname,
            search: document.location.search,
            hash: document.location.hash,
          },
          title: document.title,

        },
        cookies: lib.getCookies(),
        user: {
          device: {
            userAgent: navigator.userAgent,
            language: navigator.language,
          },
        },
      };

      lib.set = function set(data) {
        const prevData = lib.data;
        lib.data = lib.mergeObject(prevData, data);
      };
    }(this));
  }
  window.DataFluid = new DataFluid();
}());
