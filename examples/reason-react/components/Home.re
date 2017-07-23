let component = ReasonReact.statelessComponent "Home";
let make _children => {
  ...component,
  render: fun _self => <section> <Header title="ReasonReact example" /> <Intro /> </section>
};
let jsComponent =
  ReasonReact.wrapReasonForJs
    ::component
    (fun _jsProps => make [||])
