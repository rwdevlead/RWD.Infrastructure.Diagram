# Migration Plan: Homelab Hub Refactor

This document outlines the strategy for refactoring the original project from its current Svelte/Flask stack to a React/.NET stack.

## 1. Architecture Translation

| Component                 | Current Stack (Source)  | New Stack (Target)                   |
| :------------------------ | :---------------------- | :----------------------------------- |
| **Frontend Framework**    | Svelte (Vite)           | **React (Vite)**                     |
| **Backend Framework**     | Flask (Python)          | **.NET Minimal API (C#)**            |
| **ORM / Database Access** | SQLAlchemy              | **Entity Framework Core (EF Core)**  |
| **Database**              | SQLite                  | **SQLite**                           |
| **Routing (Frontend)**    | `svelte-spa-router`     | `react-router-dom`                   |
| **State Management**      | Svelte Stores           | **React Context API** or **Zustand** |
| **API Client**            | Custom `fetch` wrapper  | `axios` or `fetch` with Hooks        |
| **Network Visualization** | `cytoscape`             | `react-cytoscapejs`                  |
| **Markdown Editor**       | `bytemd`                | `react-markdown` or `Milkdown`       |
| **Migrations**            | Alembic                 | **EF Core Migrations**               |
| **Deployment**            | Docker / Docker Compose | **Docker / Docker Compose**          |

## 2. Equivalent Patterns

### Backend: Flask Blueprints vs. .NET Minimal API

The current project uses Blueprints to organize routes (e.g., `/api/hardware`, `/api/vms`).

- **Translation**: Use `app.MapGroup("/api/vms")` in .NET to create logical route groups. The "CRUD Factory" pattern in Flask can be replicated using generic Repository patterns or extension methods on `IEndpointRouteBuilder`.

### Models: SQLAlchemy vs. EF Core

Current models use `BaseMixin` for common fields like `created_at` and `updated_at`.

- **Translation**: Create a `BaseEntity` class in C# and use EF Core's `OnModelCreating` or `SaveChanges` overrides to automatically update timestamps.

### Frontend: Svelte Stores vs. React State

Svelte stores are globally accessible and reactive.

- **Translation**: Use **Zustand** for a similarly lightweight and simple global state, or **React Context** for dependency injection of state throughout the component tree.

## 3. Implementation Steps

1.  **Backend Core**:
    - Initialize .NET Web API project.
    - Define Entities (POCOs) matching the current SQLite schema.
    - Configure `DbContext` for SQLite.
    - Implement EF Core Migrations to ensure schema parity.
2.  **API Migration**:
    - Port the `CRUD Factory` logic to a generic Minimal API implementation.
    - Implement specialized routes (Inventory search, Map layout, Import/Export).
3.  **Frontend Core**:
    - Initialize React + Vite project.
    - Set up `react-router-dom` for navigation.
    - Port the `api.js` client to a React-friendly hook or Axios instance.
4.  **Component Porting**:
    - Translate Svelte components (`.svelte`) to React functional components (`.tsx` or `.jsx`).
    - Replace Svelte directives (`{#if}`, `{#each}`) with React patterns (`condition && ...`, `.map()`).
5.  **Integration & Deployment**:
    - Update `Dockerfile` to use the .NET SDK for building and the ASP.NET runtime for execution.
    - Update `docker-compose.yml` to point to the new image/build.

## 4. Risks

- **UI Complexity**: React requires more boilerplate for state and effects compared to Svelte's compiler-driven reactivity. Porting complex components like the `NetworkMap` or `DocEditor` may take significant effort.
- **Serialization Differences**: .NET's `System.Text.Json` may handle nulls or naming conventions (PascalCase vs camelCase) differently than Flask's `jsonify`.
- **Date/Time Handling**: Ensuring ISO 8601 consistency across Python and C# runtimes for existing SQLite data.
- **Library Parity**: Finding an exact feature-match for `bytemd` in the React ecosystem that supports all current plugins (GFM, Highlight).

## 5. Potential Breaking Changes

- **API Response Structure**: The Flask backend currently wraps responses in a `{"data": ...}` or `{"error": ...}` object. The .NET implementation must mirror this exactly or the frontend will require significant modification.
- **URL Case Sensitivity**: .NET APIs often default to case-insensitive routing, but naming conventions in URLs should remain `camelCase` to match the existing frontend expectations.
- **Base64 Image Handling**: The `MAX_CONTENT_LENGTH` equivalent in Kestrel must be configured to allow the same 5MB payloads currently supported.
- **SQLite Concurrency**: Kestrel/Entity Framework might handle SQLite locking differently than Flask/SQLAlchemy under load (though minimal in a homelab context).

## 6. Migration Mapping (Files)

| Source Path                        | Target Equivalent                 |
| :--------------------------------- | :-------------------------------- |
| `backend/app/models/*.py`          | `Backend/Models/*.cs`             |
| `backend/app/routes/*.py`          | `Backend/Endpoints/*.cs`          |
| `backend/app/config.py`            | `appsettings.json` / `Program.cs` |
| `frontend/src/components/*.svelte` | `Frontend/src/components/*.tsx`   |
| `frontend/src/pages/*.svelte`      | `Frontend/src/pages/*.tsx`        |
| `frontend/src/lib/api.js`          | `Frontend/src/api/client.ts`      |
