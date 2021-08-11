import {css} from 'lit';
export const sharedStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
  }

  :host([hidden]), [hidden] {
    display: none !important;
  }
`