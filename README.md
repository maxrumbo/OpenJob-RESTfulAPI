# OpenJob RESTful API

Internal recruitment RESTful API for the OpenJob platform.

## Features
- **Users**: create, get by id (with cache), update
- **Authentication**: protected routes using **Bearer JWT**
- **Profile**: current user data, applications, and bookmarks
- **Applications**: submit / list / update status (with cache)
- **Swagger documentation**: available at `/api-docs`

## Tech Stack
- Node.js + Express
- PostgreSQL
- Redis (cache layer)
- Message Broker: RabbitMQ
- Containerization: Docker & Docker Compose
- Email Service: Mailtrap
- Swagger (OpenAPI via `swagger-jsdoc` + `swagger-ui-express`)
- Postman test suite (collection/environment)

## Setup
### Local Setup (Without Docker)
1. Create a PostgreSQL database named **`openjob`**.
2. Configure credentials in the **`.env`** file.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run migrations:
   ```bash
   npm run migrate
   ```
5. Start the server (development):
   ```bash
   npm run start:dev
   ```

### Docker Setup (Redis + RabbitMQ + Postgres + Consumer + Mailtrap)
1. Copy env template:
   ```bash
   copy .env.example 
   ```
2. Fill in your Mailtrap credentials in the .env file:
   - `MAIL_USER`
   - `MAIL_PASSWORD`
3. Build and run all services:
   ```bash
   docker compose up --build
   ```
4. Run migrations:
   - (a) Run via the API container:
     ```bash
   docker compose exec api npm run migrate
     ```
   - (b) Or run from your local terminal (if connected to a local DB):
     ```bash
     npm run migrate
     ```
5. Access the API:
   - `http://localhost:<PORT>/api-docs`

Note: The API publishes messages to the RabbitMQ queue export:applications.

## Swagger (API Docs)
Run the server, then open:
- **Swagger UI**: `http://localhost:<PORT>/api-docs`
- **Swagger JSON**: `http://localhost:<PORT>/api-docs/swagger.json`

## Swagger Screenshots

### User & Profile

![Swagger - User & Profile](<swagger docs/user & profile test.png>)

### Jobs Endpoints

![Swagger - Jobs Endpoints](<swagger docs/jobs endpoints.png>)

## Testing
A Postman collection and environment are included in the repo. For multipart upload tests, Postman Runner may have limitations—manual requests can be used if needed.

