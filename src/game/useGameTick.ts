"use client"

import { useEffect } from "react"

import { useCityGrid } from "@/game/city-grid-context"

export function useGameTick(enabled = true) {
  const { dispatch } = useCityGrid()

  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      dispatch({ type: "advanceTick" })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [dispatch, enabled])
}
