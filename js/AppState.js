/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
function defineProperty(sourse, propertyName, handlerName) {
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

      sourse[handlerName].forEach((f) => f(e, oldValue));
    },
  });
}

class AppState {
  constructor() {
    defineProperty(this, 'activeFrame', 'onActiveFrameChanged');
    defineProperty(this, 'activeLayer', 'onActiveLayerChanged');
    defineProperty(this, 'foreground', 'onForegroundChanged');
    defineProperty(this, 'background', 'onBackgroundChanged');
    defineProperty(this, 'brushSize', 'onBrushSizeChanged');
    defineProperty(this, 'tool', 'onToolChanged');
    defineProperty(this, 'canvasSize', 'onCanvasSizeChanged');
    defineProperty(this, 'pixelSize', 'onPixelSizeChanged');
    defineProperty(this, 'animationSpeed', 'onAnimationSpeedChanged');
  }
}
