import React from 'react';
import './App.css';
import { State } from './state/State';

export default class App extends React.Component<Props, State> {
  state: State = new State();

  constructor(props: Props) {
    super(props);
  }
}

export type Props = {

}