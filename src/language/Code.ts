import { Lvl } from "./Level";
import { Meta } from "./Meta";
import { Var } from "./Syntax";

// code domain
export type Code
  = {readonly case: "uni", lvl: Lvl, meta: Meta}
  | {readonly case: "pie", var: Var, dom: Code, cod: Code, meta: Meta}
  | {readonly case: "lam", var: Var, dom: Code, bod: Code, meta: Meta}
  | {readonly case: "neu", var: Var, args: Code[], meta: Meta}
  | {readonly case: "let", var: Var, sig: Code, imp: Code, bod: Code, meta: Meta}
  | {readonly case: "hol", sig: Code, meta: Meta}