import React, { useState, useEffect } from 'react';
import './App.css';
import AttendanceForm from './components/AttendanceForm';
import AttendanceList from './components/AttendanceList';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';

// API Base URL - Change this to your deployed backend URL
const API_BASE_URL = 'https://your-backend-url.onrender.com'; // Update this with your actual backend URL

function App() {
  const [activeTab, setActiveTab] = useState('attendance');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch employees from backend
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      // In production, use: const response = await fetch(`${API_BASE_URL}/api/employees`);
      // For now, we'll use mock data
      const mockEmployees = [
        { _id: '1', employeeId: '#1', name: 'person1', email: 'person1@company.com', department: 'IT' },
        { _id: '2', employeeId: '#2', name: 'Person2', email: 'person2@company.com', department: 'HR' },
        { _id: '3', employeeId: '#3', name: 'Person3', email: 'person3@company.com', department: 'Finance' },
      ];
      setEmployees(mockEmployees);
      setError('');
    } catch (err) {
      setError('Failed to load employees. Please try again.');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance records from backend
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      // In production, use: const response = await fetch(`${API_BASE_URL}/api/attendance`);
      // For now, we'll use mock data
      const mockAttendance = [
        { _id: '1', employeeId: '#1', employeeName: 'person1', date: '2026-02-04', status: 'PRESENT' },
        { _id: '2', employeeId: '#1', employeeName: 'person1', date: '2026-02-05', status: 'ABSENT' },
        { _id: '3', employeeId: '#2', employeeName: 'Person2', date: '2026-02-01', status: 'PRESENT' },
        { _id: '4', employeeId: '#2', employeeName: 'Person2', date: '2026-02-02', status: 'PRESENT' },
        { _id: '5', employeeId: '#2', employeeName: 'Person2', date: '2026-02-03', status: 'ABSENT' },
      ];
      setAttendanceRecords(mockAttendance);
      setError('');
    } catch (err) {
      setError('Failed to load attendance records. Please try again.');
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  // Add new attendance
  const addAttendance = async (newRecord) => {
    try {
      // In production, use: await fetch(`${API_BASE_URL}/api/attendance`, { method: 'POST', ... })
      const newAttendance = {
        _id: Date.now().toString(),
        ...newRecord
      };
      setAttendanceRecords([...attendanceRecords, newAttendance]);
      alert('Attendance marked successfully!');
    } catch (err) {
      alert('Failed to mark attendance. Please try again.');
      console.error('Error adding attendance:', err);
    }
  };

  // Delete attendance record
  const deleteAttendance = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        // In production, use: await fetch(`${API_BASE_URL}/api/attendance/${id}`, { method: 'DELETE' })
        setAttendanceRecords(attendanceRecords.filter(record => record._id !== id));
        alert('Attendance record deleted successfully!');
      } catch (err) {
        alert('Failed to delete attendance record. Please try again.');
        console.error('Error deleting attendance:', err);
      }
    }
  };

  // Add new employee
  const addEmployee = async (newEmployee) => {
    try {
      // In production, use: await fetch(`${API_BASE_URL}/api/employees`, { method: 'POST', ... })
      const newEmp = {
        _id: Date.now().toString(),
        ...newEmployee
      };
      setEmployees([...employees, newEmp]);
      alert('Employee added successfully!');
    } catch (err) {
      alert('Failed to add employee. Please try again.');
      console.error('Error adding employee:', err);
    }
  };

  // Delete employee
  const deleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee? This will also delete their attendance records.')) {
      try {
        // In production, use: await fetch(`${API_BASE_URL}/api/employees/${id}`, { method: 'DELETE' })
        setEmployees(employees.filter(emp => emp._id !== id));
        // Also delete attendance records for this employee
        setAttendanceRecords(attendanceRecords.filter(record => record.employeeId !== employees.find(e => e._id === id)?.employeeId));
        alert('Employee deleted successfully!');
      } catch (err) {
        alert('Failed to delete employee. Please try again.');
        console.error('Error deleting employee:', err);
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Error</div>
          <div>{error}</div>
          <button 
            onClick={() => {
              fetchEmployees();
              fetchAttendance();
            }}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    switch(activeTab) {
      case 'attendance':
        return (
          <>
            <AttendanceForm 
              addAttendance={addAttendance} 
              employees={employees}
            />
            <AttendanceList 
              attendanceRecords={attendanceRecords} 
              deleteAttendance={deleteAttendance}
              employees={employees}
            />
          </>
        );
      case 'add-employee':
        return <EmployeeForm addEmployee={addEmployee} />;
      case 'employee-list':
        return <EmployeeList employees={employees} deleteEmployee={deleteEmployee} />;
      default:
        return (
          <>
            <AttendanceForm 
              addAttendance={addAttendance} 
              employees={employees}
            />
            <AttendanceList 
              attendanceRecords={attendanceRecords} 
              deleteAttendance={deleteAttendance}
              employees={employees}
            />
          </>
        );
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1>HRMS Lite</h1>
          <span className="app-subtitle">Full-Stack HR Management System</span>
        </div>
      </header>

      <div className="container">
        <nav className="sidebar">
          <h3>NAVIGATION</h3>
          <ul>
            <li 
              className={activeTab === 'attendance' ? 'active' : ''}
              onClick={() => setActiveTab('attendance')}
            >
              <span className="nav-icon">📊</span>
              <span>Attendance</span>
              <span className="badge">{attendanceRecords.length}</span>
            </li>
            <li 
              className={activeTab === 'add-employee' ? 'active' : ''}
              onClick={() => setActiveTab('add-employee')}
            >
              <span className="nav-icon">➕</span>
              <span>Add Employee</span>
            </li>
            <li 
              className={activeTab === 'employee-list' ? 'active' : ''}
              onClick={() => setActiveTab('employee-list')}
            >
              <span className="nav-icon">👥</span>
              <span>Employee List</span>
              <span className="badge">{employees.length}</span>
            </li>
          </ul>
        </nav>

        <main className="main-content">
          <div className="content-header">
            <h2>HRMS Lite Dashboard</h2>
            <p className="subtitle">Manage employees and track attendance</p>
          </div>
          
          {renderContent()}
        </main>
      </div>

      <footer className="footer">
        <div>HRMS Lite • Full-Stack Coding Assignment • Deployed Version</div>
        <div>
          <a href="https://github.com/yourusername/hrms-fullstack" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;