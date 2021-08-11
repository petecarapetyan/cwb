import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import { sharedStyles } from "./shared-styles";

import './file-upload'


declare global {
  interface HTMLElementTagNameMap {
    'app-shell': AppShellElement
  }
}

@customElement('app-shell')
export class AppShellElement extends LitElement {


  render() {
    return html`
    <file-upload></file-upload>
    `
  }

  static get styles() {
    return [sharedStyles, 
    css`
      app-view {
        box-sizing: border-box;
        padding: var(--min-padding);
      }

      auth-status {
        height: 56px;
        background-color: #f8f8f8;
      }

      @media (min-width: 600px) {
        auth-status {
          height: 64px;
        }
      }
    `
    ]
  }
}