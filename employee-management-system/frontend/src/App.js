import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <EmployeeList />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees/new"
            element={
              <PrivateRoute>
                <EmployeeForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees/:id/edit"
            element={
              <PrivateRoute>
                <EmployeeForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
