import React from 'react';
import './App.css';
import Renderer from './Renderer';
import { State } from './state/State';

export default class App extends React.Component<Props, State> {
  state: State;
  renderer: Renderer;

  constructor(props: Props) {
    super(props);
    this.state = new State({t: {case: "hol", sig: {case: "hol", sig: {case: "uni", lvl: "omega"}}}});
    this.renderer = new Renderer(this.state);
  }

  render(): JSX.Element {
    return this.renderer.renderState();
  }
}

export type Props = {

}