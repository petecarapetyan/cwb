import {html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { Connected, State } from './connected'
import { sharedStyles } from './shared-styles'
import { dispatch } from "../state";
import { InterestDcmnt,InterestSelectors } from "../state/models/interest";

declare global {
  interface HTMLElementTagNameMap {
    'view-interest-u': InterestU
  }
}

@customElement('view-interest-u')
export class InterestU extends Connected {
  @property({ type: Object })
  dcmntFocus: InterestDcmnt

  mapState(state: State) {
    return {
      dcmntFocus:  InterestSelectors.dcmntFocus(state),
    }
  }
  // What is this? Allows the form submit to fire submit(form) method
  firstUpdated() {
    if (!!this.shadowRoot) {
      const form = this.shadowRoot.getElementById("interestForm");
      if (!!form) {
        form.onsubmit = (e: Event) => {
          e.preventDefault();
          this.submit(form);
        };
      }
    }
  }

  submit(form) {
    let data = {};
    data["id"] = this.dcmntFocus.id;
    data["page"] = form["page"].value;
    data["datetime"] = form["datetime"].value;
    data["removedDatetime"] = form["removedDatetime"].value;
    data["username"] = form["username"].value;
    dispatch.interest.updateDcmnt(data as InterestDcmnt)
  }

  render() {
    return html`
      <h3>Update Interest Document with ID of <em>'${this.dcmntFocus.id}'</em> </h3>
      <form id="interestForm">
        <fieldset>
          <label for="page">Page:</label><br/>
          <input type="text" id="page" name="page" value="${this.dcmntFocus.page?this.dcmntFocus.page:"" }" /><br />
                    <label for="datetime">Datetime:</label><br/>
          <input type="text" id="datetime" name="datetime" value="${this.dcmntFocus.datetime?this.dcmntFocus.datetime:"" }" /><br />
                    <label for="removedDatetime">RemovedDatetime:</label><br/>
          <input type="text" id="removedDatetime" name="removedDatetime" value="${this.dcmntFocus.removedDatetime?this.dcmntFocus.removedDatetime:"" }" /><br />
                    <label for="username">Username:</label><br/>
          <input type="text" id="username" name="username" value="${this.dcmntFocus.username?this.dcmntFocus.username:"" }" /><br />
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
