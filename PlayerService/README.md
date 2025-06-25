# PlayerService

A Spring Boot RESTful service for managing football (soccer) players, supporting advanced filtering, sorting, and bulk operations. This service is part of the Player Management System.

---

## Features

- CRUD operations for players
- Advanced filtering and sorting (by name, nationality, age, position, height)
- Bulk upload via CSV
- API documentation via Swagger-UI
- MySQL database integration

---

## API Endpoints

### Player Management

| Method | Route           | Description                           |
| ------ | --------------- | ------------------------------------- |
| GET    | `/players`      | List players with filters and sorting |
| GET    | `/players/{id}` | Get player by ID                      |
| POST   | `/players`      | Create a new player                   |
| PATCH  | `/players/{id}` | Update an existing player             |
| DELETE | `/players/{id}` | Delete a player by ID                 |
| DELETE | `/players`      | Delete all players                    |
| GET    | `/players/all`  | Get all players (no pagination)       |
| POST   | `/players/bulk` | Bulk upload players from CSV          |

### Filtering & Sorting (GET `/players`)

- **Query Parameters:**
  - `name` (string): Filter by full name (contains, case-insensitive)
  - `nationalities` (list): Filter by one or more nationalities (exact match)
  - `minAge`, `maxAge` (int): Filter by age range (inclusive)
  - `positions` (list): Filter by one or more positions (must have all)
  - `minHeight`, `maxHeight` (double): Filter by height range (inclusive)
  - `sortBy` (enum): Sort by `NAME`, `NATIONALITY`, `AGE`, `POSITIONS`, `HEIGHT`
  - `order` (string): `asc` or `desc`
  - `page`, `size` (int): Pagination controls

### Bulk Upload (POST `/players/bulk`)

- Accepts a CSV file with player data.
- Returns a summary of successes and errors.

---

## Database Connection

- Uses MySQL 8.x
- Connection details are configured via `application.properties` or environment variables:
  - `SPRING_DATASOURCE_URL`
  - `SPRING_DATASOURCE_USERNAME`
  - `SPRING_DATASOURCE_PASSWORD`
- Example JDBC URL:
  ```
  jdbc:mysql://localhost:3306/player_management_db_dev?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
  ```

---

## Running the Service

### Locally (Dev)

1. Ensure MySQL is running and accessible.
2. Configure your `application-dev.properties` as needed.
3. Build and run:
   ```sh
   ./gradlew bootRun
   ```

### With Docker Compose

1. From the project root, run:
   ```sh
   docker-compose -f docker-compose.dev.yml up --build
   ```
2. The service will be available at `http://localhost:8081` (default).

---

## API Documentation (Swagger-UI)

- Swagger-UI is available in `dev` and `test` profiles at:
  - [http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html)
- Use Swagger-UI to:
  - Explore all endpoints
  - Try out requests and see responses
  - View request/response schemas

---

## Example Requests

**Get players filtered by nationality and age, sorted by height descending:**

```
GET /players?nationalities=Brazil,Germany&minAge=20&maxAge=30&sortBy=HEIGHT&order=desc
```

**Bulk upload players:**

```
POST /players/bulk
Content-Type: multipart/form-data
(file: players.csv)
```

---

## Contact

For questions or issues, please open an issue in the repository or contact [shovalshabi\@gmail.com](mailto:shovalshabi@gmail.com?subject=I%Have%20a%20Question%20About%the%Server-Side).
