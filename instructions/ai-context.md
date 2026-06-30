# Project Overview

- **Name**: RWD.Infrastructure.Diagram (formerly Homelab Hub / RWD.Toolbox.Network.Draw)
- **Purpose**: A lightweight, self-hosted infrastructure documentation and visualization tool.
- **Goals**:
  - React frontend (Vite).
  - .NET 10 Minimal API backend.
  - SQLite persistence.
  - Docker-first deployment.
- **Architecture Summary**: Clean Architecture with DDD-lite patterns, utilizing the Repository Pattern and REST APIs, delivered via a single Docker image containing both frontend and backend.
- **Current Status**: Backend is complete. React Vite frontend is complete with all primary inventory CRUD pages (Hardware, Virtual Machines, Services/Apps, Storage Pools, Network Shares, Networks/VLANs, and Documentation Wiki) and the interactive Cytoscape network diagram fully implemented. All projects build with 0 errors.

# Technical Stack

- **Languages**: C# (.NET 10), TypeScript, HTML, CSS (Vanilla CSS preferred for design flexibility).
- **Frameworks**: .NET Minimal API, Entity Framework Core (EF Core) with SQLite provider, React (Vite), React Router Dom, Zustand for state management, Axios.
- **Infrastructure**: Docker, Docker Compose, SQLite Database.
- **External Services**: None. Fully self-contained.

# Repositories

- **Repository Inventory**:
  - `src/Backend/RWD.Infrastructure.Diagram.Core`: Domain models (Entities/BaseEntity, Hardware, VirtualMachine, App, Storage, Network, NetworkMember, NetworkShare, Relationship, MapLayout, Document) and abstraction interfaces (Interfaces/IRepository, IUnitOfWork).
  - `src/Backend/RWD.Infrastructure.Diagram.Infrastructure`: Data access implementations, DbContext, and EF migrations.
  - `src/Backend/RWD.Infrastructure.Diagram.Api`: Minimal API setup, Endpoint definitions, Swagger UI configuration, and Application Program.cs entry point.
  - `src/Frontend`: React client-side application.
- **Branch Strategy**: Main-branch direct deployments (typical homelab-targeted scope).
- **Build and Deployment**: Multi-stage `Dockerfile` compiling the React frontend via Node and copying static assets to the .NET deployment directory or serving them via the ASP.NET pipeline.

# Architecture Decision Records (ADR)

## ADR-001: Backend Stack Migration to .NET 10 Minimal API
- **Date**: 2026-06-22
- **Decision**: Port Flask (Python) to .NET 10 Minimal API with Entity Framework Core.
- **Reasoning**: Delivers improved type safety, performance, self-documentation, and a standard Clean Architecture framework.
- **Alternatives**: Node.js/Express, keeping Flask/SQLAlchemy.
- **Consequences**: Rewrite of all schemas, route handlers, and models to C#; requires EF Core migrations setup.

## ADR-002: Frontend Framework Migration to React (Vite)
- **Date**: 2026-06-22
- **Decision**: Port Svelte (Vite) to React (Vite) with Vanilla CSS.
- **Reasoning**: React features a wider ecosystem of robust libraries for graph visualizations (e.g. `react-cytoscapejs`) and rich-text editing.
- **Alternatives**: Maintain Svelte, migration to Vue.
- **Consequences**: Rewriting UI files as React TSX components; replacement of Svelte stores with Zustand.

# Domain Knowledge

- **Hardware**: Physical hosts/servers specs, locations, and IPs.
- **Virtual Machines**: Virtualized OS instances running on a specific hardware host.
- **Applications/Services (Apps)**: Individual apps/services running on hardware or VMs, optionally exposed on a specific port/URL.
- **Storage**: Storage pools/drives associated with hardware or VMs.
- **Network Shares**: Shared folders (SMB/NFS) hosted on Storage pools.
- **Networks**: Subnets, VLANs, Gateways, colors for visualization.
- **Network Members**: Link entities to Networks with designated IPs on those networks.
- **Map Layout**: Position coordinates for entities on the network map visualization.
- **Relationships**: Custom connection/dependencies between entities.
- **Documents**: Hierarchical Markdown documentation pages.

# Data Models

Entities inherit from `BaseEntity` (Id, CreatedAt, UpdatedAt):
- **Hardware**: Name, Hostname, IpAddress, MacAddress, Cpu, RamGb, Os, Make, Model, VirtualMachines, Apps, Storages.
- **VirtualMachine**: HardwareId (FK), Name, Hostname, IpAddress, Os, CpuCores, RamGb, DiskGb, Apps, Storages.
- **App**: HardwareId (FK, optional), VmId (FK, optional), Name, Description, IpAddress, Port, Https.
- **Storage**: HardwareId (FK, optional), VmId (FK, optional), Name, StorageType, RaidType, UsableSpaceTb, Shares.
- **NetworkShare**: StorageId (FK), Name, ShareType, Hostname, Ip.
- **Network**: Name, VlanId, Subnet, Gateway, Color.
- **NetworkMember**: NetworkId (FK), MemberType, MemberId, IpOnNetwork.
- **Relationship**: FromEntityId, FromEntityType, ToEntityId, ToEntityType, RelationshipType.
- **MapLayout**: EntityId, EntityType, X, Y, IsPinned.
- **Document**: ParentId (FK, self-referential nullable), Title, Content, SortOrder.

# APIs

All endpoints return unified wrappers `{"data": ...}` or `{"error": ...}` to maintain frontend parity.
- System check: `GET /health`
- Inventory export/import: `GET /api/inventory/export`, `POST /api/inventory/import`
- Inventory search: `GET /api/inventory/search?q=...`
- Resource groups: `/api/hardware`, `/api/vms`, `/api/apps`, `/api/storage`, `/api/shares`, `/api/networks`, `/api/network-members`, `/api/documents`
- Map details: `/api/map/layout`, `/api/map/relationships`

# Infrastructure

- SQLite DB location: `/data/homelab-hub.db` or customized via environment variable `DATABASE_URL`.
- Development is configured through `launchSettings.json` and `.editorconfig`.
- Production runtime is defined in the workspace `Dockerfile`.
- A root [Makefile](file:///Users/ka8kgj/Documents/Source/RWD.Infrastructure.Diagram/Makefile) is provided to orchestrate dotnet backend runs, React frontend execution, and Docker/docker-compose commands.

# Development Standards

- **Clean Architecture / DDD-lite**: Core is independent of external dependencies; Infrastructure contains DB/EF context; API maps HTTP requests to core/domain actions.
- **Repository Pattern**: Abstracted database access using generic and specific interfaces.
- **Documentation**: All public members must have XML summary documentation (`/// <summary>`).
- **Design Guidelines**: Follow the `instructions/documentation-policy.md` and keep visual aesthetics rich, clean, and in dark-mode by default.

# Known Issues

- None tracked at present.

# Lessons Learned

- **TypeScript Config**: Ensure `tsconfig.json` and `tsconfig.node.json` are present in custom Vite-scaffolded directories so compilation commands (`tsc`) execute properly.
- **Cytoscape Typings**: Set return type of cytoscape stylesheet configuration to `any[]` or `cytoscape.StylesheetStyle[]` to ensure clean compilation when using custom selectors.

# Open Questions

- None.

# Change Log

- **2026-06-22**: Ported solution setup to .NET 10, configured Docker, created Clean Architecture project structures, and defined domain models and repositories.
- **2026-06-22**: Implemented EF Core SQLite persistence including AppDbContext, generic Repository, and UnitOfWork in Infrastructure. Set up a design-time migrations factory, added SQLite directory validation and startup migrations in Api project, and generated the InitialCreate database migration.
- **2026-06-29**: Scaffolded the React (Vite) frontend: routing, layout shell with responsive SVG sidebar, Axios API client (proxied to backend), Zustand state store, global Vanilla CSS dark-theme design system, Hardware CRUD page, and Settings JSON backup/restore page. Build verified clean.
- **2026-06-29**: Implemented all remaining core inventory CRUD pages: Virtual Machines (host dropdown), Services/Apps (HTTPS toggle, URL links), Storage Pools (filesystem/RAID dropdowns), Networks/VLANs (colour swatch picker, CIDR), and Documentation Wiki (hierarchical tree, ReactMarkdown renderer). CSS updated with dark select styles and full markdown typography. Build verified: 274 modules, 0 errors.
- **2026-06-29**: Implemented the Network Shares standalone CRUD inventory page (SMB/NFS protocol support) and wired its route and sidebar links. Implemented the interactive network topology map using Cytoscape.js, featuring draggable and auto-saved node layouts, multiple layout configurations, legendary filters, zoom controls, and a node properties details pane. Verified build builds cleanly with 0 compilation errors.
- **2026-06-29**: Added a root [Makefile](file:///Users/ka8kgj/Documents/Source/RWD.Infrastructure.Diagram/Makefile) to support dotnet development runs, react dev client execution, and Docker container orchestration.
