# OpenJob RESTful API

Internal job recruitment RESTful API built with Node.js and Express.js. Provides a complete backend solution for managing job postings, companies, applications, and user authentication.

## Prerequisites

- Node.js v14 or higher
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd OpenJob-RESTful-API
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   ```bash
   # Copy and configure
   cp .env.example .env
   ```

## Configuration

Create a `.env` file in the root directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=openjob
DB_USER=postgres
DB_PASSWORD=your_password

# Server
PORT=5000
NODE_ENV=development

# Authentication
ACCESS_TOKEN_KEY=your_secret_key
REFRESH_TOKEN_KEY=your_refresh_secret_key

# File Uploads
UPLOAD_PATH=./uploads
```

## Database

Initialize the PostgreSQL database with migrations:

```bash
npm run migrate:up
```

Available migration commands:
- `npm run migrate:up` - Apply pending migrations
- `npm run migrate:down` - Rollback last migration
- `npm run migrate:create <name>` - Create new migration

## Running

Development mode with hot reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

**Authentication**
- `POST /authentications` - Register or login
- `PUT /authentications` - Refresh token
- `DELETE /authentications` - Logout

**Users**
- `POST /users` - Create user
- `GET /users` - List all users
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

**Companies**
- `POST /companies` - Create company
- `GET /companies` - List companies
- `GET /companies/:id` - Get company details
- `PUT /companies/:id` - Update company
- `DELETE /companies/:id` - Delete company

**Jobs**
- `POST /jobs` - Create job posting
- `GET /jobs` - List jobs
- `GET /jobs/:id` - Get job details
- `PUT /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job

**Categories**
- `POST /categories` - Create category
- `GET /categories` - List categories

**Applications**
- `POST /applications` - Submit application
- `GET /applications` - Get applications
- `PUT /applications/:id` - Update application status

**Bookmarks**
- `POST /bookmarks` - Create bookmark
- `GET /bookmarks` - List bookmarks
- `DELETE /bookmarks/:id` - Delete bookmark

**Documents**
- `POST /documents` - Upload document
- `GET /documents` - List documents
- `DELETE /documents/:id` - Delete document

**Profile**
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile

## Tech Stack

- Node.js
- Express.js v5
- PostgreSQL
- JWT
- bcrypt
- Joi
- Multer
- nanoid

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server |
| `npm run migrate:up` | Run migrations |
| `npm run migrate:down` | Rollback migration |

## Testing

Use the provided Postman collection for API testing:
- Collection: `[271] OpenJob API Test V1.postman_collection.json`
- Environment: `OpenJob API.postman_environment.json`

