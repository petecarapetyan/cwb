import { html, css} from 'lit';
import { Connected, State, AuthSelectors } from "./connected";
import {customElement, property} from 'lit/decorators.js';
import { sharedStyles } from "./shared-styles";

import './auth-status'
import "./view-media";


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
    ? html`<view-media></view-media>` :
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