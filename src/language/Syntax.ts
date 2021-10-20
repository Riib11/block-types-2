import { List } from "immutable";
import { Hix } from "./Hix";
import { Lvl } from "./Level";
import { dummyMeta, Meta } from "./Meta";

// syntactic domain
export type Syn
  = {readonly case: "uni", lvl: Lvl, meta: Meta}
  | {readonly case: "pie", var: Var, dom: Syn, cod: Syn, meta: Meta}
  | {readonly case: "lam", var: Var, dom: Syn, bod: Syn, meta: Meta}
  | {readonly case: "neu", var: Var, args: List<Syn>, meta: Meta}
  | {readonly case: "let", var: Var, sig: Syn, imp: Syn, bod: Syn, meta: Meta}
  | {readonly case: "hol", hix: Hix, sig: Syn, meta: Meta}
  
// normalized syntactic domain (does not preserve metadata)
export type Nrm
  = {readonly case: "uni", lvl: Lvl}
  | {readonly case: "pie", var: Var, dom: Nrm, cod: Nrm}
  | {readonly case: "lam", var: Var, dom: Nrm, bod: Nrm}
  | {readonly case: "neu", var: Var, args: List<Nrm>}
  | {readonly case: "hol", hix: Hix, sig: Nrm}

export type Var = {id: Id, dbl: Dbl}
export type Id = {value: string}
export type Dbl = number

export function freshVar(dbl: Dbl): Var {
  return {id: {value: "x"}, dbl};
}

export function toSyn(t: Nrm): Syn {
  switch (t.case) {
    case "uni": return {case: "uni", lvl: t.lvl, meta: dummyMeta}
    case "pie": return {case: "pie", var: t.var, dom: toSyn(t.dom), cod: toSyn(t.cod), meta: dummyMeta}
    case "lam": return {case: "lam", var: t.var, dom: toSyn(t.dom), bod: toSyn(t.bod), meta: dummyMeta}
    case "neu": return {case: "neu", var: t.var, args: t.args.map(arg => toSyn(arg)), meta: dummyMeta}
    case "hol": return {case: "hol", hix: t.hix, sig: toSyn(t.sig), meta: dummyMeta};
  }
}
