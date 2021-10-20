import { Code } from "./Code";
import { Fix } from "./Fix";
import { Hix } from "./Syntax";

export type Mutation
  // substitutes the hole `hix` with code `c`
  = {readonly case: "substitute", hix: Hix, c: Code}
  // replaces code `c0` with code `c1`, requiring that `c0` has fixity at most `fix`
  | {readonly case: "replace", c0: Code, c1: Code, fix: Fix}