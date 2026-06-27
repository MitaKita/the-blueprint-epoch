"use client";

import { useGameTick } from "@/game/useGameTick";

export function GameTickController() {
  useGameTick();

  return null;
}