import { css } from "lit";

/*
After you have established your top level roles
they can be added here - hardcoded but helpful
as convenience classes to be consumed like
<div class="if-user">My stuff that shows only for a user</div>
*/
export const cssVars = css`
  [if-user] {
    display: var(--display-if-user, none);
  }
  [if-not-user] {
    display: var(--display-if-not-user, block);
  }
`;
