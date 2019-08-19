/* eslint-disable import/extensions */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */

import { MainComponent } from '../main-component/main-component.js';
import * as utils from '../utils/define-property.js';

export default class AnimationTool extends MainComponent {
  constructor() {
    super();

    utils.defineProperty(this, 'framesTool', 'onFramesToolsChanged');
    utils.defineProperty(this, 'animationSpeed', 'onAnimationSpeedChanged');
    utils.defineProperty(this, 'animationFrame', 'onAnimationFrameChanged');

    this.animationSpeed = 0;
    this._currentFrame = 0;
    this._timerId = 0;
  }

  startAnimation(speed = this.animationSpeed) {
    this.stopAnimation();

    this._timerId = setInterval(() => {
      this._drawNextFrame();
    }, 1000 / speed);
  }

  stopAnimation() {
    this._timerId && clearInterval(this._timerId);
  }

  setCanvasSize(canvasSize) {
    this.animationFrame && (this.animationFrame.canvasSize = canvasSize);
  }

  _drawNextFrame() {
    if (!this.animationFrame || !this.framesTool) return;
    const count = this.framesTool.getFramesCount();
    // счетчик фреймов
    const frame = !!count && this.framesTool.getFrameByIndex(this._currentFrame % count);
    this.animationFrame.data = frame && frame.data;
    this._currentFrame += 1;
  }

  connectedCallback() {
    // устанавливаем анимейшен фрейм автоматически
    this.animationFrame = this.querySelector('canvas-frame-layer');
  }
}

customElements.define('animation-tool', AnimationTool);
