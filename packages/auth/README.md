# cwb-auth

Aug 2, 2021

## Auth

Web Component provides

- **logging in** - with Firebase Auth
- **roles** - maintaining in local state: Copy of user's role object
- **logging out**
- future: anything to do with profile maintenance

## About the Roles Object

There can be confusion about what the roles object is and how it is created and consumed. This may clear up some of this:

- Firestore maintains a "roles" object under /users/{userid}/roles
- How this object is structured or maintained is not the concern of this component
- How this object is consumed by the app is not the concern of this component
- The function of this component as it relates to the roles object is ONLY to make sure that the client has a copy of the latest roles object in the client state at all times.

## Security?

Roles can be used to create a visual simulation of security.

But any good hacker can get around client side security, so be sure to employ something like [this](https://firebase.google.com/docs/firestore/security/get-started) on the back end to truly protect your app's data.

## JWT vs rdx State WUT???

3 systems maintain exactly the same roles object!

- rdx State on the browswer client
- Firestore /users/{userId}/roles object
- JWT, or Custom Claims object

Doesn't this seem a bit excessive? Here's why it is helpful, or even required.

1. rdx State is the most easily accessible in the browser client
1. JWTs can require a log out and log back in to be visible on the browser client! Very inconvenient
1. Firestore acts is the central place of persistence for rcx State
1. Firebase storage and other systems work best against a Custom Claims Object (or JWT)

So, to secure all of these systems we must maintain the same data in 3 different systems instead of 1 or 2

Firebase functions (see [this](https://github.com/petecarapetyan/cwb-functions/blob/main/functions/src/roles.ts)) does the back end work of keeping Firestore and the JWT in sync. Technically, this is unrelated to this web component.

## Notes about documentation

See https://github.com/petecarapetyan/cwb-mpa-test-site/blob/main/README.md