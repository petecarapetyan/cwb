import {html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { Connected, State } from './connected'
import { sharedStyles } from './shared-styles'
import { dispatch } from "../state";
import { MediaSelectors } from "../state/models/media";

declare global {
  interface HTMLElementTagNameMap {
    'view-media': Media
  }
}

@customElement('view-media')
export class Media extends Connected {
  @property({ type: Object,
    hasChanged(_newVal, _oldVal) {
      return true; // thus always render. No, I don't understand why, just the only way to get it to work.
    }
  })
  mediaClctn: {}


  mapState(state: State) {
    return {
      mediaClctn: MediaSelectors.mediaClctn(state),
    }
  }


  delete(_e: Event) {
    dispatch.media.delete(_e?.target?.["id"])
  }


  render() {
    return html`
    <h3>Media</h3>
    <!-- <a href="/mediaC"><button type="button">Add Media Document</button></a> -->
    <div class="table">
        ${Object.keys(this.mediaClctn).map(key => {
          console.log(`HERE ${key}`)
          const media = this.mediaClctn[key];
          const w300 = `https://storage.googleapis.com/fauxmazon.appspot.com/publicMedia/300/${media["id"]}${media["type"]}`
          const w1300 = `https://storage.googleapis.com/fauxmazon.appspot.com/publicMedia/1300/${media["id"]}${media["type"]}`
          const htmlCode = `<img src="${w1300}" alt="${media.name}" />`
          const markdown = `![${media.name}](${w1300})`
          return html`
            <div class="row">
              <div><img src=${w300} width=300></img> </div>
              <div class="cell">
                <div><a href=${w1300}>VIEW FULL FORMAT</a></div>
                <div class="cell">${markdown}</div>
                <div class="cell">${htmlCode}</div>
              </div>
              <div class="cell">
                <button id=${media["name"]} @click=${this.delete}>delete</button>
              </div>
            </div>
            <hr/>
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
