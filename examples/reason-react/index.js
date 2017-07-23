import { jsComponent as Home } from "./components/home.re";
import React from "react";
import ReactDOM from "react-dom";

const App = () =>
  <main>
    <Home />
    <footer>babel-plugin-bucklescript ReasonReact example</footer>
  </main>;

ReactDOM.render(<App />, document.body.querySelector("[data-hook='app']"));
