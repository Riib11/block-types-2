import { List } from "immutable"

// TODO
export type Syn
  = {readonly case: "uni", level: Level}
  | {readonly case: "hol", goal: SynNrm}
  | {readonly case: "neu", id: Id, args: List<Syn>}
;

// TODO
export type SynNrm
  = {readonly case: "uni", level: Level}
  | {readonly case: "hol", goal: SynNrm}
  | {readonly case: "neu", id: Id, args: List<Syn>}
;

export type Id = {label: string};

export type Level = number | "omega";