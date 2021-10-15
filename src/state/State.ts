import { List, Record } from "immutable";
import { Syn } from "../language/Syntax";
import { Metatransition, Transition } from "./Transition";

export type StateParams = {
  t: Syn;
}

const defaultStateParams: StateParams = {
  t: {case: "hol", goal: {case: "uni", level: "omega"}}
}

export class State extends Record(defaultStateParams) {
  t!: Syn;

  constructor(params?: StateParams) {
    params ? super(params) : super();
  }
}

export function update(state: State, delta: Metatransition): State {
  throw new Error("unimplemented");
}

export function expandMetatransition(state: State, delta: Metatransition): List<Transition> {
  throw new Error("unimplemented");
}