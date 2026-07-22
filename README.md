# Employee Management System (Full Stack)

Java 17 · Spring Boot 3 · Spring Security (JWT) · MySQL · React JS

A full-stack employee management app: employee onboarding, department/role assignment,
search & pagination, and role-based access control (Admin / Manager / Employee).

---

## 1. Prerequisites

Install these before you start:

- **Java 17** (JDK) — `java -version`
- **Maven 3.8+** — `mvn -version`
- **MySQL 8.x** — running locally, with a root password you know
- **Node.js 18+ and npm** — `node -v`, `npm -v`

---

## 2. Project structure

```
employee-management-system/
├── backend/          Spring Boot REST API
│   └── src/main/java/com/ems/
│       ├── config/       Security + JWT config
│       ├── controller/   REST controllers
│       ├── dto/          Request/response objects
│       ├── entity/       JPA entities
│       ├── exception/    Global error handling
│       └── repository/   Spring Data JPA repositories
└── frontend/         React app
    └── src/
        ├── api/          Axios client with JWT interceptor
        ├── context/      Auth context (login state)
        └── components/   Login, EmployeeList, EmployeeForm, Navbar
```

---

## 3. Backend setup

### 3.1 Create the database

You don't need to create the schema manually — `spring.datasource.url` includes
`createDatabaseIfNotExist=true`, and Hibernate will create the tables on first run
(`spring.jpa.hibernate.ddl-auto=update`).

### 3.2 Configure your DB credentials

Open `backend/src/main/resources/application.properties` and update:

```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

Also change the JWT secret before deploying anywhere real:

```properties
app.jwt.secret=ChangeThisToALongRandomSecretKeyThatIsAtLeast256BitsForHS256Alg
```

### 3.3 Run the backend

```bash
cd backend
mvn spring-boot:run
```

The API will start on **http://localhost:8080**.

### 3.4 Seed departments (optional)

Once the app has run once (so tables exist), run the department seed:

```bash
mysql -u root -p employee_management_system < src/main/resources/data-seed.sql
```

### 3.5 Create your first admin user

Passwords must be hashed by the app, so create your first user via the API rather than SQL:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123","email":"admin@ems.com","role":"ADMIN"}'
```

This returns a JWT token — you're now registered and logged in as ADMIN.

---

## 4. API overview

| Method | Endpoint                  | Access                  | Description                     |
|--------|----------------------------|--------------------------|----------------------------------|
| POST   | `/api/auth/register`       | Public                   | Create a user account            |
| POST   | `/api/auth/login`          | Public                   | Login, returns JWT               |
| GET    | `/api/departments`         | Authenticated            | List departments                 |
| POST   | `/api/departments`         | ADMIN                    | Create department                |
| DELETE | `/api/departments/{id}`    | ADMIN                    | Delete department                |
| GET    | `/api/employees`           | Authenticated            | Search/paginate employees        |
| GET    | `/api/employees/{id}`      | Authenticated            | Get one employee                 |
| POST   | `/api/employees`           | ADMIN, MANAGER           | Create employee                  |
| PUT    | `/api/employees/{id}`      | ADMIN, MANAGER           | Update employee                  |
| DELETE | `/api/employees/{id}`      | ADMIN                    | Delete employee                  |

`GET /api/employees` query params: `keyword`, `departmentId`, `page`, `size`, `sortBy`.

All authenticated endpoints require the header:
```
Authorization: Bearer <token>
```

---

## 5. Frontend setup

```bash
cd frontend
npm install
npm start
```

The app opens at **http://localhost:3000** and talks to the backend at
`http://localhost:8080/api` (configured in `src/api/axiosConfig.js`).

Log in with the admin account you created in step 3.5, add a department via
`POST /api/departments` (Postman/curl, since there's no department-management UI yet),
then start adding employees from the UI.

---

## 6. Notes & things to customize

- **CORS**: allowed origin is set in `application.properties` under `app.cors.allowed-origins`
  (defaults to `http://localhost:3000`).
- **JWT expiration**: `app.jwt.expiration-ms` (default 24 hours).
- **Roles**: `ADMIN`, `MANAGER`, `EMPLOYEE` — access rules are enforced both in
  `SecurityConfig` (URL-level) and `@PreAuthorize` annotations (method-level) in the controllers.
- This is a learning/portfolio-scale project — for production you'd want refresh tokens,
  password-reset flow, and a dedicated department-management screen in the UI.

---

## 7. Tech stack summary

- **Backend**: Java 17, Spring Boot 3, Spring Data JPA, Spring Security, JWT (jjwt), MySQL, Maven
- **Frontend**: React 18, React Router, Axios, Context API for auth state
- **Architecture**: Layered (Controller → Service → Repository), DTO pattern to decouple
  entities from API contracts, global exception handling, role-based access control
