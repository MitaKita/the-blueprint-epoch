export type GridProjection = "orthogonal" | "isometric"

export type ProductionStatus = "idle" | "producing" | "ready" | "paused"

export interface GridCoordinate {
  x: number
  y: number
}

export interface BuildingSize {
  x: number
  y: number
}

export interface Building {
  id: string
  type: string
  size: BuildingSize
  level: number
  coordinates: GridCoordinate
  productionStatus: ProductionStatus
  hasRoadConnection: boolean
}

export interface GridTile {
  coordinates: GridCoordinate
  terrain: "land" | "water" | "blocked"
  buildingId: string | null
  hasRoad: boolean
  isRoadConnected: boolean
}

export interface CityGridState {
  projection: GridProjection
  width: number
  height: number
  roadAnchors: GridCoordinate[]
  tiles: Record<string, GridTile>
  buildings: Record<string, Building>
}

export interface PlaceBuildingInput {
  id: string
  type: string
  size: BuildingSize
  level?: number
  coordinates: GridCoordinate
  productionStatus?: ProductionStatus
}
