export type GridProjection = "orthogonal" | "isometric"

export type ProductionStatus = "idle" | "producing" | "ready" | "paused"

export type InventoryResourceType = "communityGoods" | "cleanEnergy"

export interface GridCoordinate {
  x: number
  y: number
}

export interface BuildingSize {
  x: number
  y: number
}

export interface BuildingProduction {
  resource: InventoryResourceType
  cycleSeconds: number
  secondsRemaining: number
  yieldAmount: number
}

export interface Building {
  id: string
  type: string
  size: BuildingSize
  level: number
  coordinates: GridCoordinate
  productionStatus: ProductionStatus
  production: BuildingProduction | null
  hasRoadConnection: boolean
}

export interface PlayerInventory {
  communityGoods: number
  cleanEnergy: number
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
  inventory: PlayerInventory
}

export interface PlaceBuildingInput {
  id: string
  type: string
  size: BuildingSize
  level?: number
  coordinates: GridCoordinate
  productionStatus?: ProductionStatus
}
