import { defineProperty, appState } from '../AppState';

describe('Action handler test', () => {
  it('defineProperty should be initialized properly', () => {
    const object = {};
    expect(defineProperty).toBeInstanceOf(Function);
    defineProperty(object, 'activeFrame', 'onActiveFrameChanged');

    expect(object).toMatchObject({ activeFrame: undefined });
  });

  it('appState object should have constructed values', () => {
    expect(appState).toBeInstanceOf(Object);
    expect(appState).toMatchObject({
      onActiveFrameChanged: [],
      onActiveLayerChanged: [],
      onForegroundChanged: [],
      onBackgroundChanged: [],
      onBrushSizeChanged: [],
      onToolChanged: [],
      onCanvasSizeChanged: [],
      onPixelSizeChanged: [],
      onAnimationSpeedChanged: [],
    });
  });
});
