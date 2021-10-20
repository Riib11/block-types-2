import { Id, Syn } from "./language/Syntax";
import { State } from "./state/State";

export default class Renderer {
  state: State;

  constructor(state: State) {
    this.state = state;
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
  

  renderSyn(t: Syn, i: number = 0): JSX.Element {
    switch (t.case) {
      case "uni": return (<span className="uni">U</span>);
      case "pie": return (<span className="pie">(Π ({this.renderId(t.var.id)} : {this.renderSyn(t.dom, i)}) . {this.renderSyn(t.dom, i)})</span>);
      case "lam": return (<span className="lam">(λ ({this.renderId(t.var.id)} : {this.renderSyn(t.dom, i)}) . {this.renderSyn(t.bod, i)})</span>);
      case "neu": return (<span className="neu">({this.renderId(t.var.id)} {t.args.map(arg => this.renderSyn(arg)).join()})</span>);
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

  renderSynNrm(): JSX.Element {
    throw new Error("unimplemented");
  }
}

function indent(n: number): JSX.Element {
  let indentation: JSX.Element[] = [];
  for (let i = 0; i < n; i++)
    indentation.push(<span className="indent"></span>);
  return (<span className="indentation">{indentation}</span>);
}