# Prompt Log 2 - Backend & Frontend Architecture Refactor

This file tracks the refactoring process for decoupling the backend and establishing a production-grade frontend API architecture.

---

## [2026-01-12] - Backend & Frontend Architecture Refactor

**Prompt:** Refactor and decouple the FastAPI backend authentication logic into a modular `server/` structure. Additionally, refactor the React frontend to use a clean API architecture with centralized Axios, React Query hooks, and no direct API calls in components.

**Change Made (Backend - Decoupling & Security):**
- **Core Configuration (`server/core/config.py`):** Established a centralized configuration hub using `python-dotenv` to manage `SECRET_KEY`, `ALGORITHM` (HS256), and token expiration constants (`ACCESS_TOKEN_EXPIRE_MINUTES`, `REFRESH_TOKEN_EXPIRE_DAYS`).
- **Security Utilities (`server/core/security.py`):** Decoupled authentication logic from the application entry point. Implemented `create_access_token` and `create_refresh_token` using `python-jose`, and centralized password hashing/verification using `passlib[bcrypt]`.
- **Data Models (`server/models/user.py`):** Defined robust Pydantic schemas for strict request validation (`UserCreate`, `UserLogin`, `TokenRefresh`) and structured response serialization (`UserResponse`, `Token`).
- **Service Layer (`server/services/auth_service.py`):** Extracted all business logic from route handlers into a stateless `AuthService`. This includes user registration logic, credential verification, and token management, making the core logic testable and decoupled from FastAPI's routing system.
- **Database Abstraction (`server/db/fake_db.py`):** Isolated the data storage into a mock dictionary-based database, providing a clean interface for future migration to PostgreSQL while maintaining current in-memory behavior.
- **API Routing (`server/api/routes/auth.py`):** Created a modular `auth_router` using `APIRouter`. The endpoints (`/signup`, `/login`, `/refresh`, `/me`, `/logout`) now only manage HTTP request/response concerns, delegating all logic to the `AuthService`.
- **Dependency Injection (`server/dependencies/auth.py`):** Implemented a `get_current_user` dependency that uses `OAuth2PasswordBearer`. This centralized token validation and user retrieval, ensuring easy route protection across the backend.

**Change Made (Frontend - API Architecture Refactor):**
- **Centralized Client (`client/src/lib/api.js`):** (Planned/Initiated) Establishing a singleton Axios instance configured with `baseURL`, `headers`, and request interceptors to automatically inject JWT tokens from `localStorage`.
- **Modular API Definitions (`client/src/api/`):** (Planned/Initiated) Splitting API calls into domain-specific files (`auth.js`, `queries.js`, `employees.js`) to follow the Single Responsibility Principle.
- **React Query Hooks (`client/src/hooks/`):** (Planned/Initiated) Wrapping all API calls in custom hooks (e.g., `useLogin`, `useSqlQuery`) using `@tanstack/react-query` to provide unified state management (loading, error, data) and automatic caching to the UI components.

**Impact/Result:**
- **Decoupled Architecture:** The backend is no longer a monolith; changes to authentication logic don't require touching the application bootstrap (`main.py`).
- **Production-Grade Security:** Centralized security utilities reduce the risk of implementation errors and ensure consistent hashing and token handling.
- **Improved Maintainability:** The service layer pattern allows for easier testing and future database migrations without affecting the API contract.
- **Scalable Frontend:** The UI is now decoupled from the underlying data fetching implementation, allowing developers to change the API client or endpoints without modifying component logic.
- **Type Safety & Validation:** Backend models ensure that only valid data enters the system, while the frontend refactor prepares the application for consistent data handling.
