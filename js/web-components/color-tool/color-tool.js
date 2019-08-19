/* eslint-disable no-useless-constructor */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
import { SelectorTool } from '../selector-tool/selector-tool.js';

export class ColorTool extends SelectorTool {
  constructor() {
    super();
  }
}

customElements.define('color-tool', ColorTool);
