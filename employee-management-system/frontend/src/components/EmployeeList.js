import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const { role } = useAuth();

  const canEdit = role === 'ADMIN' || role === 'MANAGER';
  const canDelete = role === 'ADMIN';

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/employees', {
        params: { keyword, departmentId: departmentId || undefined, page, size: 10 },
      });
      setEmployees(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    } finally {
      setLoading(false);
    }
  }, [keyword, departmentId, page]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    api.get('/departments').then((res) => setDepartments(res.data)).catch(() => {});
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    await api.delete(`/employees/${id}`);
    fetchEmployees();
  };

  return (
    <div className="container">
      <div className="toolbar">
        <input
          placeholder="Search by name or email..."
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setPage(0); }}
        />
        <select
          value={departmentId}
          onChange={(e) => { setDepartmentId(e.target.value); setPage(0); }}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        {canEdit && (
          <Link to="/employees/new" className="btn" style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
            + Add Employee
          </Link>
        )}
      </div>

      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Joined</th>
                <th>Status</th>
                {(canEdit || canDelete) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 && (
                <tr><td colSpan="7">No employees found.</td></tr>
              )}
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.firstName} {emp.lastName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.departmentName}</td>
                  <td>{emp.dateOfJoining}</td>
                  <td>{emp.active ? 'Active' : 'Inactive'}</td>
                  {(canEdit || canDelete) && (
                    <td>
                      {canEdit && <Link to={`/employees/${emp.id}/edit`}>Edit</Link>}
                      {canEdit && canDelete && ' | '}
                      {canDelete && (
                        <button
                          className="btn btn-danger"
                          style={{ padding: '4px 8px', fontSize: 12, marginLeft: 6 }}
                          onClick={() => handleDelete(emp.id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="toolbar">
        <button className="btn btn-secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>
        <span>Page {page + 1} of {Math.max(totalPages, 1)}</span>
        <button
          className="btn btn-secondary"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
