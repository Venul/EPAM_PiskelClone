/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
import { MainComponent } from '../main-component/main-component.js';

export class SelectorTool extends MainComponent {
  constructor() {
    super();
    this.onSelectedElementChanged = [(e, oldValue) => {
      oldValue && oldValue.removeAttribute('selected');
      e && e.setAttribute('selected', '');
    }];

    // оборачиваем поле объекта, для того, чтобы мы могли с ним взаимодействовать
    Object.defineProperty(this, 'selectedElement', {
      get() {
        return this._selectedElement;
      },
      set(e) {
        if (e === this._selectedElement) return;

        const oldValue = this._selectedElement;
        this._selectedElement = e;
        // перебор всех элементов обработчиков и последовательный их выбор
        this.onSelectedElementChanged.forEach((f) => f(e, oldValue));
      },
    });

    this.addEventListener('click', (event) => {
      // реакция на элемент с атрибутом selectable
      const path = event.path || (event.composedPath && event.composedPath());
      for (const element of path) {
        if (element.hasAttribute && element.hasAttribute('selectable')) {
          this.selectedElement = element;
          break;
        }
      }
    });
  }
}

customElements.define('selector-tool', SelectorTool);
