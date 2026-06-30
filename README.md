<!-- TODO It should answer:

answer in summary and point to details in docs folder
* What is this project?
* How do I build it?
* How do I run it?
* Development requirements
* Architecture overview
* Docker instructions
* Contributing guidelines

-->

# RWD Infrastructure Diagram

Infrastructure documentation and topology visualization platform.

## Features

## Architecture

## Development Setup

## Docker Setup

## Project Structure

## Contributing

<!-- make sure this is in the developer instructions section in any readme that is appropriate -->

Root Makefile: Added a root Makefile containing the following shortcuts:
• make run-backend : Starts the .NET backend Minimal API.
• make run-frontend : Runs the Vite React dev server.
• make docker-build : Builds Docker containers.
• make docker-up : Starts Docker containers in the background.
• make docker-down : Stops and tears down Docker containers.
• make docker-logs : Follows logs from running Docker containers.
• make clean : Cleans dotnet and frontend build artifacts.
