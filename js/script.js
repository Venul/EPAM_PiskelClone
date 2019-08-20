function getDrawArea() {
  return document.querySelector('.animation-grid');
}

function onChangeAnimationSpeed() {
  const animationTool = document.getElementById('animation-tool');
  animationTool.animationSpeed = animationTool.getElementsByTagName('input')[0].value;

  const slider = document.getElementById('animation-speed-input');
  const output = document.getElementById('animation-speed-value');
  output.innerHTML = slider.value;

  slider.oninput = () => {
    output.innerHTML = this.value;
  };
}

function onStartAnimation() {
  const animationTool = document.getElementById('animation-tool');
  animationTool.startAnimation(window.appState.animationSpeed);
}

function onStopAnimation() {
  const animationTool = document.getElementById('animation-tool');
  animationTool.stopAnimation();
}

// function setSizeArea(size) {
//   const drawArea = getDrawArea();
//   drawArea.width = size;
//   drawArea.height = size;
//   drawArea.createArea();
// }

function createDrawCache() {
  const canvasFrameLayer = document.getElementById('canvas-frame-layer');
  const rect = canvasFrameLayer.getCanvasElement().getBoundingClientRect();

  return { canvasFrameLayer, rect };
}

function getColorByMouseButton(button) {
  const { foreground, background } = window.appState;
  switch (button) {
    case 2: // right button
      return background;

    default: // left button
      return foreground;
  }
}

function setColorByMouseButton(button, color) {
  switch (button) {
    case 2: // right button
      window.appState.background = color;
      break;

    default: // left button
      window.appState.foreground = color;
  }
}

function onDrawHandler(e) {
  const { tool } = window.appState;
  const { canvasFrameLayer, rect } = window.drawCache;

  const x = Math.floor((e.x - rect.x) / canvasFrameLayer.pixelSize);
  const y = Math.floor((e.y - rect.y) / canvasFrameLayer.pixelSize);
  const brushSize = window.appState.brushSize.getAttribute('value');
  const color = tool && tool.getAttribute('value') === 'pen' && getColorByMouseButton(e.buttons);
  canvasFrameLayer.setPixel(x, y, color, brushSize);
}

function onPickHandler(e) {
  const { canvasFrameLayer, rect } = window.drawCache;

  const x = Math.floor((e.x - rect.x) / canvasFrameLayer.pixelSize);
  const y = Math.floor((e.y - rect.y) / canvasFrameLayer.pixelSize);

  setColorByMouseButton(e.buttons, canvasFrameLayer.getPixel(x, y) || '#ffffff');
}

function onFillColorHandler(e) {
  const { canvasFrameLayer, rect } = window.drawCache;

  const x = Math.floor((e.x - rect.x) / canvasFrameLayer.pixelSize);
  const y = Math.floor((e.y - rect.y) / canvasFrameLayer.pixelSize);
  canvasFrameLayer.fill(x, y, getColorByMouseButton(e.buttons));
}

function onStartDrawHandler(e, selectedTool) {
  const { activeFrame, tool } = window.appState;
  if (!activeFrame) return;

  const currentTool = (selectedTool || tool) && tool.getAttribute('value');
  window.drawCache = createDrawCache();

  switch (currentTool) {
    case 'pen':
    case 'eraser':
      return;
    case 'colorpicker':
      return onPickHandler(e);
    case 'bucket':
      return onFillColorHandler(e);
    default:
  }
}

function addFrame(duplacateValue) {
  const framesTool = document.getElementById('frames-tool');
  const removeButton = document.getElementById('remove-frame');
  const duplicateButton = document.getElementById('duplicate-frame');
  const canvasSize = window.appState.canvasSize.getAttribute('value');
  const newValue = duplacateValue
    ? duplacateValue.data.map((v) => v)
    : new Array(canvasSize * canvasSize);

  const div = document.createElement('div');
  div.innerHTML = '<canvas-frame-layer></canvas-frame-layer>';
  const newFrame = div.lastChild;

  newFrame.canvasSize = canvasSize;
  newFrame.pixelSize = 1;
  newFrame.data = newValue;
  framesTool.appendFrame(newFrame);
  if (removeButton.getAttribute('disabled') === '') removeButton.removeAttribute('disabled');
  if (duplicateButton.getAttribute('disabled') === '') duplicateButton.removeAttribute('disabled');
}

function removeFrame(e) {
  const selectedFrame = window.appState.activeFrame;
  const removeButton = document.getElementById('remove-frame');
  const duplicateButton = document.getElementById('duplicate-frame');

  if (!selectedFrame) return;
  const frameContainer = document.querySelector('.frame-block');
  selectedFrame.remove();

  if (!frameContainer.lastElementChild) {
    window.appState.activeFrame = null;
    removeButton.setAttribute('disabled', '');
    duplicateButton.setAttribute('disabled', '');
    return;
  }
  window.appState.activeFrame = frameContainer.lastElementChild;
  window.appState.activeFrame.setAttribute('selected', '');
}

function duplicateFrame(e) {
  const selectedFrame = window.appState.activeFrame;
  if (!selectedFrame) return;

  addFrame(selectedFrame);
}

function saveToGifHandler() {
  const { canvasSize, animationSpeed } = window.appState;
  const size = canvasSize.getAttribute('value');
  const frames = document.getElementById('frames-tool');
  const framesContext = frames.getFrames().map((e) => e.getCanvasContext());
  convertToGif(size, size, framesContext, animationSpeed);
}

function keyPress() {
  const drawZone = document.querySelector('.draw-zone');
  drawZone.onDrawing = onDrawHandler;
  drawZone.onStartDraw = onStartDrawHandler;
  const palleteTool = document.getElementById('pallete-tool');

  window.addEventListener('keydown', (event) => {
    if (event.defaultPrevented) {
      return;
    }

    const canvas = document.getElementById('animation-canvas');

    switch (event.code) {
      case 'KeyP':
        window.appState.tool = palleteTool.querySelector('[value="pen"]');
        break;
      case 'KeyE':
        window.appState.tool = palleteTool.querySelector('[value="eraser"]');
        break;
      case 'KeyB':
        window.appState.tool = palleteTool.querySelector('[value="bucket"]');
        break;
      case 'KeyO':
        window.appState.tool = palleteTool.querySelector('[value="colorpicker"]');
        break;
      case 'KeyS':
        this.onStartAnimation();
        break;
      case 'KeyF':
        this.onStopAnimation();
        break;
      case 'KeyG':
        this.saveToGifHandler();
        break;
      case 'KeyA':
        this.addFrame();
        break;
      case 'KeyR':
        this.removeFrame();
        break;
      case 'KeyD':
        this.duplicateFrame();
        break;
        //   case 'KeyO':
        //     this.onPickHandler(e);
        //     break;
        //   case 'KeyB':
        //     this.onFillColorHandler(e);
        //     break;
      case 'Escape':
        canvas.classList.remove('full-screen');
        break;
      default:
        null;
    }

    event.preventDefault();
  }, true);
}

function fullScreen() {
  const canvas = document.getElementById('animation-canvas');
  canvas.classList.add('full-screen');
}

function onLoadHandler() {
  window.appState = new AppState();
  const framesTool = document.getElementById('frames-tool');
  const palleteTool = document.getElementById('pallete-tool');
  const colorTool = document.getElementById('color-tool');
  const brushSize = document.getElementById('brush-size');
  const canvasSize = document.getElementById('canvas-size');
  const canvasFrameLayer = document.getElementById('canvas-frame-layer');
  const animationTool = document.getElementById('animation-tool');
  const foregroundInput = document.getElementById('foreground-color');
  const backgroundInput = document.getElementById('background-color');
  const animationSpeed = document.getElementById('animation-speed-input');

  const drawZone = document.querySelector('.draw-zone');
  drawZone.onDrawing = onDrawHandler;
  drawZone.onStartDraw = onStartDrawHandler;
  // Записать в апп стейт состойние элемента
  framesTool.onSelectedElementChanged.push((e, oldValue) => {
    window.appState.activeFrame = e;
  });

  palleteTool.onSelectedElementChanged.push((e, oldValue) => {
    window.appState.tool = e;
  });

  brushSize.onSelectedElementChanged.push((e, oldValue) => {
    window.appState.brushSize = e;
  });

  canvasSize.onSelectedElementChanged.push((e, oldValue) => {
    window.appState.canvasSize = e;
  });

  window.appState.onForegroundChanged.push((e, oldValue) => {
    foregroundInput.value = e;
  });

  window.appState.onBackgroundChanged.push((e, oldValue) => {
    backgroundInput.value = e;
  });

  window.appState.onAnimationSpeedChanged.push((e, oldValue) => {
    animationSpeed.value = e;
  });

  canvasFrameLayer.onDataChanged.push((e) => {
    window.appState.activeFrame && (window.appState.activeFrame.repaint());
  });

  foregroundInput.onchange = () => { window.appState.foreground = foregroundInput.value; };
  backgroundInput.onchange = () => { window.appState.background = backgroundInput.value; };
  animationSpeed.onchange = () => { window.appState.animationSpeed = animationSpeed.value; };


  animationTool.framesTool = framesTool;

  // для состояния текущего канваса, при наличии выделенного фрейма
  window.appState.onActiveFrameChanged.push((activeFrame) => {
    const drawArea = getDrawArea();

    if (activeFrame) {
      drawArea.removeAttribute('hidden');
      drawArea.data = activeFrame.data;
    } else {
      drawArea.setAttribute('hidden', '');
      drawArea.data = null;
    }
  });

  window.appState.onBrushSizeChanged.push((e, oldValue) => {
    brushSize.selectedElement = window.appState.brushSize;
  });

  window.appState.onToolChanged.push((e, oldValue) => {
    palleteTool.selectedElement = window.appState.tool;
  });

  window.appState.onCanvasSizeChanged.push((e, oldValue) => {
    canvasSize.selectedElement = window.appState.canvasSize;
  });

  window.appState.onCanvasSizeChanged.push((canvasSize) => {
    if (!canvasSize) return;
    const workflowSize = 500;
    canvasFrameLayer.canvasSize = canvasSize.getAttribute('value');
    canvasFrameLayer.pixelSize = workflowSize / canvasFrameLayer.canvasSize;
    animationTool.setCanvasSize(canvasFrameLayer.canvasSize);
  });

  window.appState.canvasSize = canvasSize.querySelector('[value="32"]');
  window.appState.canvasSize = canvasSize.querySelector('[value="32"]');
  window.appState.brushSize = brushSize.querySelector('[value="2"]');
  window.appState.colorTool = colorTool.querySelector('[value]');
  window.appState.animationTool = animationTool.querySelector('[value="4"]');
  window.appState.tool = null;
  window.appState.background = '#000000';
  window.appState.foreground = '#ffffff';
  window.appState.animationSpeed = 4;

  addFrame();
  onChangeAnimationSpeed();
  keyPress();
}
