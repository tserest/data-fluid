import { JsTypes, Validation, FluidObject } from './types';

const getElementType = (element: unknown): JsTypes => {
  const typeRegex = /\[object (Boolean|Symbol|Undefined|Null|Math|Error|Number|String|Set|Function|Array|Date|Regexp)\]/;
  const match = typeRegex.exec(Object.prototype.toString.call(element));
  if (match) {
    return match[1].toLowerCase() as JsTypes;
  }
  return 'object';
};

export const validateType = (validationObject: Validation): void => {
  Object.keys(validationObject).forEach((key) => {
    const type = getElementType(validationObject[key as keyof Validation]);
    if (type !== key) {
      throw new Error(`${type} provided. ${key} was expected`);
    }
  });
};

const clone = (obj: unknown): unknown => {
  return JSON.parse(JSON.stringify(obj));
};

const isEmpty = (element: unknown): boolean => {
  if (getElementType(element) === 'object') {
    return JSON.stringify(element) === '{}';
  }

  if (getElementType(element) === 'array') {
    const arrayElement = element as Array<unknown>;
    return arrayElement.length === 0;
  }

  if (getElementType(element) === 'string') {
    const stringElement = element as string;
    return stringElement.length === 0;
  }
  return false;
};

const isData = (element: unknown): boolean => {
  const allowedTypes = /^(boolean|number|string|date|array|object)$/;
  const elementType = getElementType(element);
  const match = allowedTypes.exec(elementType);
  return !!match && !isEmpty(element);
};

export const merge = (original: FluidObject, addition: FluidObject, ancestry = ''): FluidObject => {
  const merged = original;
  Object.keys(addition).forEach((key) => {
    const ancestryLevel = ancestry ? `${ancestry}.${key}` : key;

    const originalType = getElementType(original[key]);
    const additionType = getElementType(addition[key]);
    const similarType = originalType === additionType;

    const originalDataElement = original[key];
    const additionDataElement = addition[key];

    if (isData(additionDataElement)) {
      if (additionType === 'object') {
        const additionObject = additionDataElement as FluidObject;

        const origin = (similarType ? originalDataElement : {}) as FluidObject;
        const originArchive = clone(origin);

        merged[key] = merge(origin, additionObject, ancestryLevel);

        if (originArchive !== merged[key]) {
          console.log(`Data element Changed: ${ancestryLevel}`, clone(additionObject));
        }
      }

      if (additionType === 'array') {
        const additionArray = additionDataElement as Array<unknown>;
        const origin = (similarType ? originalDataElement : []) as Array<unknown>;

        merged[key] = Array.prototype.concat.call(origin, additionArray);

        console.log(`Data element Changed: ${ancestryLevel}`, clone(additionArray));
      }

      if (additionType.match(/^(boolean|number|string|date)$/)) {
        const dataElementChanged = originalDataElement !== additionDataElement;
        merged[key] = additionDataElement;

        if (dataElementChanged) {
          console.log(`Data element changed: ${ancestryLevel}`, additionDataElement);
        }
      }
    }
  });

  return merged;
};
