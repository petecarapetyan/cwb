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
      <view-account></view-account>
      <p if-user>IF a user</p>
      <p if-not-user> if NOT a user</p>
      <p if-moderator> IF a moderator</p>
      <p if-not-moderator> if NOT a moderator</p>
      <p if-admin>IF an admin</p>
      <p if-not-admin>if NOT an admin</p>
      <p if-superadmin>IF a superadmin</p>
      <p if-not-superadmin>if NOT a superadmin</p>
    ` :
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