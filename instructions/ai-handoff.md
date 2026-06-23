# Current Objective

Scaffold the React (Vite) frontend — routing, layout shell, API client, and first inventory pages.

# Current Status

Backend is complete and compiling. All three .NET projects build with 0 errors. SQLite persistence, EF migrations, and Minimal API endpoints are fully wired. GEMINI.md has been deleted; all context now lives in `ai-context.md`, `ai-handoff.md`, and `.agents/AGENTS.md`.

# Active Tasks

| Task | Status | Notes |
| :--- | :--- | :--- |
| Initialize `ai-context.md` | Complete | Set up long-term documentation and ADRs. |
| Create `ai-handoff.md` | Complete | Recording current operational state. |
| Migrate workspace to Antigravity standards | Complete | Created `.agents/AGENTS.md` to host project-scoped rules. |
| Implement Infrastructure persistence | Complete | EF Core DbContext, repository implementations, and SQLite config. |
| Implement Minimal API endpoints | Complete | All CRUD routes + search/export/import wired and building. |
| Scaffold React frontend | Not Started | Build out React TSX layout, pages, and graph component. |

# Current Focus

Minimal API endpoints complete. Next: React frontend scaffolding.

# Recent Progress

- Initial Clean Architecture solution structure created.
- Ported frontend dependencies from Svelte to React (Vite) in package.json.
- Configured docker-compose and dockerfile.
- Initialized core domain entity definitions and interfaces.
- Implemented EF Core database context, UnitOfWork, and generic EF Repository pattern.
- Resolved sqlite directory checks and registered startup migrations in Program.cs.
- Successfully generated and verified the InitialCreate migrations using dotnet-ef.
- Scaffolded all Minimal API endpoint groups: Hardware, VMs, Apps, Storage, NetworkShares, Networks, NetworkMembers, Documents, Map (layout upsert + relationships), and Inventory (search, export, import).
- Created full DTO layer (request/response records + ApiResponse envelope).
- Added CORS policy for Vite dev server (ports 5173/3000).

# Files Recently Modified

- **`src/Backend/RWD.Infrastructure.Diagram.Api/Dtos/Dtos.cs`**: All request/response DTOs and ApiResponse envelope.
- **`src/Backend/RWD.Infrastructure.Diagram.Api/Endpoints/HardwareEndpoints.cs`**: CRUD at `/api/hardware`.
- **`src/Backend/RWD.Infrastructure.Diagram.Api/Endpoints/VirtualMachineEndpoints.cs`**: CRUD at `/api/vms`.
- **`src/Backend/RWD.Infrastructure.Diagram.Api/Endpoints/AppEndpoints.cs`**: CRUD at `/api/apps`.
- **`src/Backend/RWD.Infrastructure.Diagram.Api/Endpoints/StorageEndpoints.cs`**: CRUD at `/api/storage`.
- **`src/Backend/RWD.Infrastructure.Diagram.Api/Endpoints/NetworkEndpoints.cs`**: CRUD at `/api/networks` and `/api/network-members`.
- **`src/Backend/RWD.Infrastructure.Diagram.Api/Endpoints/NetworkShareEndpoints.cs`**: CRUD at `/api/shares`.
- **`src/Backend/RWD.Infrastructure.Diagram.Api/Endpoints/DocumentEndpoints.cs`**: CRUD at `/api/documents`.
- **`src/Backend/RWD.Infrastructure.Diagram.Api/Endpoints/MapEndpoints.cs`**: Upsert layout + relationships at `/api/map`.
- **`src/Backend/RWD.Infrastructure.Diagram.Api/Endpoints/InventoryEndpoints.cs`**: Search, export, import at `/api/inventory`.
- **`src/Backend/RWD.Infrastructure.Diagram.Api/Program.cs`**: All groups wired, CORS added.

# Important Discoveries

- The frontend template in `src/Frontend/src` is currently empty but dependencies (`react`, `react-router-dom`, `react-cytoscapejs`, `react-markdown`, `zustand`, `axios`) are already defined in `package.json`.

# Blockers

None.

# Testing Status

- **Completed Tests**: All three backend projects build successfully (`dotnet build`). Database schema migration generated and validated.
- **Pending Tests**: API integration tests via Swagger UI once running.

# Commands and Procedures

```bash
dotnet build
/Users/ka8kgj/.dotnet/tools/dotnet-ef migrations add InitialCreate --project src/Backend/RWD.Infrastructure.Diagram.Infrastructure/RWD.Infrastructure.Diagram.Infrastructure.csproj --startup-project src/Backend/RWD.Infrastructure.Diagram.Api/RWD.Infrastructure.Diagram.Api.csproj
```

# Next Actions

1. Scaffold the React (Vite) frontend structure: routing, layout shell, and page stubs.
2. Implement API client (`src/api/client.ts`) using Axios.
3. Build the Hardware inventory page as the first functional feature.

# Risks

- SQLite concurrency under load (scoped DI keeps connections short-lived — low risk for homelab use).
- Cytoscape React wrapper compatibility with React 18 — to be validated during network map component work.

# Questions Requiring Answers

- None.

# Recommended Starting Point for Next Session

- **What was completed**: All Minimal API CRUD endpoints, DTO layer, inventory search/export/import, and CORS are fully wired and compiling.
- **What remains**: React frontend — project structure, routing, API client, and first pages.
- **Where to resume**: `src/Frontend/src/` — currently empty.
- **First recommended action**: Scaffold `main.tsx`, `App.tsx`, the layout shell, and the Axios API client.
