# LogSpace Backend API

A FastAPI backend for LogSpace - a public build-log and project documentation platform.

## 🏗 Architecture

- **Framework**: FastAPI with async/await
- **Database**: PostgreSQL via Supabase
- **Auth**: Clerk.dev JWT tokens
- **ORM**: SQLAlchemy with async support
- **Migrations**: Alembic

## 📁 Project Structure

```
backend/
├── main.py                 # FastAPI app entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── alembic.ini            # Alembic configuration
├── setup.py               # Setup script
├── api/
│   ├── routes/            # API route handlers
│   │   ├── auth.py        # Authentication routes
│   │   ├── projects.py    # Project CRUD
│   │   ├── logs.py        # Log management
│   │   └── collaborators.py # Collaboration features
│   ├── models/            # SQLAlchemy models
│   ├── schemas/           # Pydantic schemas
│   └── deps/              # Dependencies (auth, etc.)
└── db/
    └── session.py         # Database session management
```

## 🚀 Quick Start

1. **Setup Environment**:
   ```bash
   cd backend
   python setup.py
   ```

2. **Configure Environment**:
   Edit `.env` file with your actual values:
   ```env
   DATABASE_URL=postgresql://username:password@hostname:port/database_name
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   JWT_SECRET=your_jwt_secret_key_here
   ```

3. **Run Migrations**:
   ```bash
   alembic upgrade head
   ```

4. **Start Server**:
   ```bash
   python main.py
   ```

   Or with uvicorn:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## 📡 API Endpoints

### Authentication
- `GET /api/v1/auth/validate-session` - Validate session token
- `GET /api/v1/auth/me` - Get current user profile

### Projects
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects/{id}` - Get project by ID
- `GET /api/v1/projects/slug/{slug}` - Get project by slug
- `GET /api/v1/projects/user/{user_id}` - Get user's projects
- `PUT /api/v1/projects/{id}` - Update project
- `DELETE /api/v1/projects/{id}` - Delete project

### Logs
- `POST /api/v1/logs` - Create log entry
- `GET /api/v1/logs/project/{project_id}` - Get project logs
- `GET /api/v1/logs/{id}` - Get specific log
- `PUT /api/v1/logs/{id}` - Update log
- `DELETE /api/v1/logs/{id}` - Delete log

### Collaborators
- `POST /api/v1/collaborators/invite` - Generate invite token
- `POST /api/v1/collaborators/accept` - Accept collaboration invite
- `GET /api/v1/collaborators/{project_id}` - List project collaborators
- `PUT /api/v1/collaborators/{id}/role` - Update collaborator role
- `DELETE /api/v1/collaborators/{id}` - Remove collaborator

## 🔐 Authentication

The API uses Clerk.dev for authentication. All protected endpoints require a Bearer token:

```bash
curl -H "Authorization: Bearer <clerk_session_token>" \
     https://your-api.com/api/v1/auth/me
```

## 📊 Database Models

### User
- `id` (UUID, Primary Key)
- `clerk_id` (String, Unique)
- `name`, `email`, `avatar_url`, `bio`
- `website`, `github` (Optional links)
- `created_at`, `updated_at`

### Project
- `id` (UUID, Primary Key)
- `title`, `slug` (Unique), `description`
- `is_public` (Boolean)
- `owner_id` (FK to User)
- `created_at`, `updated_at`

### Log
- `id` (UUID, Primary Key)
- `title`, `content`, `log_type`
- `image_url` (Optional)
- `project_id` (FK to Project)
- `author_id` (FK to User)
- `created_at`, `updated_at`

### Collaborator
- `id` (UUID, Primary Key)
- `project_id` (FK to Project)
- `user_id` (FK to User)
- `role` (admin, editor, viewer)
- `invited_at`, `joined_at`

## 🔧 Development

### Adding New Routes
1. Create route handler in `api/routes/`
2. Add Pydantic schemas in `api/schemas/`
3. Include router in `main.py`

### Database Changes
1. Modify models in `api/models/`
2. Generate migration: `alembic revision --autogenerate -m "Description"`
3. Apply migration: `alembic upgrade head`

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `CLERK_SECRET_KEY` - Clerk secret key for token validation
- `JWT_SECRET` - Secret for internal JWT tokens
- `CORS_ORIGINS` - Allowed CORS origins (comma-separated)
- `ENVIRONMENT` - development/production

## 🚀 Deployment

### Railway
1. Connect your GitHub repo
2. Set environment variables
3. Deploy automatically on push

### Render
1. Create new Web Service
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `python main.py`

## 📝 API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🧪 Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## 📄 License

MIT License - see LICENSE file for details.
