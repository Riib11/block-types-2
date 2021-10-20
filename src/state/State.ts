import { List, Record } from "immutable";
import { Code } from "../language/Code";
import { MetaTransition, Transition } from "./Transition";

export type StateParams = {
  c: Code;
}

export const defaultStateParams: StateParams = {
  c: {
    case: "hol",
    sig: {
      case: "hol",
      sig: {
        case: "uni",
        lvl: "omega",
        meta: {fix: "term"}
      },
      meta: {fix: "type"}
    },
    meta: {fix: "free"}
  }
}

export class State extends Record(defaultStateParams) {}

export function update(state: State, delta: MetaTransition): State {
  return expandMetaTransition(state, delta).reduce((state, tran) => updateSingle(state, tran), state);
}

export function updateSingle(state: State, delta: Transition): State {
  throw new Error("unimplemented");
}

export function expandMetaTransition(state: State, delta: MetaTransition): List<Transition> {
  throw new Error("unimplemented");
}