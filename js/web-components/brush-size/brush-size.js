/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-useless-constructor */
import { SelectorTool } from '../selector-tool/selector-tool.js';

export class BrushSize extends SelectorTool {
  constructor() {
    super();
  }
}

customElements.define('brush-size', BrushSize);
