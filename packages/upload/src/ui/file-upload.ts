import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  Connected,
  State,
  AuthSelectors,
  UploadSelectors,
  dispatch,
} from "./connected";
import { sharedStyles } from "./shared-styles";

declare global {
  interface HTMLElementTagNameMap {
    "file-upload": FileUploadElement;
  }
}

@customElement("file-upload")
export class FileUploadElement extends Connected {
  @property({ type: Boolean })
  authenticated: boolean;
  @property({ type: Object })
  file: File;
  @property({ type: Number })
  progress = 0;
  @property({ type: String })
  message: string = "";

  mapState(state: State) {
    return {
      authenticated: AuthSelectors.authenticated(state),
      progress: UploadSelectors.progress(state),
      message: UploadSelectors.message(state)
    };
  }

  selectFile(_e) {
    this.file = _e.target.files[0];
    dispatch.upload.upload(this.file);
  }


  render() {
    return this.authenticated
      ? html`
          <input accept="image/*, audio/*, video/*, .pdf"
           type="file" id=”upload-file” name=”icon” 
                  @change=${this.selectFile}></input>
          ${
            this.progress > 0
              ? html`${this.progress < 98
                  ? html`<progress
                      value="${this.progress}"
                      max="100"
                      id="uploader"
                    >
                      ${this.progress}%
                    </progress>`
                  : ""}`
              : html``
          }
          ${this.message && this.message.length>0?
          html`<h3>${this.message}</h3>
          <p> It takes 10 minutes (or more, depending) for the server to create web-optimized copies of an image for your use on web pages.</p>
          <p><a href="/cwb/media/"> Click here to see images that have already been processed</a></p>
          `:''}
        `
      : html` <a href="/signin" title="Sign In"> Go to Sign In Page </a>`;
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          padding: 3px;
        }
        .progress-container {
          height: 8em;
          background-color: white;
        }
      `,
    ];
  }
}
