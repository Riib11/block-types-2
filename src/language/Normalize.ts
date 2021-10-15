import { List } from "immutable";
import { Sem } from "./Semantics";
import { Syn } from "./Syntax";

export type Sub = List<Sem>;

export function normalize(T: Syn, t: Syn, sub: Sub = List()): Syn {
  // sub.first() is head
  // sub.shift() is tail
  throw new Error("unimplemented");
}