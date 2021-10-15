import { List } from "immutable";
import { Id, Syn } from "./Syntax";

export type Context = List<[{readonly id: Id, readonly t: Syn}]>;