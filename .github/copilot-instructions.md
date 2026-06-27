# Global Workspace Instructions: The Blueprint Epoch

## Tech Stack Rules
* Framework: Next.js (App Router), React, TypeScript.
* State Management: Client-side state for local city grids, using React Context or a lightweight state machine.
* Styling: Tailored UI component design (e.g., Tailwind CSS) keeping a minimalist, uplifting, clean aesthetic.

## Game Concept & Backstory
You are building an Elvenar-style city management and world-transformation game. 
* Core Lore: The population has experienced a sudden mass transformation of consciousness. Humanity now acts solely out of excitement to the best of their ability, with absolutely zero expectation on outcomes. Everyone works together seamlessly to serve one another and elevate the physical planet.
* Gameplay Loop: Instead of combat or resource extraction that depletes the map, players upgrade existing structures, coordinate cooperative resource sharing, and expand community grids to turn the current world into a thriving, eco-friendly, optimized paradise.

## Mechanical Conventions (Elvenar-Inspired)
1. **Grid Placement System:** Components or items represent buildings/projects. They require a connected road network to function (e.g., "Community Pathways" instead of standard roads).
2. **Production Chains:** Production buildings generate community goods based on excitement/service (e.g., Solar Arrays, Community Kitchens, Creative Hubs). 
3. **No Coercion/Friction Mechanics:** Production loops do not punish players. Progression is fueled by expanding cooperation networks and maximizing local joy/efficiency.
4. **Architectural Code Style:** Keep components highly modular. Use clean TypeScript types for coordinate mapping `[x, y]`, grid dimensions, building states, and ticks for production times.