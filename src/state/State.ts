import { List, Record } from "immutable";
import { Code } from "../language/Code";
import { MetaTran, Tran } from "./Transition";

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

export function update(state: State, delta: MetaTran): State {
  return expandMetaTran(state, delta).reduce((state, tran) => updateSingle(state, tran), state);
}

export function updateSingle(state: State, delta: Tran): State {
  throw new Error("unimplemented");
}

export function expandMetaTran(state: State, delta: MetaTran): List<Tran> {
  throw new Error("unimplemented");
}