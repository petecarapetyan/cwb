# wcfb
Web Components with Firebase Back ends - monorepo including several web components with Firebase back ends, and Rocket/11ty MPA to test them within.

## Opposite From Normal SPA Configuration

This is an experimental project

Most apps are SPAs, so that components can share a common back end library

In this configuration, the Firebase back end is replicated within EACH web component that consumes it.

## Use Case - MPA that is predominantly free of a back end.

In some apps, a back end connection is only needed on a very few pages. My use case was a shopping site:

- 90 pages pure product content - no back end connection
- 1 page login/user functionality
- 1 page shopping cart
- 1 page media upload
- 1 page media admin
- 1 page security admin

In the above configuration, only the single pages need a back end connection. So each of these is a separate Web Component with a Firebase Back end connection.

## Monorepo started, not working

- This monorepo started as separate repos for each component
- An effort was made (this repo) to put it into monorepo form
- I ran out of gas before I got all the rollup stuff working properly

So, for the moment, it's really a bunch of separate projects organized improperly under "packages"
