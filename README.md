# babel-plugin-bucklescript
> Write ReasonML and Bucklescript in your existing babel projects

Functional programming is cool. [ReasonML](https://reasonml.github.io/) is cool. [Bucklescript](http://bucklescript.github.io/bucklescript/) is cool. But you may not have the opportunity to start a new project or rewrite an existing one in those languages. In that case, `babel-plugin-bucklescript` is here for you!

`babel-plugin-bucklescript` lets you easily add ReasonML or Bucklescript projects to your existing codebases via a babel plugin. It relies on existing tools like `bs-platform` to work. And since `bs-platform` is amazingly fast, so is this plugin. It works for node-style `require` calls as well as ES2015 `import` statements.

# Installation

To get started, add `babel-plugin-bucklescript` and `bs-platform` to your project's dev dependencies.

```sh
# with good ol' npm
npm install -D babel-plugin-bucklescript bs-platform

# with yarn
yarn add -D babel-plugin-bucklescript bs-platform
```

After that's finished, add the plugin to your babel dependencies. By default, this plugin will assume you're using the `js` package spec. For more information, see the [bucklescript manual on using bsb](http://bucklescript.github.io/bucklescript/Manual.html#_a_real_world_example_of_using_code_bsb_code).

```json
{
  "plugins": ["babel-plugin-bucklescript"]
}
```

If, however, you want to compile to `amdjs` or `es6`, you can pass that in as an option.

```json
{
  "plugins": [
    ["babel-plugin-bucklescript", { "module": "es6" }]
  ]
}
```

Finally, you'll want to add a `bsconfig.json` file in the root of your project. Note that by default, `bsb` will compile to a folder called `lib` in the root of your project, no matter where your source code is. Take that into account when building your project. As of right now, this plugin only supports that compilation directory.

```json
{
  "name": "your-cool-project",
  "sources": ["src"],
  "bs-dependencies": ["reason-react"],
  "reason": {
    "react-jsx": 2
  },
  "package-specs": ["commonjs"]
}
```

# Basic example

```
/* In a file called test.re */
let add x y => x + y
```

```js
// In a file called index.js
const { add } = require("./test.re");

console.log(add(1, 2)) // -> 3
```

# TODO

- Full examples
- Tests
- Integration testing with multiple types of projects

# Contributing

Issues and Pull requests are both welcomed! Prettier is enabled by default as a pre-commit hook, but feel free to add it to your editor.

# [Code of Conduct](CODE_OF_CONDUCT.md)

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

# [Changelog](CHANGELOG.md)

# [License](LICENSE.md)
