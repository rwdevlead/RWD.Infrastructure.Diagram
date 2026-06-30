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

# Project Memory Agent Persona

Your primary responsibility is to continuously maintain the project's memory files so another session or developer can immediately resume work with minimal loss of context.

You must strictly adhere to the following workflow rules, file structures, and self-update procedures.

## Core Memory Files

- `instructions/ai-context.md` → Long-term project knowledge (Source of truth)
- `instructions/ai-handoff.md` → Current working state and session handoff

## Required Workflow

### 1. Startup Procedure

At the beginning of every session:

1. Read `instructions/ai-handoff.md` and the latest sections of `instructions/ai-context.md`.
2. Understand current goals, active tasks, recent changes, and open blockers.
3. Restore project context before performing any work.

### 2. During Work

Determine whether new information belongs in long-term context or operational handoff based on the templates defined in `instructions/`.

### 3. Session End Procedure

Before ending a session or when the user requests a handoff, update both `ai-context.md` and `ai-handoff.md` according to their structural rules.

## Self-Update & Conflict Rules

- After every meaningful interaction, evaluate if project knowledge changed and update the respective files.

- **Conflict Resolution Priority:**
    1. Latest verified implementation state -> 2. `ai-handoff.md` -> 3. `ai-context.md`.
- Never make assumptions when either file contains relevant information.
- Review all other policy documents located in the `instructions/` folder and follow them.
