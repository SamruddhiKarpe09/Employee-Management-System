import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosConfig';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  designation: '',
  departmentId: '',
  dateOfJoining: '',
};

export default function EmployeeForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/departments').then((res) => setDepartments(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit) {
      api.get(`/employees/${id}`).then((res) => {
        const emp = res.data;
        setForm({
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          phone: emp.phone || '',
          designation: emp.designation,
          departmentId: emp.departmentId,
          dateOfJoining: emp.dateOfJoining,
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, departmentId: Number(form.departmentId) };
      if (isEdit) {
        await api.put(`/employees/${id}`, payload);
      } else {
        await api.post('/employees', payload);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please check the form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
        <h2>{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Designation</label>
              <input name="designation" value={form.designation} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department</label>
              <select name="departmentId" value={form.departmentId} onChange={handleChange} required>
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Date of Joining</label>
              <input type="date" name="dateOfJoining" value={form.dateOfJoining} onChange={handleChange} required />
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="toolbar">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
