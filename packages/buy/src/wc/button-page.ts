import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';


declare global {
  interface HTMLElementTagNameMap {
    'button-page': ButtonPageElement
  }
}

@customElement('button-page')
export class ButtonPageElement extends LitElement {

  private _onClick() {
    // localStorage.clear()
    const key = "page_clicked_" + new Date().getTime()
    localStorage.setItem(key, window.location.pathname)
    alert(localStorage.key(localStorage.length - 1)+"="+window.location.pathname)
  }

  render() {
    return html`
    <button @click=${this._onClick}>+</button>
    `
  }

  static get styles() {
    return css`
      .something {
        display: block;
      }
    `
  }
}