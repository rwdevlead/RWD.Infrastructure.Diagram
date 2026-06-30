# Current Objective

Perform integration testing of the backend .NET API and the React frontend, and build/run the multi-stage Docker container.

# Current Status

All frontend CRUD pages (Hardware, VMs, Apps, Storage Pools, Network Shares, Networks, and Documents) are fully implemented. The interactive Cytoscape network diagram map is complete with drag layout auto-saving, filters, legend toggles, and property panels. The application builds cleanly with 0 TypeScript/compilation errors.

# Active Tasks

| Task | Status | Notes |
| :--- | :--- | :--- |
| Initialize `ai-context.md` | Complete | Set up long-term documentation and ADRs. |
| Create `ai-handoff.md` | Complete | Recording current operational state. |
| Migrate workspace to Antigravity standards | Complete | Created `.agents/AGENTS.md` to host project-scoped rules. |
| Implement Infrastructure persistence | Complete | EF Core DbContext, repository implementations, and SQLite config. |
| Implement Minimal API endpoints | Complete | All CRUD routes + search/export/import wired and building. |
| Scaffold React frontend | Complete | Routing, layout shell, API client, Zustand store, CSS design system. |
| Implement Hardware inventory page | Complete | Full CRUD with search, stats, add/edit/delete modals. |
| Implement Virtual Machines page | Complete | Host-association dropdown, resource totals, full CRUD. |
| Implement Services & Apps page | Complete | VM/host selectors, HTTPS toggle, URL display, full CRUD. |
| Implement Storage Pools page | Complete | Filesystem & RAID type dropdowns, usable TB total, full CRUD. |
| Implement Networks & VLANs page | Complete | CIDR subnet, VLAN badge, colour-swatch picker, full CRUD. |
| Implement Documentation Wiki page | Complete | Tree sidebar nav, ReactMarkdown renderer, hierarchy parent selector, full CRUD. |
| Implement Network Shares page | Complete | Standalone CRUD page with SMB/NFS protocol support and storage pool selectors. |
| Implement Cytoscape Network Diagram | Complete | Interactive node topology mapping showing all resource categories, dragging with coordinates auto-saved to backend. |
| Create root Makefile | Complete | Added orchestrator Makefile for easy debug sessions, frontend runs, and Docker commands. |

# Current Focus

End-to-end integration and run testing of the fully completed front-and-back applications.

# Recent Progress

- Installed `cytoscape` and its type packages `@types/react-cytoscapejs`.
- Implemented **NetworkShares.tsx**: standalone CRUD page supporting SMB/NFS/iSCSI protocol classifications, storage pool dropdown association, and statistics count cards.
- Integrated **Map.tsx**: interactive topology viewport using `react-cytoscapejs`. Shows all 6 resource node types (Hardware, VMs, Apps, Storage, Network Shares, Networks) using shape-and-colour coded layouts with custom icons. Dragging nodes updates coordinates in the SQLite database automatically. Contains fit, zoom, auto-layout (cose), hierarchical tree (breadthfirst), grid layout engines, filter-show buttons, and a detailed field-properties panel.
- Added Network Shares paths to `App.tsx` router and `Sidebar.tsx` navigation panel.
- Cleaned up compiler errors regarding unreferenced variables and types in `Map.tsx` and `Documents.tsx`.
- Created a root [Makefile](file:///Users/ka8kgj/Documents/Source/RWD.Infrastructure.Diagram/Makefile) with targets to start dotnet debug sessions, run react development apps, and execute docker container commands.

# Files Recently Modified

- **`Makefile`**: Added orchestrator script in the workspace root.
- **`src/Frontend/src/pages/NetworkShares.tsx`**: Standalone CRUD page.
- **`src/Frontend/src/pages/Map.tsx`**: Cytoscape JS network graph with preset and dynamic layout settings.
- **`src/Frontend/src/App.tsx`** / **`src/Frontend/src/components/Sidebar.tsx`**: Router pathing and link updates.

# Important Discoveries

- Custom layouts require saving layout objects as `preset` if coordinates have already been saved to the DB, which allows Cytoscape to render nodes precisely where they were dragged.

# Blockers

- None.

# Testing Status

- **Completed Tests**:
  - `npm run build` — 283 modules transformed, compiled into static bundle with 0 errors.
  - `dotnet build` — compiles cleanly with 0 errors.
- **Pending Tests**:
  - Drag-and-drop end-to-end integration testing with database.

# Commands and Procedures

Using the root [Makefile](file:///Users/ka8kgj/Documents/Source/RWD.Infrastructure.Diagram/Makefile):
```bash
# Start the .NET backend API
make run-backend

# Start the Vite React frontend
make run-frontend

# Build Docker containers
make docker-build

# Start containers in background
make docker-up

# Stop docker containers
make docker-down
```

# Next Actions

1. Fire up both servers and verify endpoint proxy operations.
2. Formulate Docker multi-stage configuration combining both builds into a unified container structure.
3. Hook up global `/api/inventory/search` query directly in top header layout.

# Risks

None.

# Questions Requiring Answers

- None.

# Recommended Starting Point for Next Session

- **What was completed**: All inventory pages, network shares, interactive Cytoscape map, and a root Makefile are complete.
- **What remains**: End-to-end running validation and Dockerization refinement.
- **Where to resume**: Local workspace run servers.
- **First recommended action**: Run `make run-backend` and `make run-frontend` to visually test the application's CRUD pipelines.
