import { Fix } from "./Fix";
import { Hix } from "./Hix";
import { replace } from "./Replacement";
import { Sub, substitute } from "./Substitution";
import { Syn } from "./Syntax";

export type Mutation
  // substitutes the hole `hix` with code `c`
  = {readonly case: "substitute", hix: Hix, t: Syn}
  // replaces code `c0` with code `c1`, requiring that `c0` has fixity at most `fix`
  | {readonly case: "replace", s: Syn, t: Syn, fix: Fix}

export function mutate(t: Syn, mut: Mutation): Syn {
  switch (mut.case) {
    case "substitute": return substitute(Sub().set(mut.hix, mut.t), t)
    case "replace": return replace(mut.s, mut.t, t);
  }
}