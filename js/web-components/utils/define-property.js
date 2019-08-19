/* eslint-disable no-param-reassign */
export const fireHandler = (sourse, handlerName, ...args) => {
  sourse[handlerName].forEach((f) => f(...args));
};

export const defineProperty = (sourse, propertyName, handlerName) => {
  // свойство - обертка над объектом. Данные хранятся у объекта, оборачиваем поле
  // и назначением свойства
  const privateName = `_${propertyName}`;
  sourse[handlerName] = [];
  Object.defineProperty(sourse, propertyName, {
    get() {
      return sourse[privateName];
    },
    set(e) {
      if (e === sourse[privateName]) return;

      const oldValue = sourse[privateName];
      sourse[privateName] = e;
      // для вызова всех хендлеров вручную
      fireHandler(sourse, handlerName, e, oldValue);
    },
  });
};
