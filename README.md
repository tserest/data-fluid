# Data Fluid

Basic DataLayer framework Prototype written in Typescript.

## Build

Uses ESbuild to build for browser usage. Minified library will be placed inside `dist` folder. see [esbuild.js](esbuild.js) for settings.

```bash
yarn build
```

---

## Basic usage

Initialize datalayer.

```javascript
window.fluid = DataFluid();

console.log(fluid)
> {events: Array(0), data: {..},  set: f, on: f, once: f, trigger: f, ...}
```

Add Event Listener

```javascript
fluid.on('click', function(data) {
  console.log(data);
});
```

Add Event Listener that will only run callback once.

```javascript
fluid.once('click', function(data) {
  console.log(data);
})
```

Trigger Event

```javascript
fluid.trigger('click', {
  type: 'button',
  buttonText: 'next'
});
```

Add Data to data object inside the datalayer.

```javascript
fluid.set({
  page: {
    platform: 'web',
    domain: location.hostname,
    path: location.pathname
  }
});
```

Set a listener on a key in the data object. The callback in the listener will run when the data element is changed. For example:

```javascript
// Set Listener
fluid.on('page.platform', function(data) {console.log(data)});

// Add new data
fluid.set({
  page: {
    platform: 'amp'
  }
});

// Listener will log:
> {platform: "amp"}
```

## FYIs

* When using the set method with arrays, the new array will be concatenated to the existing array.
* Data inside events is **not** merged with the data object inside the datalayer.
* For any serious use-cases the events part is almost always good enough. The `set` method & data object inside the datalayer are not really necessary.
