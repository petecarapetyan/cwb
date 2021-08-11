import { html, css} from 'lit';
import { Connected, State, AuthSelectors } from "./connected";
import {customElement, property} from 'lit/decorators.js';
import { sharedStyles } from "./shared-styles";

import './view-account'
import './auth-status'
import './view-signin'


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
      <auth-status></auth-status>
      <hr/>
      <view-account></view-account>` :
    html`<view-signin></view-signin>`
  }

  static get styles() {
    return [sharedStyles, 
    css`
      :host {
        padding: 2em;
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