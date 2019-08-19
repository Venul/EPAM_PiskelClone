/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable no-continue */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
import * as utils from '../utils/define-property.js';

export class CanvasFrameLayer extends HTMLElement {
  constructor() {
    super();
    this.style.display = 'inherit';

    this._canvasSize = 0;
    this._pixelSize = 3;

    utils.defineProperty(this, 'canvasSize', 'onCanvasSizeChanged');
    utils.defineProperty(this, 'pixelSize', 'onPixelSizeChanged');
    utils.defineProperty(this, 'data', 'onDataChanged');
    // коллбеки для отслеживания изменений.
    this.onCanvasSizeChanged.push((e, oldValue) => {
      this._initElementSize(e, this.pixelSize);
    });

    this.onPixelSizeChanged.push((e, oldValue) => {
      this._initElementSize(this.canvasSize, e);
    });

    this.onDataChanged.push((e, oldValue) => {
      this._applyDataChanges(e, oldValue);
    });

    this._initCanvas();
  }

  _initCanvas() {
    this._canvas = document.createElement('canvas');
    this._canvasContext = this._canvas.getContext('2d');
    this.appendChild(this._canvas);
    this._canvas.imageSmoothingEnabled = false;
    this._canvas.onmousemove = this.showCoordinates;
  }

  showCoordinates(event) {
    const layoutSize = event.currentTarget.clientWidth;
    const canvasSize = window.appState.canvasSize.getAttribute('value');
    const x = event.layerX;
    const y = event.layerY;

    const output = document.getElementById('coordinates');
    output.innerHTML = `${Math.floor((x / layoutSize) * canvasSize)} : ${
      Math.floor((y / layoutSize) * canvasSize)}`;
  }

  _initElementSize(canvasSize, pixelSize) {
    // рассчитываем ширину, высоту, присваиваем пустой масив
    if (!this._canvas) return;

    const size = canvasSize * pixelSize;
    this._canvas.width = size;
    this._canvas.height = size;
    this.data = new Array(canvasSize * canvasSize);
  }

  getCanvasElement() {
    return this._canvas;
  }

  getCanvasContext() {
    return this._canvasContext;
  }

  _setPixelToData(x, y, color) {
    // задать цвет элементу
    const index = this.canvasSize * y + x;
    this.data[index] = color;
  }

  _getPixelFromData(x, y) {
    // получить состояние пикселя
    const index = this.canvasSize * y + x;
    return this.data[index];
  }

  setPixel(x, y, color, brushSize = 1) {
    // movefill сдвиг, для того, чтобы по центру пиксель
    const moveFill = Math.floor(brushSize / 2);
    for (let i = 0; i < brushSize; i += 1) {
      for (let j = 0; j < brushSize; j += 1) {
        const dx = x + i - moveFill;
        const dy = y + j - moveFill;
        if (dx < 0 || this.canvasSize <= dx || dy < 0 || this.canvasSize <= dy) continue;
        this._setPixelToData(dx, dy, color);
      }
    }
    // выполнились все обработчики связанные с изменением даты
    utils.fireHandler(this, 'onDataChanged', this.data);
  }

  getPixel(x, y) {
    if (x < 0 || this.canvasSize <= x || y < 0 || this.canvasSize <= y) return;
    return this._getPixelFromData(x, y);
  }

  _drawPixel(x, y, color, context) {
    if (color) {
      context.fillStyle = color;
      context.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
    }
  }

  _clearPixel(x, y, context) {
    context.clearRect(x * this.pixelSize - 1, y * this.pixelSize - 1,
      this.pixelSize + 2, this.pixelSize + 2);
  }

  fill(x, y, color) {
    this._fill(x, y, color, this._getPixelFromData(x, y));

    utils.fireHandler(this, 'onDataChanged', this.data);
  }

  _fill(x, y, newColor, oldColor) {
    // красим по 4
    if (x < 0 || this._canvasSize <= x || y < 0 || this._canvasSize <= y) return;
    const currentColor = this._getPixelFromData(x, y);
    if (currentColor !== oldColor || currentColor === newColor) return;
    this._setPixelToData(x, y, newColor);
    this._fill(x + 1, y, newColor, oldColor);
    this._fill(x - 1, y, newColor, oldColor);
    this._fill(x, y + 1, newColor, oldColor);
    this._fill(x, y - 1, newColor, oldColor);
  }

  _applyDataChanges(newData, oldData) {
    // напомнить
    if (newData && oldData && newData.lenght === oldData.lenght) {
      this._applyDataChangesWithClearPixelStrategy(newData, oldData);
      // сравниваем попикельно, если есть старый цвет
    } else {
      this._applyDataChangesWithClearCanvasStrategy(newData);
      // очищаем весь канвас
    }
  }

  _applyDataChangesWithClearPixelStrategy(newData, oldData) {
    const dataLenght = this.canvasSize * this.canvasSize;
    for (let i = 0; i < dataLenght; i += 1) {
      if (newData[i] !== oldData[i]) {
        const x = i % this.canvasSize;
        const y = Math.floor(i / this.canvasSize);
        if (newData[i]) {
          this._drawPixel(x, y, newData[i], this._canvasContext);
        } else {
          this._clearPixel(x, y, this._canvasContext);
        }
      }
    }
  }

  _applyDataChangesWithClearCanvasStrategy(newData) {
    this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
    if (!newData) return;

    const dataLenght = this.canvasSize * this.canvasSize;
    for (let i = 0; i < dataLenght; i += 1) {
      if (newData[i]) {
        const x = i % this.canvasSize;
        const y = Math.floor(i / this.canvasSize);
        this._drawPixel(x, y, newData[i], this._canvasContext);
      }
    }
  }

  repaint() {
    // для инкапсуляции
    this._applyDataChanges(this.data);
  }

  connectedCallback() {
    // проверяем если элементы созданы в html коде
    (!this._canvasContext) && this._initCanvas();
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback() {}
}

customElements.define('canvas-frame-layer', CanvasFrameLayer);
