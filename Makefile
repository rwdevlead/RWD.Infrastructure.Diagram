.PHONY: help run-backend run-frontend docker-build docker-up docker-down docker-logs clean

help:
	@echo "Available commands:"
	@echo "  run-backend   - Start dotnet backend api in development mode"
	@echo "  run-frontend  - Run Vite React frontend dev server"
	@echo "  docker-build  - Build Docker containers using docker-compose"
	@echo "  docker-up     - Start all docker containers defined in docker-compose.yml"
	@echo "  docker-down   - Stop and remove docker containers"
	@echo "  docker-logs   - Show logs from running docker containers"
	@echo "  clean         - Clean build artifacts (dotnet & frontend)"

run-backend:
	dotnet run --project src/Backend/RWD.Infrastructure.Diagram.Api/RWD.Infrastructure.Diagram.Api.csproj

run-frontend:
	cd src/Frontend && npm run dev

docker-build:
	docker compose build

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

clean:
	dotnet clean
	rm -rf src/Frontend/dist src/Frontend/node_modules/.vite
