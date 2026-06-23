# RWD.Infrastructure.Diagram Project Rules

This file outlines the workspace rules and conventions for development with the Antigravity CLI.

## Project Overview
A lightweight, self-hosted infrastructure documentation and visualization tool.

## Goals
- React frontend (Vite).
- .NET 10 Minimal API backend.
- SQLite persistence.
- Docker-first deployment.

## Rules & Conventions
- Clean Architecture / DDD-lite patterns.
- Repository Pattern for data access.
- No microservices, No CQRS unless explicitly justified.
- Use XML documentation (`/// <summary>`) for public members.
- Follow the guidelines in [documentation-policy.md](file:///Users/ka8kgj/Documents/Source/RWD.Infrastructure.Diagram/instructions/documentation-policy.md).
- Keep memory footprint small and dependencies lean.
- Adhere to the session persistence workflow using `ai-context.md` and `ai-handoff.md`.
