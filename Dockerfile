# Base image for runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Image for building
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj files and restore
COPY ["src/Backend/RWD.Infrastructure.Diagram.Api/RWD.Infrastructure.Diagram.Api.csproj", "Backend/RWD.Infrastructure.Diagram.Api/"]
COPY ["src/Backend/RWD.Infrastructure.Diagram.Core/RWD.Infrastructure.Diagram.Core.csproj", "Backend/RWD.Infrastructure.Diagram.Core/"]
COPY ["src/Backend/RWD.Infrastructure.Diagram.Infrastructure/RWD.Infrastructure.Diagram.Infrastructure.csproj", "Backend/RWD.Infrastructure.Diagram.Infrastructure/"]
RUN dotnet restore "Backend/RWD.Infrastructure.Diagram.Api/RWD.Infrastructure.Diagram.Api.csproj"

# Copy the rest of the source
COPY src/Backend/ src/Backend/
WORKDIR "/src/Backend/RWD.Infrastructure.Diagram.Api"
RUN dotnet build "RWD.Infrastructure.Diagram.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish the application
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "RWD.Infrastructure.Diagram.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RWD.Infrastructure.Diagram.Api.dll"]
