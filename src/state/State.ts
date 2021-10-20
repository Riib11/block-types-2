import { List, Record } from "immutable";
import { Code } from "../language/Code";
import { MetaTransition, Transition } from "./Transition";

export type StateParams = {
  c: Code;
}

export function makeDefaultStateParams(): StateParams {
  // c1 = c2 : c3
  // c2 = ?
  // c3 = ?
  let tmp: Code = undefined as unknown as Code;
  let c1: Code = {
    case: "hol",
    sig: tmp,
    meta: {
      fix: "free",
      parent: "top",
      transitions: () => {throw new Error("undefined")}
    }
  };
  let c2: Code = {
    case: "hol",
    sig: tmp,
    meta: {
      fix: "type",
      parent: c1,
      transitions: () => {throw new Error("undefined")}
    }
  };
  let c3: Code = {
    case: "uni",
    lvl: "omega",
    meta: {
      fix: "term",
      parent: c1,
      transitions: () => {throw new Error("undefined")}
    }
  };
  c1.sig = c2;
  c2.sig = c3;
  return {
    c: c1
  }
}

export class State extends Record(makeDefaultStateParams()) {}

export function update(state: State, delta: MetaTransition): State {
  return expandMetaTransition(state, delta).reduce((state, tran) => updateSingle(state, tran), state);
}

export function updateSingle(state: State, delta: Transition): State {
  throw new Error("unimplemented");
}

export function expandMetaTransition(state: State, delta: MetaTransition): List<Transition> {
  throw new Error("unimplemented");
}