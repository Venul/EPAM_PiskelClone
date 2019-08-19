/* eslint-disable import/extensions */
/* eslint-disable no-useless-constructor */
/* eslint-disable import/prefer-default-export */
import { SelectorTool } from '../selector-tool/selector-tool.js';

export class FramesTool extends SelectorTool {
  constructor() {
    super();
  }

  appendFrame(newFrame) {
    newFrame.setAttribute('class', 'frame');
    newFrame.setAttribute('selectable', '');

    this.appendChild(newFrame);
    this.selectedElement = newFrame;
  }

  getFrames() {
    return Array.from(this.querySelectorAll('.frame'));
  }

  getFramesCount() {
    return this.childElementCount;
  }

  getFrameByIndex(index) {
    return this.children[index];
  }
}

customElements.define('frames-tool', FramesTool);
