import App from "./App";
import { Code } from "./language/Code";
import { Id, Nrm, Syn } from "./language/Syntax";

export default class Renderer {
  app: App;

  constructor(app: App) {
    this.app = app;
  }

  renderState(): JSX.Element {
    return (
      <div className="state">
        {this.renderCanvas()}
        {this.renderPanel()}
      </div>
    );
  }

  renderCanvas(): JSX.Element {
    return (
      <div className="canvas">
        {this.renderProgram()}
        {this.renderBuffers()}
      </div>
    );
  }

  renderProgram(): JSX.Element {
    return (
      <div className="program">
        program
      </div>
    );
  }

  renderBuffers(): JSX.Element {
    return (
      <div className="buffers">
        buffers
      </div>
    );
  }

  renderPanel(): JSX.Element {
    return (
      <div className="panel">
        {this.renderEnvironment()}
        {this.renderPalette()}
        {this.renderConsole()}
      </div>
    );
  }

  renderEnvironment(): JSX.Element {
    return (
      <div className="environment">
        {this.renderContext()}
        <hr />
        {this.renderGoal()}
      </div>
    );
  }

  renderContext(): JSX.Element {
    return (
      <div className="context">
        context
      </div>
    )
  }

  renderGoal(): JSX.Element {
    return (
      <div className="goal">
        goal
      </div>
    );
  }

  renderPalette(): JSX.Element {
    return (
      <div className="palette">
        palette
      </div>
    );
  }

  renderConsole(): JSX.Element {
    return (
      <div className="console">
        console
      </div>
    );
  }

  renderCode(c: Code): JSX.Element {
    // let app = this;
    // switch (c.case) {
    //   case "uni"
    // }
    throw new Error("unimplemented");
  }
  

  renderSyn(t: Syn, i: number = 0): JSX.Element {
    switch (t.case) {
      case "uni": return (<span className="uni">U</span>);
      case "pie": return (<span className="pie">(Π ({this.renderId(t.var.id)} : {this.renderSyn(t.dom, i)}) . {this.renderSyn(t.dom, i)})</span>);
      case "lam": return (<span className="lam">(λ ({this.renderId(t.var.id)} : {this.renderSyn(t.dom, i)}) . {this.renderSyn(t.bod, i)})</span>);
      case "neu": return (<span className="neu">({this.renderId(t.var.id)} {t.args.map(arg => this.renderSyn(arg, i)).join()})</span>);
      case "let": return (<span className="let">{indent(i)}(let {this.renderId(t.var.id)} : {this.renderSyn(t.sig, i)} = {this.renderSyn(t.imp, i + 1)} in<br/>{this.renderSyn(t.bod, i)})</span>);
      case "hol": return (<span className="hol">({this.renderHole()} : {this.renderSyn(t.sig, i)})</span>);
    }
  }

  renderId(id: Id): JSX.Element {
    return (
      <span className="id">{id.value}</span>
    )
  }

  renderHole(): JSX.Element {
    return (
      <span className="hole">?</span>
    )
  }

  renderNrm(t: Nrm, i: number = 0): JSX.Element {
    switch (t.case) {
      case "uni": return (<span className="uni">U</span>);
      case "pie": return (<span className="pie">(Π ({this.renderId(t.var.id)} : {this.renderNrm(t.dom, i)}) . {this.renderNrm(t.dom, i)})</span>);
      case "lam": return (<span className="lam">(λ ({this.renderId(t.var.id)} : {this.renderNrm(t.dom, i)}) . {this.renderNrm(t.bod, i)})</span>);
      case "neu": return (<span className="neu">({this.renderId(t.var.id)} {t.args.map(arg => this.renderNrm(arg, i)).join()})</span>);
      case "hol": return (<span className="hol">({this.renderHole()} : {this.renderNrm(t.sig, i)})</span>);
    }
  }
}

function indent(n: number): JSX.Element {
  let indentation: JSX.Element[] = [];
  for (let i = 0; i < n; i++)
    indentation.push(<span className="indent"></span>);
  return (<span className="indentation">{indentation}</span>);
}