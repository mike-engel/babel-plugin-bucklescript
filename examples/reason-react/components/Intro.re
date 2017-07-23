let component = ReasonReact.statelessComponent "Intro";
let introText = "This is the ReasonReact example for the babel-plugin-bucklescript example!";
let make _children => {
  ...component,
  render: fun _self => <p> (ReasonReact.stringToElement introText) </p>
};
