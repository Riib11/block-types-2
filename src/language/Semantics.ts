import { Syn, Var } from "./Syntax";

// TODO
export type Sem
  = Syn
  | {readonly case: "arr", arr: (t: Sem) => Sem}
  | {readonly case: "spi", var: Var, dom: Sem, cod: (a: Sem) => Sem}