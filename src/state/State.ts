import { List, Record } from "immutable";
import { freshHix } from "../language/Hix";
import { mutate } from "../language/Mutation";
import { Syn } from "../language/Syntax";
import { Transition } from "./Transition";

export type StateParams = {
  t: Syn,
  buffers: List<Buffer>,
  transitions: List<Transition>
}

export function makeDefaultStateParams(): StateParams {
  let t1: Syn = {
    case: "hol",
    hix: freshHix(),
    sig: {
      case: "hol",
      hix: freshHix(),
      sig: {
        case: "uni",
        lvl: "omega",
        meta: {
          fix: "term",
          transitions: List()
        }
      },
      meta: {
        fix: "type",
        transitions: List()
      }
    },
    meta: {
      fix: "free",
      transitions: List()
    }
  };
  return {
    t: t1,
    buffers: List(),
    transitions: List()
  }
}

export class State extends Record(makeDefaultStateParams()) {}

export function update(state: State, tran: Transition): State {
  switch (tran.case) {
    case "mutate": return state.set('t', mutate(state.t, tran.mut));
    case "create buffer": return state.set('buffers', state.get('buffers').push(tran.buffer));
    case "delete buffer": throw new Error("unimplemented");
    case "submit buffer": throw new Error("unimplemented");
    case "rename id": throw new Error("unimplemented");
    case "undo": throw new Error("unimplemented");
  }
}