import { Hix } from "../language/Hix";
import { Mutation } from "../language/Mutation";
import { Id } from "../language/Syntax";

export type Transition
  // mutation
  = {readonly case: "mutate", mut: Mutation}
  // buffers
  | {readonly case: "create buffer", buffer: Buffer}
  | {readonly case: "delete buffer", buffer: Buffer}
  | {readonly case: "submit buffer", buffer: Buffer, hix: Hix}
  // meta
  | {readonly case: "rename id", id: Id, value: string}
  | {readonly case: "undo"}
;