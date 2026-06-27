"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type PropsWithChildren,
} from "react";

import {
  canPlaceBuilding,
  cityGridReducer,
  createInitialCityGridState,
  type CityGridAction,
} from "./grid-state";
import type { CityGridState, GridProjection, PlaceBuildingInput } from "./types";

interface CityGridContextValue {
  state: CityGridState;
  dispatch: Dispatch<CityGridAction>;
  canPlaceBuilding: (input: PlaceBuildingInput) => boolean;
}

const CityGridContext = createContext<CityGridContextValue | null>(null);

export interface CityGridProviderProps {
  width?: number;
  height?: number;
  projection?: GridProjection;
}

export const CityGridProvider = ({
  children,
  width,
  height,
  projection,
}: PropsWithChildren<CityGridProviderProps>) => {
  const [state, dispatch] = useReducer(
    cityGridReducer,
    createInitialCityGridState({ width, height, projection }),
  );

  const value = useMemo<CityGridContextValue>(
    () => ({
      state,
      dispatch,
      canPlaceBuilding: (input) => canPlaceBuilding(state, input),
    }),
    [state],
  );

  return (
    <CityGridContext.Provider value={value}>{children}</CityGridContext.Provider>
  );
};

export const useCityGrid = (): CityGridContextValue => {
  const context = useContext(CityGridContext);

  if (!context) {
    throw new Error("useCityGrid must be used within a CityGridProvider");
  }

  return context;
};
