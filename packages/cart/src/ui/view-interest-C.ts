import {html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import { Connected } from './connected'
import { sharedStyles } from './shared-styles'
import { dispatch } from "../state";
import { InterestDcmnt } from "../state/models/interest";

declare global {
  interface HTMLElementTagNameMap {
    'view-interest-c': InterestC
  }
}

@customElement('view-interest-c')
export class InterestC extends Connected {

  // Why this? Allows the form submit to fire submit(form) method
  firstUpdated() {
    const form = this.shadowRoot?.getElementById("interestForm");
    if (!!form) {
      form.onsubmit = (e: Event) => {
        e.preventDefault();
        this.submit(form);
      };
    }
  }

  submit(form) {
    let data = {};
    data["page"] = form["page"].value;
    data["datetime"] = form["datetime"].value;
    data["removedDatetime"] = form["removedDatetime"].value;
    data["username"] = form["username"].value;
    dispatch.interest.create(data as InterestDcmnt)
  }

  render() {
    return html`
      <h3>Add Interest Document to the Collection:</h3>
      <form id="interestForm">
        <fieldset>
          <label for="page">Page:</label><br/>
          <input type="text" id="page" name="page" value="Page  ${Date.now()}" /><br />
                    <label for="datetime">Datetime:</label><br/>
          <input type="text" id="datetime" name="datetime" value="Datetime  ${Date.now()}" /><br />
                    <label for="removedDatetime">RemovedDatetime:</label><br/>
          <input type="text" id="removedDatetime" name="removedDatetime" value="RemovedDatetime  ${Date.now()}" /><br />
                    <label for="username">Username:</label><br/>
          <input type="text" id="username" name="username" value="Username  ${Date.now()}" /><br />
          <br />
          <input type="submit" value="Submit" />
        </fieldset>
      </form>
      <p>A <em>'Document'</em> in Firestore is perhaps analagous to the row of a table, in SQL-land</p>
    `;
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        button {
          padding: 1em;
        }
        input {
          margin-bottom: 1em;
        }
      `,
    ]
  }
}
