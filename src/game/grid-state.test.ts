import { describe, expect, it } from "vitest"

import {
  canPlaceBuilding,
  cityGridReducer,
  createInitialCityGridState,
} from "./grid-state"

describe("city grid road connectivity", () => {
  it("requires road connectivity for building placement", () => {
    let state = createInitialCityGridState({ width: 8, height: 8 })

    const disconnectedPlacement = canPlaceBuilding(state, {
      id: "building-1",
      type: "creative-hub",
      size: { x: 2, y: 2 },
      coordinates: { x: 3, y: 3 },
    })

    expect(disconnectedPlacement).toBe(false)

    state = cityGridReducer(state, {
      type: "placeRoad",
      payload: { x: 1, y: 0 },
    })
    state = cityGridReducer(state, {
      type: "placeRoad",
      payload: { x: 2, y: 0 },
    })
    state = cityGridReducer(state, {
      type: "placeRoad",
      payload: { x: 3, y: 0 },
    })
    state = cityGridReducer(state, {
      type: "placeRoad",
      payload: { x: 3, y: 1 },
    })
    state = cityGridReducer(state, {
      type: "placeRoad",
      payload: { x: 3, y: 2 },
    })

    const connectedPlacement = canPlaceBuilding(state, {
      id: "building-2",
      type: "creative-hub",
      size: { x: 2, y: 2 },
      coordinates: { x: 3, y: 3 },
    })

    expect(connectedPlacement).toBe(true)
  })

  it("updates building connectivity when roads are removed", () => {
    let state = createInitialCityGridState({ width: 8, height: 8 })

    state = cityGridReducer(state, {
      type: "placeRoad",
      payload: { x: 1, y: 0 },
    })
    state = cityGridReducer(state, {
      type: "placeRoad",
      payload: { x: 2, y: 0 },
    })
    state = cityGridReducer(state, {
      type: "placeRoad",
      payload: { x: 2, y: 1 },
    })

    state = cityGridReducer(state, {
      type: "placeBuilding",
      payload: {
        id: "building-3",
        type: "solar-array",
        size: { x: 1, y: 1 },
        coordinates: { x: 2, y: 2 },
      },
    })

    expect(state.buildings["building-3"]?.hasRoadConnection).toBe(true)

    state = cityGridReducer(state, {
      type: "removeRoad",
      payload: { x: 1, y: 0 },
    })

    expect(state.buildings["building-3"]?.hasRoadConnection).toBe(false)
  })
})
