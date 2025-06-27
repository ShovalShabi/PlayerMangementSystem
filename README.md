# Player Management System

## Overview

The Player Management System is a full-stack web application designed to manage football/soccer players data. It consists of a Java Spring Boot backend and a React + TypeScript frontend. The system allows users to view, filter, add, update, and manage player information, including bulk CSV upload and advanced filtering.

---

## System Architecture

- **Backend:** Java Spring Boot (REST API)
- **Frontend:** React + TypeScript (Vite, MUI)
- **Database:** MySQL (via Docker Compose)
- **Containerization:** Docker & Docker Compose

---

## Functionality

- **Player CRUD:** Create, read, update, and delete player records
- **Filtering:** Filter players by name, age, height, nationality, and position
- **Bulk Upload:** Upload players via CSV file
- **Responsive UI:** Modern, responsive dashboard for player management
- **API Security:** Basic security and validation on backend
- **Health Checks:** Docker Compose health checks for all services
- **API Testing:** Swagger-UI available in backend dev mode at [http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html)

---

## Environment Variables for Frontend

The frontend (PlayersDashboard) uses environment variables for configuration. These are managed via `.env.{env type}` files (e.g., `.env.dev`, `.env.prod`) located in the `PlayersDashboard/` directory.

- **How to use:**
  - Copy `.env.example` to `.env.dev`, `.env.prod`, or another environment as needed.
  - Edit the values to match your environment.
  - Vite will automatically load the correct file based on the build mode.

**Example: PlayersDashboard/.env.example**

```env
VITE_BACKEND_HOST=localhost
VITE_BACKEND_PORT=8081
VITE_ENV=dev
# Add other VITE_ variables as needed
```

---

## Prerequisites

### Backend (PlayerService)

- Java 17+
- Gradle (wrapper included)
- MySQL (or use Docker Compose)

### Frontend (PlayersDashboard)

- Node.js 18+
- npm or yarn

### For Dockerized Setup

- Docker
- Docker Compose (v2 plugin recommended)

---

## How to Run

### 1. **Development Mode (Local, Non-Docker)**

#### Backend

```bash
cd PlayerService
./gradlew bootRun
```

- Runs Spring Boot backend on [http://localhost:8081](http://localhost:8081)

#### Frontend

```bash
cd PlayersDashboard
npm install
npm run dev
```

- Runs React frontend on [http://localhost:3001](http://localhost:3001) (default applicaton port)

#### Database

- Start a local MySQL instance, or use Docker Compose as below.

---

### 2. **Production/Full Stack Mode (Docker Compose)**

```bash
docker compose -f docker-compose.prod.yml up --build
```

- Brings up MySQL, backend, and frontend containers
- Frontend available on [http://localhost](http://localhost)
- Backend API on [http://localhost:8080](http://localhost:8080)

To stop:

```bash
docker compose -f docker-compose.prod.yml down
```

---

### 3. **Development Mode (Docker Compose)**

```bash
docker compose -f docker-compose.dev.yml up --build
```

- Hot-reloads frontend and backend for local development

---

## Bulk Upload Example

A sample CSV file, `bulk_players_example.csv`, is provided at the root of the repository. You can use this file to test the bulk upload functionality in the dashboard.

---

## Directory Structure & Further Information

- **PlayerService/** — Spring Boot backend ([see PlayerService/README.md](PlayerService/README.md))
- **PlayersDashboard/** — React frontend ([see PlayersDashboard/README.md](PlayersDashboard/README.md))
- **docker-compose.prod.yml** — Production Docker Compose file
- **docker-compose.dev.yml** — Development Docker Compose file
- **bulk_players_example.csv** — Example CSV for testing bulk upload

For more details, see the README files in each subdirectory.

---

## Contact & Contributions

- For issues, please open a GitHub issue.
- Contributions are welcome via pull requests.
