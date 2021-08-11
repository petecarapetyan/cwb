import { html, css} from 'lit';
import { Connected, State, AuthSelectors } from "./connected";
import {customElement, property} from 'lit/decorators.js';
import { sharedStyles } from "./shared-styles";

import './auth-status'
import "./view-interest-C";
import "./view-interest-RD";
import "./view-interest-U";


declare global {
  interface HTMLElementTagNameMap {
    'app-shell': AppShellElement
  }
}

@customElement('app-shell')
export class AppShellElement extends Connected {
  @property({ type: Boolean }) authenticated: boolean;

  mapState(state: State) {
    return {
      authenticated: AuthSelectors.authenticated(state)
    };
  }


  render() {
    return  this.authenticated
    ? html`
    <p>This is very crude cart functionality to demonstrate communication with both localstorage and the remote firestore database.</p>
    <p>If you implemented this module you would - no doubt - rewrite it to suit your own shopping cart needs</p>
    <hr/>
    <p>Click the "Update Cart" button to bring any products from localstorage into the cart</p>
    
    <view-interest-rd></view-interest-rd>` :
      html`<a href="/signin">Sign In, first</a>`
  }

  static get styles() {
    return [sharedStyles, 
    css`
      :host {
        padding: 2em;
      }
    `
    ]
  }
}