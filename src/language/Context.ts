import { List } from "immutable";
import { Id, Nrm } from "./Syntax";

export type Ctx = List<{id: Id, t: Nrm}>;