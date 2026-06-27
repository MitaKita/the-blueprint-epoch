"use client";

import { useMemo } from "react";

import { useCityGrid } from "@/game/city-grid-context";
import { toTileKey } from "@/game/grid-state";

const getConnectivityLabel = (hasRoadConnection: boolean) =>
  hasRoadConnection ? "Connected to Community Pathway" : "Disconnected";

const getConnectivityClassName = (hasRoadConnection: boolean) =>
  hasRoadConnection
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
    : "border-amber-500/30 bg-amber-500/10 text-amber-700";

export function GameGrid() {
  const { state } = useCityGrid();

  const tiles = useMemo(
    () =>
      Object.values(state.tiles).sort((left, right) => {
        if (left.coordinates.y !== right.coordinates.y) {
          return left.coordinates.y - right.coordinates.y;
        }

        return left.coordinates.x - right.coordinates.x;
      }),
    [state.tiles],
  );

  return (
    <section className="w-full max-w-6xl rounded-[2rem] border border-black/10 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur dark:border-white/10 dark:bg-zinc-950/80">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700/80 dark:text-emerald-400/80">
            City Grid
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {state.projection === "isometric"
              ? "Isometric planning surface"
              : "Orthogonal planning surface"}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <span className="rounded-full border border-black/10 bg-zinc-100 px-3 py-1 dark:border-white/10 dark:bg-white/5">
            {state.width} x {state.height}
          </span>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-300">
            Community Pathway required
          </span>
        </div>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-zinc-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
            Community Goods
          </p>
          <p className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            {state.inventory.communityGoods}
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-zinc-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
            Clean Energy
          </p>
          <p className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            {state.inventory.cleanEnergy}
          </p>
        </div>
      </div>

      <div
        className="grid gap-2 overflow-auto rounded-[1.5rem] border border-black/5 bg-zinc-50 p-4 dark:border-white/5 dark:bg-white/[0.03]"
        style={{
          gridTemplateColumns: `repeat(${state.width}, minmax(3.5rem, 1fr))`,
        }}
      >
        {tiles.map((tile) => {
          const tileKey = toTileKey(tile.coordinates.x, tile.coordinates.y);
          const building = tile.buildingId ? state.buildings[tile.buildingId] : null;

          return (
            <div
              key={tileKey}
              className="relative flex min-h-24 flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-3 text-left shadow-sm transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-950"
              data-road={tile.hasRoad ? "true" : "false"}
              data-building={building ? "true" : "false"}
            >
              <div className="flex items-start justify-between gap-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                <span>
                  {tile.coordinates.x}, {tile.coordinates.y}
                </span>
                {tile.hasRoad ? (
                  <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-sky-700 dark:text-sky-300">
                    Pathway
                  </span>
                ) : null}
              </div>

              {building ? (
                <div className="mt-3 space-y-2">
                  <div>
                    <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                      {building.type}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Level {building.level} · {building.size.x}x{building.size.y}
                    </p>
                  </div>
                  <div
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getConnectivityClassName(
                      building.hasRoadConnection,
                    )}`}
                  >
                    {getConnectivityLabel(building.hasRoadConnection)}
                  </div>
                  <p className="text-xs leading-5 text-zinc-600 dark:text-zinc-300">
                    Production: {building.productionStatus}
                  </p>
                  {building.production ? (
                    <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                      {building.production.secondsRemaining}s until +
                      {building.production.yieldAmount} {building.production.resource}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="mt-3 flex flex-1 items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 text-xs text-zinc-400 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-500">
                  Empty tile
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}