import { List } from "immutable"
import { Transition } from "../state/Transition"
import { Fix } from "./Fix"

// metadata
export type Meta = {
  fix: Fix,
  transitions: List<Transition>
}

export const dummyMeta = undefined as unknown as Meta;
