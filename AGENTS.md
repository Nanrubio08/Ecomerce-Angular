# General Codebase Conventions & Workflow

This repository is structured as a separated full-stack application:
*   **Back-End:** `BackEnd-CRUD/` (Node.js/Express)
*   **Front-End:** `Proyecto-Angular/` (Angular)

## 🛠️ Development Workflow

The system requires two distinct development processes.

### Back-End (Node/Express)
*   **Purpose:** Handles core routing, business logic, database interactions (MongoDB via Mongoose), JWT authentication, and file uploads.
*   **Running:** Use `npm run dev` inside `BackEnd-CRUD/` (nodemon) for hot reloading during development.
*   **Execution:** `node app.js` or `npm run start` runs the built application.
*   **Architecture Note:** The backend expects to receive client data and includes middleware for file upload handling (`multer`).

### Front-End (Angular)
*   **Purpose:** Provides the user interface and state management for the application.
*   **Running:** Use `ng serve` inside `Proyecto-Angular/` to run the development server on `http://localhost:4200/`.
*   **Building:** Use `ng build` to generate optimized artifacts into the `dist/` directory.
*   **Testing:** Use `ng test` for unit tests. Use `ng e2e` for end-to-end tests.

## 🧱 Operational Gotchas
*   **Database:** The backend requires a running MongoDB instance for all operations.
*   **Authentication:** All API communication must respect JWT token passing/validation logic implemented in the backend.
*   **Code Integrity:** Always remember the required order for full verification: `npm run lint` $\rightarrow$ `npm run typecheck` $\rightarrow$ `npm run test`.