# README and Code Documentation Policy

You are responsible for maintaining high-quality project documentation alongside all code changes.

Documentation is a required deliverable, not an optional task.

---

## Core Principles

- Documentation must evolve with the code.
- Code changes are incomplete until related documentation is updated.
- Documentation should explain why and how, not just what.
- Prefer concise, actionable information over exhaustive descriptions.
- Eliminate duplicate documentation whenever possible.
- Treat documentation as production code.

---

## README Ownership Rules

**Every repository must contain a README.md**

Each major application, service, library, or module should have its own local README.md when warranted by complexity.

### Update Triggers

Update the relevant README.md whenever changes affect:

- Setup or installation
- Configuration
- Environment variables
- Dependencies
- Architecture
- Public APIs
- User workflows
- Deployment procedures
- Infrastructure requirements
- Development workflows
- Testing procedures
- Troubleshooting guidance

Documentation updates must be included in the same change set as the code modifications.

---

### Required README Structure

When creating or updating a README.md, include applicable sections in the following order:

1. Project Overview
2. Purpose and Goals
3. Architecture Overview
4. Prerequisites
5. Installation
6. Configuration
7. Running the Project
8. Development Workflow
9. Testing
10. Deployment
11. API Reference
12. Repository Structure
13. Troubleshooting
14. Frequently Asked Questions
15. Contributing Guidelines

Omit sections that are not applicable.

---

## Repository Documentation Standards

### Document:

- Repository purpose
- Service boundaries
- Dependencies
- External integrations
- Important design decisions
- Operational procedures
- Common maintenance tasks

Include examples whenever they improve clarity.

Prefer diagrams when explaining complex architecture.

---

## Code Documentation Standards

Write documentation for future maintainers.

Assume readers have general technical knowledge but no project-specific context.

Use xml documentation methods where appropriate.
Example:

```C#
///<Summary>
/// Some Method Summary
/// </Summary>
```

or for interface implementation

```C#
///<InheritDoc <seealso cref="IMyClass.Method()">>
```

### Document the Following

- Public APIs
- Classes
- Interfaces
- Modules
- Complex functions
- Non-obvious business logic
- Workarounds and constraints
- Performance considerations
- Security-sensitive code

### Do Not Document

Avoid comments that merely restate code behavior.

Avoid redundant or obvious comments.

Bad example:

```C#
// Increment the counter by one.
```

Good example:

```C#
// Retry count is limited to prevent API rate limiting.
```

---

### Inline Comment Rules

Comments should explain:

- Why a decision was made
- Business context
- Assumptions
- Trade-offs
- Edge cases
- Known limitations

If code requires extensive explanation, consider refactoring before adding comments.

---

### API Documentation Requirements

Document:

- Endpoints
- Request formats
- Response formats
- Authentication requirements
- Error conditions
- Rate limits
- Usage examples

Keep API documentation synchronized with implementation.

---

### Environment Variable Documentation

Every environment variable must be documented.

Include:

- Variable name
- Purpose
- Required or optional status
- Default value
- Example value

Never include secrets, credentials, or real production values.

---

### Architecture Decision Records

Significant technical decisions must be documented as ADRs.

Create or update an ADR when introducing:

- New frameworks
- New infrastructure
- Major architectural changes
- Significant dependencies
- Breaking changes

Document:

- Context
- Decision
- Alternatives considered
- Consequences

---

### Documentation Validation Checklist

Before considering work complete, verify:

- Relevant README files were reviewed
- Documentation reflects current behavior
- Examples were tested
- Commands are accurate
- Links are valid
- Environment variables are documented
- API changes are documented
- Architecture diagrams remain accurate

---

### Documentation Workflow

For every code change:

1. Determine which documentation is affected.
2. Update documentation before completing the task.
3. Verify documentation accuracy against the implementation.
4. Record significant changes in PROJECT_CONTEXT.md.
5. Record documentation updates in AI_HANDOFF.md.

Code and documentation must always remain synchronized.
