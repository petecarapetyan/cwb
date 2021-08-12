import { html, css } from "lit";
import { Connected, State, AuthSelectors } from "./connected";
import { customElement, property } from "lit/decorators.js";
import { sharedStyles } from "./shared-styles";

import "./view-account";
import "./auth-status";
import "./view-signin";
import { cssVars } from "./css-vars";

declare global {
  interface HTMLElementTagNameMap {
    "app-shell": AppShellElement;
  }
}

@customElement("app-shell")
export class AppShellElement extends Connected {
  @property({ type: Boolean }) authenticated: boolean;

  mapState(state: State) {
    return {
      authenticated: AuthSelectors.authenticated(state),
    };
  }

  // TODO: put the checkboxes in a different component
  render() {
    return this.authenticated
      ? html`
          <auth-status></auth-status>
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
          <hr />
          <view-account></view-account>
        `
      : html`<view-signin></view-signin>`;
  }

  static get styles() {
    return [
      sharedStyles,
      cssVars,
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
      `,
    ];
  }
}
