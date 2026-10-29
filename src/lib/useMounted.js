"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// True once the client has hydrated. Used to render a simple, SSR-safe
// layout on first paint and swap in client-only animation after mount,
// without calling setState inside an effect.
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
