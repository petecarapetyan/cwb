import {html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { Connected, State } from './connected'
import { sharedStyles } from './shared-styles'
import { dispatch } from "../state";
import { InterestSelectors } from "../state/models/interest";

declare global {
  interface HTMLElementTagNameMap {
    'view-interest-rd': InterestRD
  }
}

@customElement('view-interest-rd')
export class InterestRD extends Connected {
  @property({ type: Object,
    hasChanged(_newVal, _oldVal) {
      return true; // thus always render. No, I don't understand why, just the only way to get it to work.
    }
  })
  interestClctn: {}


  mapState(state: State) {
    // console.log("INTERESTED", InterestSelectors.interestClctn(state))
    return {
      interestClctn: InterestSelectors.interestClctn(state),
    }
  }


  delete(_e: Event) {
    dispatch.interest.delete(_e?.target?.["id"])
  }

  loadUpdateView(_e: Event) {
    dispatch.interest.loadUpdateView(_e?.target?.["id"])
  }

  updateCart(_e: Event) {
    dispatch.interest.readInShoppingCart()
  }

  render() {
    return html`
    <button type="button" @click=${this.updateCart}>Update Cart</button>
    <h3>Interested in These Products</h3>
    <!-- <a href="/interestC"><button type="button">Add Interest Document</button></a> -->
    <div class="table">
        ${Object.keys(this.interestClctn).map(key => {
          const dcmnt = this.interestClctn[key];
          return html`
            <div class="row">
              <div class="cell">
                <button id=${dcmnt["id"]} @click=${this.delete}>delete</button>
                <button id=${dcmnt["id"]} @click=${this.loadUpdateView}>update</button>
              </div>
              <div class="cell">${dcmnt["page"]}</div>
              <div class="cell">${dcmnt["datetime"]}</div>
              <div class="cell">${dcmnt["removedDatetime"]}</div>
              <div class="cell">${dcmnt["username"]}</div>
            </div>
          `;
        })}
      </div>
    `;
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        button {
          padding: 1em;
          margin-bottom: 2em;
        }
        .table .row {
          display: grid;
          grid-gap: 10px;
          padding: 0;
          list-style: none;
          grid-template-columns: auto  1fr 1fr 1fr 1fr;
        }
        .cell {
          background: #f9f7f5;
          display: block;
          text-decoration: none;
          padding: 10px;
          text-align: center;
          font-size: 10px;
        }
      `,
    ]
  }
}
