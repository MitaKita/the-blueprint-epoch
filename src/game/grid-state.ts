import type {
  Building,
  CityGridState,
  GridCoordinate,
  GridProjection,
  GridTile,
  PlaceBuildingInput,
  ProductionStatus,
} from "./types"

export type CityGridAction =
  | { type: "placeBuilding"; payload: PlaceBuildingInput }
  | { type: "removeBuilding"; payload: { id: string } }
  | { type: "upgradeBuilding"; payload: { id: string } }
  | {
      type: "setProductionStatus"
      payload: { id: string; productionStatus: ProductionStatus }
    }
  | { type: "placeRoad"; payload: GridCoordinate }
  | { type: "removeRoad"; payload: GridCoordinate }

export const toTileKey = (x: number, y: number) => `${x},${y}`

export const createInitialCityGridState = (options?: {
  width?: number
  height?: number
  projection?: GridProjection
  roadAnchors?: GridCoordinate[]
}): CityGridState => {
  const width = options?.width ?? 24
  const height = options?.height ?? 24
  const projection = options?.projection ?? "orthogonal"
  const roadAnchors = options?.roadAnchors ?? [{ x: 0, y: 0 }]

  const tiles: Record<string, GridTile> = {}

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const tile: GridTile = {
        coordinates: { x, y },
        terrain: "land",
        buildingId: null,
        hasRoad: false,
        isRoadConnected: false,
      }
      tiles[toTileKey(x, y)] = tile
    }
  }

  return {
    projection,
    width,
    height,
    roadAnchors,
    tiles,
    buildings: {},
  }
}

const isWithinGrid = (state: CityGridState, coordinates: GridCoordinate) =>
  coordinates.x >= 0 &&
  coordinates.y >= 0 &&
  coordinates.x < state.width &&
  coordinates.y < state.height

const getNeighbors = (coordinates: GridCoordinate): GridCoordinate[] => [
  { x: coordinates.x + 1, y: coordinates.y },
  { x: coordinates.x - 1, y: coordinates.y },
  { x: coordinates.x, y: coordinates.y + 1 },
  { x: coordinates.x, y: coordinates.y - 1 },
]

const getFootprintCoordinates = (
  coordinates: GridCoordinate,
  size: { x: number; y: number },
): GridCoordinate[] => {
  const footprint: GridCoordinate[] = []

  for (let dy = 0; dy < size.y; dy += 1) {
    for (let dx = 0; dx < size.x; dx += 1) {
      footprint.push({ x: coordinates.x + dx, y: coordinates.y + dy })
    }
  }

  return footprint
}

const getFootprintBorderCoordinates = (
  coordinates: GridCoordinate,
  size: { x: number; y: number },
): GridCoordinate[] => {
  const border = new Map<string, GridCoordinate>()

  for (let dy = 0; dy < size.y; dy += 1) {
    for (let dx = 0; dx < size.x; dx += 1) {
      const tile = { x: coordinates.x + dx, y: coordinates.y + dy }
      for (const neighbor of getNeighbors(tile)) {
        const insideX =
          neighbor.x >= coordinates.x && neighbor.x < coordinates.x + size.x
        const insideY =
          neighbor.y >= coordinates.y && neighbor.y < coordinates.y + size.y

        if (!insideX || !insideY) {
          border.set(toTileKey(neighbor.x, neighbor.y), neighbor)
        }
      }
    }
  }

  return [...border.values()]
}

const recomputeRoadConnectivity = (
  tiles: Record<string, GridTile>,
  roadAnchors: GridCoordinate[],
): Record<string, GridTile> => {
  const nextTiles = Object.fromEntries(
    Object.entries(tiles).map(([key, tile]) => [
      key,
      { ...tile, isRoadConnected: false },
    ]),
  ) as Record<string, GridTile>

  const queue: GridCoordinate[] = []
  const visited = new Set<string>()

  const pushConnectedRoad = (coordinates: GridCoordinate) => {
    const key = toTileKey(coordinates.x, coordinates.y)
    const tile = nextTiles[key]

    if (!tile?.hasRoad || visited.has(key)) {
      return
    }

    visited.add(key)
    queue.push(coordinates)
    nextTiles[key] = { ...tile, isRoadConnected: true }
  }

  for (const anchor of roadAnchors) {
    pushConnectedRoad(anchor)

    for (const neighbor of getNeighbors(anchor)) {
      pushConnectedRoad(neighbor)
    }
  }

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) {
      break
    }

    for (const neighbor of getNeighbors(current)) {
      pushConnectedRoad(neighbor)
    }
  }

  return nextTiles
}

const getBuildingRoadConnection = (
  tiles: Record<string, GridTile>,
  building: Pick<Building, "coordinates" | "size">,
): boolean => {
  const borderTiles = getFootprintBorderCoordinates(
    building.coordinates,
    building.size,
  )

  return borderTiles.some((tile) => {
    const neighborTile = tiles[toTileKey(tile.x, tile.y)]
    return Boolean(neighborTile?.hasRoad && neighborTile.isRoadConnected)
  })
}

const recomputeBuildingConnections = (state: CityGridState): CityGridState => {
  const buildings: Record<string, Building> = {}

  for (const building of Object.values(state.buildings)) {
    buildings[building.id] = {
      ...building,
      hasRoadConnection: getBuildingRoadConnection(state.tiles, building),
    }
  }

  return {
    ...state,
    buildings,
  }
}

export const canPlaceBuilding = (
  state: CityGridState,
  input: PlaceBuildingInput,
): boolean => {
  const footprint = getFootprintCoordinates(input.coordinates, input.size)

  for (const coordinates of footprint) {
    if (!isWithinGrid(state, coordinates)) {
      return false
    }

    const tile = state.tiles[toTileKey(coordinates.x, coordinates.y)]
    if (!tile || tile.terrain !== "land" || tile.buildingId || tile.hasRoad) {
      return false
    }
  }

  const roadConnected = getBuildingRoadConnection(state.tiles, input)
  return roadConnected
}

const placeBuilding = (
  state: CityGridState,
  input: PlaceBuildingInput,
): CityGridState => {
  if (!canPlaceBuilding(state, input)) {
    return state
  }

  const building: Building = {
    id: input.id,
    type: input.type,
    size: input.size,
    level: input.level ?? 1,
    coordinates: input.coordinates,
    productionStatus: input.productionStatus ?? "idle",
    hasRoadConnection: getBuildingRoadConnection(state.tiles, input),
  }

  const nextTiles = { ...state.tiles }
  const footprint = getFootprintCoordinates(input.coordinates, input.size)

  for (const tileCoordinates of footprint) {
    const key = toTileKey(tileCoordinates.x, tileCoordinates.y)
    nextTiles[key] = {
      ...nextTiles[key],
      buildingId: input.id,
    }
  }

  return {
    ...state,
    tiles: nextTiles,
    buildings: {
      ...state.buildings,
      [input.id]: building,
    },
  }
}

const removeBuilding = (state: CityGridState, id: string): CityGridState => {
  const target = state.buildings[id]
  if (!target) {
    return state
  }

  const nextTiles = { ...state.tiles }

  for (const tileCoordinates of getFootprintCoordinates(
    target.coordinates,
    target.size,
  )) {
    const key = toTileKey(tileCoordinates.x, tileCoordinates.y)
    nextTiles[key] = {
      ...nextTiles[key],
      buildingId: null,
    }
  }

  const nextBuildings = { ...state.buildings }
  delete nextBuildings[id]

  return {
    ...state,
    tiles: nextTiles,
    buildings: nextBuildings,
  }
}

const setRoadState = (
  state: CityGridState,
  coordinates: GridCoordinate,
  hasRoad: boolean,
): CityGridState => {
  if (!isWithinGrid(state, coordinates)) {
    return state
  }

  const key = toTileKey(coordinates.x, coordinates.y)
  const tile = state.tiles[key]

  if (!tile || tile.buildingId) {
    return state
  }

  const tiles = recomputeRoadConnectivity(
    {
      ...state.tiles,
      [key]: {
        ...tile,
        hasRoad,
      },
    },
    state.roadAnchors,
  )

  return recomputeBuildingConnections({
    ...state,
    tiles,
  })
}

export const cityGridReducer = (
  state: CityGridState,
  action: CityGridAction,
): CityGridState => {
  switch (action.type) {
    case "placeBuilding":
      return placeBuilding(state, action.payload)
    case "removeBuilding":
      return removeBuilding(state, action.payload.id)
    case "upgradeBuilding": {
      const building = state.buildings[action.payload.id]
      if (!building) {
        return state
      }

      return {
        ...state,
        buildings: {
          ...state.buildings,
          [building.id]: {
            ...building,
            level: building.level + 1,
          },
        },
      }
    }
    case "setProductionStatus": {
      const building = state.buildings[action.payload.id]
      if (!building) {
        return state
      }

      return {
        ...state,
        buildings: {
          ...state.buildings,
          [building.id]: {
            ...building,
            productionStatus: action.payload.productionStatus,
          },
        },
      }
    }
    case "placeRoad":
      return setRoadState(state, action.payload, true)
    case "removeRoad":
      return setRoadState(state, action.payload, false)
    default:
      return state
  }
}
