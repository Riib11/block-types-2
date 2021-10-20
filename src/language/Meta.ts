import { Fix } from "./Fix"

// metadata
export type Meta = {
  fix: Fix
}

// empty metadata
export const emptyMeta = (): Meta => ({
  fix: "free"
})