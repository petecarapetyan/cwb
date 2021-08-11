
import {html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { Connected, User, State, AuthSelectors } from './connected'
import { sharedStyles } from './shared-styles'
import { dispatch } from './connected'


declare global {
  interface HTMLElementTagNameMap {
    'view-account': ViewAccountElement
  }
}

@customElement('view-account')
export class ViewAccountElement extends Connected {
  @property({ type: Boolean })
  statusKnown: boolean

  @property({ type: Boolean })
  authenticated: boolean

  @property({ type: Object })
  user: User

  @property({ type: Object })
  roles: any

  mapState(state: State) {
    return {
      statusKnown: AuthSelectors.statusKnown(state),
      authenticated: AuthSelectors.authenticated(state),
      user: AuthSelectors.user(state),
      roles: AuthSelectors.roles(state),
    }
  }

  signOut(_e: Event) {
    dispatch.auth.signout()
  }

  render() {
    return this.authenticated
      ? html`
          <h1>Your Account</h1>
          <h2>${this.user.displayName}</h2>
          <p>${this.user.email}</p>
          <button raised @click=${this.signOut}>
            Sign out
          </button>
          <h3>Roles:</h3>
          <pre>${JSON.stringify(this.roles, null, '  ')}</pre>
          <h3>Raw Auth Data:</h3>
          <pre>${JSON.stringify(this.user, null, '  ')}</pre>
        `
      : html`
          <h1>Your Account</h1>
          <p>You need to <a href="/signin">Sign-in</a> to use this app.</p>
        `
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          padding: 2em;
        }
      `
    ]
  }
}
