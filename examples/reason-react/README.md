# ReasonReact example

This is a small example showing how to mix ReasonML/Bucklescript with an existing react project. This created three components in Reason called `Home`, `Header`, and `Intro`. It then uses javascript to pull in those react components and render them alongside a javascript react component into the DOM.

For more info on ReasonReact, see their [documentation](https://reasonml.github.io/reason-react).

# Setup

First, install the project dependencies.

```sh
npm install
```

Once everything is installed, you can then build the project.

```sh
npm run build
```

Finally, you should be able to open the `index.html` file in your favorite browser and see a bona fide react app using javascript and ReasonML rendered to the page.
