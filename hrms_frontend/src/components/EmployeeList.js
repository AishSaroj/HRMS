import React, { useState } from 'react';

const EmployeeList = ({ employees, deleteEmployee }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Filter employees based on search and department
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = ['all', ...new Set(employees.map(emp => emp.department))];

  const styles = {
    container: {
      background: 'white',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #dee2e6',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px'
    },
    title: {
      color: '#2d3436',
      fontSize: '20px',
      fontWeight: '600'
    },
    countBadge: {
      background: '#007bff',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600'
    },
    filters: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    searchInput: {
      padding: '10px 16px',
      border: '1px solid #ced4da',
      borderRadius: '6px',
      fontSize: '14px',
      flex: 1,
      minWidth: '250px'
    },
    filterSelect: {
      padding: '10px 16px',
      border: '1px solid #ced4da',
      borderRadius: '6px',
      fontSize: '14px',
      background: 'white',
      cursor: 'pointer'
    },
    tableContainer: {
      overflowX: 'auto',
      marginBottom: '24px',
      borderRadius: '6px',
      border: '1px solid #e9ecef'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '800px'
    },
    th: {
      padding: '16px',
      textAlign: 'left',
      fontWeight: '600',
      color: '#495057',
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '2px solid #dee2e6',
      backgroundColor: '#f8f9fa'
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid #e9ecef',
      color: '#495057',
      fontSize: '14px'
    },
    employeeCell: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: '#007bff',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
      fontSize: '16px'
    },
    employeeInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px'
    },
    employeeName: {
      fontWeight: '600',
      color: '#2d3436'
    },
    employeeId: {
      fontSize: '12px',
      color: '#6c757d',
      fontFamily: 'monospace'
    },
    departmentBadge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-block'
    },
    deleteBtn: {
      padding: '6px 12px',
      background: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600',
      transition: 'all 0.2s ease'
    },
    deleteBtnHover: {
      background: '#c82333',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 4px rgba(220,53,69,0.2)'
    },
    summary: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '16px',
      borderTop: '1px solid #e9ecef',
      fontSize: '14px',
      color: '#6c757d',
      flexWrap: 'wrap',
      gap: '16px'
    },
    noData: {
      textAlign: 'center',
      padding: '40px',
      color: '#6c757d',
      fontStyle: 'italic'
    },
    departmentStats: {
      display: 'flex',
      gap: '8px',
      marginTop: '16px',
      flexWrap: 'wrap'
    },
    departmentStat: {
      padding: '6px 12px',
      background: '#f8f9fa',
      borderRadius: '4px',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }
  };

  const [hoveredDelete, setHoveredDelete] = useState(null);

  // Calculate department statistics
  const departmentStats = {};
  employees.forEach(emp => {
    departmentStats[emp.department] = (departmentStats[emp.department] || 0) + 1;
  });

  const getDepartmentColor = (dept) => {
    const colors = {
      'IT': '#007bff',
      'HR': '#28a745',
      'Finance': '#17a2b8',
      'Marketing': '#ffc107',
      'Sales': '#fd7e14',
      'Operations': '#6f42c1',
      'Support': '#20c997'
    };
    return colors[dept] || '#6c757d';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Employee Directory</h3>
        <div style={styles.countBadge}>
          {employees.length} Employee{employees.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          style={styles.filterSelect}
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>
              {dept === 'all' ? 'All Departments' : dept}
            </option>
          ))}
        </select>
      </div>

      {/* Department Statistics */}
      <div style={styles.departmentStats}>
        {Object.entries(departmentStats).map(([dept, count]) => (
          <div 
            key={dept} 
            style={{
              ...styles.departmentStat,
              background: getDepartmentColor(dept) + '15',
              borderLeft: `3px solid ${getDepartmentColor(dept)}`
            }}
          >
            <span style={{color: getDepartmentColor(dept), fontWeight: '600'}}>{dept}:</span>
            <span style={{fontWeight: '600'}}>{count}</span>
          </div>
        ))}
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Employee</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Employee ID</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  {employees.length === 0 
                    ? 'No employees found. Add your first employee using the "Add Employee" form.'
                    : 'No employees match your search criteria.'}
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr key={employee._id}>
                  <td style={styles.td}>
                    <div style={styles.employeeCell}>
                      <div style={styles.avatar}>
                        {employee.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={styles.employeeInfo}>
                        <div style={styles.employeeName}>{employee.name}</div>
                        <div style={{fontSize: '12px', color: '#6c757d'}}>
                          Joined: {new Date().toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <a 
                      href={`mailto:${employee.email}`}
                      style={{color: '#007bff', textDecoration: 'none'}}
                      onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                      {employee.email}
                    </a>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.departmentBadge,
                      background: getDepartmentColor(employee.department) + '20',
                      color: getDepartmentColor(employee.department)
                    }}>
                      {employee.department}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <code style={{
                      background: '#f8f9fa',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '12px'
                    }}>
                      {employee.employeeId}
                    </code>
                  </td>
                  <td style={styles.td}>
                    <button 
                      style={{
                        ...styles.deleteBtn,
                        ...(hoveredDelete === employee._id ? styles.deleteBtnHover : {})
                      }}
                      onMouseEnter={() => setHoveredDelete(employee._id)}
                      onMouseLeave={() => setHoveredDelete(null)}
                      onClick={() => deleteEmployee(employee._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.summary}>
        <div>
          Showing <strong>{filteredEmployees.length}</strong> of <strong>{employees.length}</strong> employees
          {searchTerm && ` matching "${searchTerm}"`}
          {filterDepartment !== 'all' && ` in ${filterDepartment}`}
        </div>
        <div style={{fontSize: '12px', color: '#6c757d'}}>
          Click on email to send message • Employee ID is unique identifier
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;