import { GameGrid } from "@/game/GameGrid";
import { GameTickController } from "@/game/GameTickController";
import { GridDemoSeeder } from "@/game/GridDemoSeeder";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-8 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_36%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-8 text-zinc-950 dark:bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_36%),linear-gradient(180deg,_#020617_0%,_#09090b_100%)] dark:text-zinc-50 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-4 rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur dark:border-white/10 dark:bg-zinc-950/70 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700/80 dark:text-emerald-400/80">
          The Blueprint Epoch
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Plan buildings on a living city grid.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-lg">
              Community Pathways keep structures active. Buildings show a clear
              connection state so you can see whether they are powered by the
              road network or isolated from it.
            </p>
          </div>
          <div className="grid gap-2 text-sm text-zinc-600 dark:text-zinc-300 sm:grid-cols-2 lg:max-w-xl">
            <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                Projection
              </p>
              <p className="mt-1 font-medium text-zinc-950 dark:text-zinc-50">
                Isometric-friendly layout
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                Connectivity
              </p>
              <p className="mt-1 font-medium text-zinc-950 dark:text-zinc-50">
                Road-adjacent buildings stay online
              </p>
            </div>
          </div>
        </div>
      </section>

      <GridDemoSeeder />
      <GameTickController />
      <div className="mx-auto w-full max-w-6xl">
        <GameGrid />
      </div>
    </main>
  );
}