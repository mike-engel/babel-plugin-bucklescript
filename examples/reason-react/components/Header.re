let component = ReasonReact.statelessComponent "Header";
let make ::title _children => {
  ...component,
  render: fun _self => <h1> (ReasonReact.stringToElement title) </h1>
};
