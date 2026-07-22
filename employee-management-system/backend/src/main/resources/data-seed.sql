-- Run this AFTER starting the Spring Boot app once (so Hibernate creates the tables).

USE employee_management_system;

-- Seed departments
INSERT INTO departments (name) VALUES ('Engineering'), ('Human Resources'), ('Sales'), ('Finance');

-- Do NOT insert users directly via SQL — passwords must be BCrypt-hashed by the app.
-- Create your first ADMIN user by calling the register endpoint instead, e.g.:
--
-- POST http://localhost:8080/api/auth/register
-- Content-Type: application/json
--
-- {
--   "username": "admin",
--   "password": "Admin@123",
--   "email": "admin@ems.com",
--   "role": "ADMIN"
-- }
--
-- This ensures the password is hashed correctly by Spring Security's BCryptPasswordEncoder.
