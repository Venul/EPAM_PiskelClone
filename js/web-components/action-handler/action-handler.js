/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
import { MainComponent } from '../main-component/main-component.js';

export class ActionHandler extends MainComponent {
  constructor() {
    super();

    this.onmousedown = this.mouseDown;
    this.onmouseup = this.mouseUp;
    this.onmousemove = this.mouseMove;

    // само рисование
    Object.defineProperty(this, 'onDrawing', {
      get() {
        return this._onDrawing;
      },
      set(e) {
        this._onDrawing = e;
      },
    });
    // инициирование рисования
    Object.defineProperty(this, 'onStartDraw', {
      get() {
        return this._onStartDraw;
      },
      set(e) {
        this._onStartDraw = e;
      },
    });
  }

  mouseDown(event) {
    if (this._onStartDraw) {
      this.isDrawing = this._onStartDraw(event);
    } else {
      this.isDrawing = true;
    }
  }

  mouseUp(_event) {
    this.isDrawing = false;
  }

  mouseMove(event) {
    if (this.isDrawing && this._onDrawing) {
      this._onDrawing(event);
    }
  }
}

customElements.define('action-handler', ActionHandler);
