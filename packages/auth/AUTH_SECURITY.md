# Auth Roles Listener

This module maintains the current security roles as the rdx `state.auth.roles` object for any usage you may have.

Typical usage is toggling either rendering or visibility of one or more web components.

It's power comes from it's simplicity. By leaving the structure of the roles object totally open, role based UI visibility can be as complex or as varied as desired, with no effect on any other functionality provided by the auth module.

## What is the source of the roles object?

This is outside the scope of this document, excepting the vague explanation that the json object is maintained in the firestore database under `users/{user-id}/roles`.

That roles object is created and updated by other module(s):

- Firebase functions fire the appropriate triggers to notify this auth module to watch for changes in the firestore `users/{user-id}/metadata` field, which is used to trigger the listener.

- You may optionally use a third role-admin module to read and write the data under firestore's `users/{user-id}/roles`

## How is the roles object updated?

When the roles object is changed in the firestore database, this module fires an update and brings in the latest.

## What primary role based functionality is provided by this module?

The primary role based security function of is to keep the `state.auth.roles` object up to date every time it is changed [by anything or anyone] on the back end.

## This module must be paired with a functions module

[yada to be named module](yada) provides the back end functionality necessary to make this module work.

Specifically, it populates the initial role object when a new user is created, and then writes this to firestore.

For example:
```
{
  user: true
}
```


## `if-myrole` CSS class

The CSS class functionality described is only one of several ways to consume the `state.auth.roles` object. It might be the handiest, though.

In the instance that the consuming party set up a roles object such as

```
{
  user: true,
  myrole: true,
  otherrole: true
}
```

This module would provide CSS classes consumeable in any web component as follows, where if-myrole defined visibility of that component depending on the `state.auth.roles` object.

`<my-component if-myrole=true> foobar </my-component>`
or
`<your-component if-not-myrole=true> foobar </your-component>`

Yet, if you had a more complex nested `state.auth.roles` object, the nested parts of the roles object would not be consumeable in such a manner.

## Other ways to consume `state.auth.roles`

Any other ways such as indicated [here](https://lit.dev/docs/templates/conditionals/) can be used to define visibility within a page. Since `state.auth.roles` is just an object, your options are not limited.

These options are all valid but out of scope for this documentation.

## Credits

The design for refreshing `state.auth.roles` on change is from [this source by Austin Murdoch](https://www.youtube.com/watch?v=JOASK1BL67M&t=632s)

The design for creating CSS classes from roles is by [Simon Green](https://github.com/CaptainCodeman), as is most of the rest of the code in this auth module, coming from [rdx-demo](https://github.com/CaptainCodeman/rdx-demo)

