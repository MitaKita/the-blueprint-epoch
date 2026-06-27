"use client";

import { useEffect } from "react";

import { useCityGrid } from "@/game/city-grid-context";

export function GridDemoSeeder() {
  const { state, dispatch } = useCityGrid();

  useEffect(() => {
    if (Object.keys(state.buildings).length > 0) {
      return;
    }

    dispatch({ type: "placeRoad", payload: { x: 1, y: 0 } });
    dispatch({ type: "placeRoad", payload: { x: 2, y: 0 } });
    dispatch({ type: "placeRoad", payload: { x: 3, y: 0 } });
    dispatch({ type: "placeRoad", payload: { x: 4, y: 0 } });
    dispatch({ type: "placeRoad", payload: { x: 5, y: 0 } });
    dispatch({ type: "placeRoad", payload: { x: 6, y: 0 } });
    dispatch({ type: "placeRoad", payload: { x: 6, y: 1 } });
    dispatch({ type: "placeRoad", payload: { x: 6, y: 2 } });
    dispatch({ type: "placeRoad", payload: { x: 3, y: 1 } });
    dispatch({ type: "placeRoad", payload: { x: 3, y: 2 } });
    dispatch({
      type: "placeBuilding",
      payload: {
        id: "creative-hub-1",
        type: "Creative Hub",
        size: { x: 2, y: 2 },
        coordinates: { x: 3, y: 3 },
        productionStatus: "producing",
      },
    });
    dispatch({
      type: "placeBuilding",
      payload: {
        id: "solar-array-1",
        type: "Solar Array",
        size: { x: 1, y: 1 },
        coordinates: { x: 6, y: 3 },
        productionStatus: "producing",
      },
    });
  }, [dispatch, state.buildings]);

  return null;
}
