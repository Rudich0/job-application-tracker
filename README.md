# JobTracker — Mini Job Application Tracker

A full-stack web application to track job applications through hiring stages. Built with React, Express, and PostgreSQL.


## Screenshots

# Landing page

![Landing page](screenshots/image1.png)

# Add application page
![Add application page](screenshots/image2.png)

# Application Filtering
![Application Filtering](screenshots/image3.png)

# Application details page
![Application details page](screenshots/image4.png)

# Edit Application page
![Edit Application page](screenshots/image5.png)

# Search Application from name
![Search Application from name](screenshots/image6.png)


## Tech Stack

| Layer     | Technology                                |
|-----------|-------------------------------------------|
| Frontend  | React 19 + TypeScript, Vite, Tailwind CSS |
| Backend   | Node.js, Express 4, TypeScript            |
| Database  | PostgreSQL 16                             |
| API Style | REST                                      |
| Testing   | Jest + ts-jest                            |
| Container | Docker + docker-compose                   |


## Features

- **Application List** — view all applications with company, role, type, status, date, and action buttons
- **Add Application** — create a new application via modal form with validation
- **Edit Application** — update any field of an existing application
- **Delete Application** — remove an application with a confirmation step
- **Filter by Status** — Applied / Interviewing / Offer / Rejected pill filters
- **Search** — debounced search across company name and job title
- **Pagination** — 20 results per page with Previous/Next controls
- **Toast notifications** — success and error feedback on every action
- **Loading states** — spinner while fetching, empty states with helpful copy
- **Responsive** — works on mobile and desktop


## Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- PostgreSQL 14+ running locally **or** Docker + docker-compose


## Installation

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd job-tracker
```

### 2. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Configure environment variables

**Backend** — copy and edit:

```bash
cp backend/.env.example backend/.env
```

| Variable       | Default                                              | Description                  |
|----------------|------------------------------------------------------|------------------------------|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/job_tracker` | PostgreSQL connection string |
| `PORT`         | `4000`                                               | Express server port          |
| `NODE_ENV`     | `development`                                        | Environment mode             |
| `CORS_ORIGIN`  | `http://localhost:5173`                              | Allowed frontend origin      |

**Frontend** — copy and edit:

```bash
cp frontend/.env.example frontend/.env
```

| Variable       | Default                    | Description            |
|----------------|----------------------------|------------------------|
| `VITE_API_URL` | `http://localhost:4000`    | Backend API base URL   |


## Running in Development

### Option A — Local (PostgreSQL must be running)

```bash
# 1. Create the database
createdb job_tracker

# 2. Run migrations
cd backend && npm run migrate

# 3. Start the backend (hot-reload)
npm run dev

# 4. In a new terminal, start the frontend
cd ../frontend && npm run dev
```

App is available at **http://localhost:5173**  
API is available at **http://localhost:4000**

### Option B — Docker Compose (no local Postgres needed)

```bash
docker-compose up --build
```

This starts:
- PostgreSQL on port `5432`
- Express API on port `4000`
- Nginx-served React app on port `5173`

> **Note:** The Docker setup does not auto-run migrations. Run them once after the containers are up:
> ```bash
> docker-compose exec backend node dist/migrate.js
> ```


## Running Tests

```bash
cd backend && npm test
```

Tests cover type validation, DTO shapes, and business logic helpers.


## API Documentation

Base URL: `http://localhost:4000`

### Health Check

```
GET /health
```

Returns `{ "status": "ok", "timestamp": "..." }`.

---

### `GET /applications`

List all applications. Supports filtering and pagination.

**Query parameters:**

| Param    | Type   | Description                                              |
|----------|--------|----------------------------------------------------------|
| `status` | string | Filter by status: `Applied`, `Interviewing`, `Offer`, `Rejected` |
| `search` | string | Search company name or job title (case-insensitive)      |
| `page`   | number | Page number (default: `1`)                               |
| `limit`  | number | Results per page (default: `20`, max: `100`)             |

**Response:**
```json
{
  "data": [ ...Application[] ],
  "total": 42,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```


### `GET /applications/:id`

Get a single application by UUID.

**Response:** `Application` object or `404`.


### `POST /applications`

Create a new application.

**Body:**
```json
{
  "company_name": "Anthropic",
  "job_title": "Software Engineer Intern",
  "job_type": "Internship",
  "status": "Applied",
  "applied_date": "2025-06-17",
  "notes": "Referral from Jane"
}
```

**Validation:**
- `company_name` — required, min 2 chars
- `job_title` — required
- `job_type` — `Internship` | `Full-time` | `Part-time`
- `status` — `Applied` | `Interviewing` | `Offer` | `Rejected` (defaults to `Applied`)
- `applied_date` — required, ISO 8601 date
- `notes` — optional string

**Response:** `201` with created `Application`.


### `PATCH /applications/:id`

Partially update an application. All fields are optional.

**Body:** any subset of `POST` body fields.

**Response:** Updated `Application` or `404`.


### `DELETE /applications/:id`

Delete an application.

**Response:** `204 No Content` or `404`.


## Data Model

```sql
CREATE TABLE applications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  job_title    VARCHAR(255) NOT NULL,
  job_type     VARCHAR(20)  NOT NULL CHECK (job_type IN ('Internship', 'Full-time', 'Part-time')),
  status       VARCHAR(20)  NOT NULL DEFAULT 'Applied'
                 CHECK (status IN ('Applied', 'Interviewing', 'Offer', 'Rejected')),
  applied_date DATE         NOT NULL,
  notes        TEXT,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

An `updated_at` trigger fires automatically on every `UPDATE`.

Indexes on `status`, `applied_date DESC`, and a GIN full-text index on `company_name` are created by the migration.

## Demo Video

[Watch the Demo](https://www.loom.com/share/your-demo-video-link)
