# Project Plan: Homelab Hub Refactor

Original project path is source/RWD.Toolbox.Network.Draw

New project path is source/RWD.Infrastructure.Diagram

This document defines the functional and non-functional requirements, user stories, and scope for the new application base on the original project being refactored and new requirements of the new project being created.

## 1. Functional Requirements

### Inventory Management

- **FR-1**: Users must be able to create, read, update, and delete (CRUD) physical **Hardware** entities.
- **FR-2**: Users must be able to CRUD **Virtual Machines (VMs)** and associate them with specific Hardware.
- **FR-3**: Users must be able to CRUD **Applications/Services** and associate them with either Hardware or VMs.
- **FR-4**: Users must be able to CRUD **Storage** pools and associate them with Hardware or VMs.
- **FR-5**: Users must be able to CRUD **Network Shares** associated with Storage.
- **FR-6**: Users must be able to define **Networks** (VLANs, subnets).
- **FR-7**: Users must be able to assign entities (Hardware, VMs, etc.) to one or more Networks.

### Visualization & Documentation

- **FR-8**: The system must provide a **Network Map** visualization showing relationships between entities.
- **FR-9**: Users must be able to manually position and pin nodes on the Network Map.
- **FR-10**: The system must support a hierarchical **Documentation** system using Markdown.
- **FR-11**: Users must be able to search across all inventory items by name.

### Data Management

- **FR-12**: Users must be able to export the entire database as a JSON file.
- **FR-13**: Users must be able to import a previously exported JSON file to restore or migrate data.

## 2. Non-Functional Requirements

### Performance & Scalability

- **NFR-1**: The application should be lightweight enough to run on low-power homelab hardware (e.g., Raspberry Pi).
- **NFR-2**: API responses for list operations should be under 200ms for typical homelab datasets (<1000 items).
- **NFR-3**: The Network Map should remain performant with up to 100 visible nodes.

### Usability & Design

- **NFR-4**: The UI must be responsive and usable on desktop and tablet resolutions.
- **NFR-5**: The application must support a "Dark Mode" aesthetic common in homelab tools.
- **NFR-6**: Markdown editing should provide a real-time or side-by-side preview.

### Reliability & Security

- **NFR-7**: Data must be persisted in a local SQLite database file to ensure easy backups.
- **NFR-8**: The system should handle database locks gracefully during concurrent read/write operations (relevant for .NET refactor).

## 3. User Stories

| ID       | Role       | Requirement                                              | Goal/Benefit                                                             |
| :------- | :--------- | :------------------------------------------------------- | :----------------------------------------------------------------------- |
| **US-1** | Homelabber | I want to record my physical servers                     | So I can track specs, locations, and IPs in one place.                   |
| **US-2** | Homelabber | I want to see which VMs are running on which server      | So I can balance resource usage and understand dependencies.             |
| **US-3** | Homelabber | I want to document my service configurations in Markdown | So I have a searchable "knowledge base" for my lab.                      |
| **US-4** | Homelabber | I want a visual map of my network                        | So I can quickly identify where services sit and how they are connected. |
| **US-5** | Homelabber | I want to export my data to a JSON file                  | So I can back it up or move it to a new server easily.                   |
| **US-6** | Homelabber | I want to link a service to its web UI via a URL         | So I can use Homelab Hub as a central dashboard/launcher.                |

## 4. MVP Scope (Minimum Viable Product)

The MVP for the refactor focuses on core inventory and data integrity.

- **Core CRUD**: Hardware, VMs, Apps, and Storage.
- **Basic Networking**: Defining networks and simple IP assignments.
- **Visualization**: Basic Network Map with node pinning and relationship lines.
- **Documentation**: Markdown editor with basic hierarchy.
- **Data Portability**: JSON Import/Export functionality.
- **Infrastructure**: Docker Compose deployment with SQLite persistence.

## 5. Future Enhancements

- **Open Up to Open Source Contribution**: update evironment to encurage others to contribute.
- **Real-time Monitoring**: Integration with Ping or Prometheus to show "Up/Down" status of entities.
- **Automated Discovery**: Network scanning to automatically find and suggest new hardware/services.
- **User Authentication**: Multi-user support with roles (currently assumed single-user).
- **Dashboard Widgets**: Customizable home page with resource usage graphs.
- **Cloud Backup**: Automated encrypted backups to S3 or Backblaze.
- **API Keys**: Support for external scripts to update inventory items.
