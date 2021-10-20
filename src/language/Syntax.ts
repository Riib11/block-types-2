import { List } from "immutable";
import { Lvl } from "./Level";

// syntactic domain
export type Syn
  = {readonly case: "uni", lvl: Lvl}
  | {readonly case: "pie", var: Var, dom: Syn, cod: Syn}
  | {readonly case: "lam", var: Var, dom: Syn, bod: Syn}
  | {readonly case: "neu", var: Var, args: List<Syn>}
  | {readonly case: "let", var: Var, sig: Syn, imp: Syn, bod: Syn}
  | {readonly case: "hol", sig: Syn}

// normalized syntactic domain (does not preserve metadata)
export type Nrm
  = {readonly case: "uni", lvl: Lvl}
  | {readonly case: "pie", var: Var, dom: Nrm, cod: Nrm}
  | {readonly case: "lam", var: Var, dom: Nrm, bod: Nrm}
  | {readonly case: "neu", var: Var, args: List<Nrm>}
  | {readonly case: "hol", sig: Nrm}

export type Var = {id: Id, dbl: Dbl}
export type Id = {value: string}
export type Dbl = number