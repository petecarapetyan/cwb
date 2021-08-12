import { html, css} from 'lit';
import { Connected, State, AuthSelectors } from "./connected";
import {customElement, property} from 'lit/decorators.js';
import { sharedStyles } from "./shared-styles";
import { cssVars } from './css-vars';

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
    
    <view-interest-rd></view-interest-rd>
    
    <hr />
          <div if-user>
            <input type="checkbox" id="user" name="user" checked disabled/>
            <label for="user">User</label>
          </div>
          <div if-not-user>
            <input type="checkbox" id="notuser" name="notuser" disabled/>
            <label for="notuser">User</label></div>
          <div if-moderator>
            <input type="checkbox" id="moderator" name="moderator" checked disabled/>
            <label for="moderator">Moderator</label></div>
          <div if-not-moderator>
            <input type="checkbox" id="notmoderator" name="notmoderator" disabled/>
            <label for="notmoderator">Moderator</label></div></div>
          <div if-admin>
            <input type="checkbox" id="admin" name="admin" checked disabled/>
            <label for="admin">Admin</label></div>
          <div if-not-admin>
            <input type="checkbox" id="notadmin" name="notadmin" disabled/>
            <label for="notadmin">Admin</label></div></div>
          <div if-superadmin>
            <input type="checkbox" id="superadmin" name="superadmin" checked disabled/>
            <label for="superadmin">Super Admin</label></div>
          <div if-not-superadmin>
            <input type="checkbox" id="notsuperadmin" name="notsuperadmin" disabled/>
            <label for="notsuperadmin">Super Admin</label></div></div>
          <hr />` :
      html`<a href="/signin">Sign In, first</a>`
  }

  static get styles() {
    return [sharedStyles, cssVars,
    css`
      :host {
        padding: 2em;
      }
    `
    ]
  }
}