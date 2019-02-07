(function constructDataLayers() {
  function DataLayerProtoOne() {
    (function createUtilities(target) {
      const lib = target;

      lib.merge = function deepmerge(...args) {
        const result = {};
        args.forEach((_obj) => {
          Object.keys(_obj).forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(_obj, key)) {
              if (Object.prototype.toString.call(_obj[key]) === '[object Object]' && !lib.isEmpty(_obj[key])) {
                result[key] = lib.merge(result[key], _obj[key]);
              } else {
                result[key] = _obj[key];
                lib.trigger(key, result[key]);
              }
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

      lib.isEmpty = _obj => Object.entries(_obj).length === 0 && _obj.constructor === Object;
    }(this));

    (function createEventModule(target) {
      const listeners = {};
      const onceListeners = {};
      const lib = target;

      lib.events = [];

      lib.on = function on(event, callback) {
        listeners[event] = listeners[event] || [];
        listeners[event].push(callback);
      };

      lib.off = function off(event, callback) {
        listeners[event] = listeners[event].filter(listener => (
          listener.toString() !== callback.toString()
        ));
      };

      lib.once = function once(event, callback) {
        onceListeners[event] = onceListeners[event] || [];
        onceListeners[event].push(callback);
      };

      lib.trigger = function trigger(event, data) {
        const dataObj = {};
        dataObj[event] = data;

        let fired = false;

        if (listeners[event]) {
          listeners[event].forEach(listener => listener(dataObj));
          fired = true;
        }

        if (onceListeners[event]) {
          onceListeners[event].forEach(listener => listener(dataObj));
          onceListeners[event] = [];
          fired = true;
        }

        if (fired) {
          this.events.push(dataObj);
        }
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
        lib.data = lib.merge(prevData, data);
      };
    }(this));
  }

  function DataLayerProtoTwo() {
    this.data = {
      page: {},
      user: {},
      cookies: {},
    };
    this.events = [];

    function handleEvent(newElementInArray) {
      console.log('Do Tagmanager things with following event', newElementInArray);
    }

    Object.defineProperty(this.events, 'push', {
      value: function pushWithBenefits(...args) {
        args.forEach((arg) => {
          handleEvent(this[this.length] = arg);
        });
        return this.length;
      },
    });
  }

  window.dlProtoOne = new DataLayerProtoOne();
  window.dlProtoTwo = new DataLayerProtoTwo();
}());
