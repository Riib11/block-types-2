import { List } from "immutable";
import { Id, Syn } from "./Syntax";

export type Ctx = List<[{id: Id, t: Syn}]>;