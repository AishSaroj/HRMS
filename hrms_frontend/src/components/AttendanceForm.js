import React, { useState } from 'react';

const AttendanceForm = ({ addAttendance, employees }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    date: '',
    status: 'PRESENT'
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.employeeName) newErrors.employeeName = 'Please select an employee';
    if (!formData.date) newErrors.date = 'Please select a date';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check for duplicate attendance for same employee on same date
    // This would be done on backend in production
    addAttendance(formData);
    setFormData({ employeeId: '', employeeName: '', date: '', status: 'PRESENT' });
    setErrors({});
  };

  const handleEmployeeSelect = (employee) => {
    setFormData({
      ...formData,
      employeeName: employee.name,
      employeeId: employee.employeeId
    });
    if (errors.employeeName) setErrors({...errors, employeeName: ''});
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split('T')[0];
    
    if (selectedDate > today) {
      setErrors({...errors, date: 'Cannot select future dates'});
      setFormData({ ...formData, date: '' });
    } else {
      setFormData({ ...formData, date: selectedDate });
      if (errors.date) setErrors({...errors, date: ''});
    }
  };

  const styles = {
    container: {
      background: 'white',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      border: '1px solid #dee2e6',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    header: {
      marginBottom: '20px'
    },
    title: {
      color: '#2d3436',
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6c757d',
      fontSize: '14px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontWeight: '600',
      color: '#495057',
      fontSize: '14px'
    },
    required: {
      color: '#dc3545',
      marginRight: '4px'
    },
    employeeOptions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '12px',
      marginTop: '8px'
    },
    employeeOption: {
      padding: '12px',
      border: '1px solid #dee2e6',
      borderRadius: '6px',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'left'
    },
    employeeOptionSelected: {
      borderColor: '#007bff',
      background: '#e7f3ff',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,123,255,0.1)'
    },
    dateInput: {
      padding: '10px',
      border: '1px solid #ced4da',
      borderRadius: '6px',
      fontSize: '14px',
      fontFamily: 'inherit',
      width: '200px'
    },
    dateInputFocus: {
      outline: 'none',
      borderColor: '#007bff',
      boxShadow: '0 0 0 3px rgba(0,123,255,0.1)'
    },
    statusOptions: {
      display: 'flex',
      gap: '12px',
      marginTop: '8px'
    },
    statusOption: {
      padding: '8px 16px',
      border: '1px solid #dee2e6',
      borderRadius: '6px',
      background: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s ease'
    },
    statusOptionSelected: {
      borderColor: '#28a745',
      background: '#e8f5e9'
    },
    errorText: {
      color: '#dc3545',
      fontSize: '12px',
      marginTop: '4px'
    },
    selectedInfo: {
      background: '#f8f9fa',
      padding: '12px',
      borderRadius: '6px',
      marginTop: '10px',
      border: '1px solid #e9ecef',
      fontSize: '14px'
    },
    todayHint: {
      fontSize: '12px',
      color: '#6c757d',
      marginTop: '4px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Mark Attendance</h3>
        <p style={styles.subtitle}>Record daily attendance for employees</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGrid}>
          {/* Employee Selection */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <span style={styles.required}>*</span> Employee Name:
            </label>
            {employees.length === 0 ? (
              <div style={{color: '#6c757d', fontStyle: 'italic', padding: '12px', background: '#f8f9fa', borderRadius: '6px'}}>
                No employees found. Please add employees first.
              </div>
            ) : (
              <div style={styles.employeeOptions}>
                {employees.map((employee) => (
                  <button
                    key={employee._id}
                    type="button"
                    style={{
                      ...styles.employeeOption,
                      ...(formData.employeeName === employee.name ? styles.employeeOptionSelected : {})
                    }}
                    onClick={() => handleEmployeeSelect(employee)}
                  >
                    <div style={{fontWeight: '600', marginBottom: '4px'}}>{employee.name}</div>
                    <div style={{fontSize: '12px', color: '#6c757d'}}>
                      ID: {employee.employeeId} | Dept: {employee.department}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {errors.employeeName && <div style={styles.errorText}>{errors.employeeName}</div>}
          </div>

          {/* Date Selection */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <span style={styles.required}>*</span> Date:
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={handleDateChange}
              max={new Date().toISOString().split('T')[0]}
              required
              style={styles.dateInput}
              onFocus={(e) => {
                e.target.style.outline = 'none';
                e.target.style.borderColor = '#007bff';
                e.target.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ced4da';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div style={styles.todayHint}>
              Today: {new Date().toLocaleDateString()}
            </div>
            {errors.date && <div style={styles.errorText}>{errors.date}</div>}
          </div>

          {/* Status Selection */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <span style={styles.required}>*</span> Status:
            </label>
            <div style={styles.statusOptions}>
              <button
                type="button"
                style={{
                  ...styles.statusOption,
                  ...(formData.status === 'PRESENT' ? styles.statusOptionSelected : {})
                }}
                onClick={() => setFormData({ ...formData, status: 'PRESENT' })}
              >
                Present
              </button>
              <button
                type="button"
                style={{
                  ...styles.statusOption,
                  ...(formData.status === 'ABSENT' ? styles.statusOptionSelected : {})
                }}
                onClick={() => setFormData({ ...formData, status: 'ABSENT' })}
              >
                Absent
              </button>
            </div>
          </div>
        </div>

        {/* Selected Info */}
        {(formData.employeeName || formData.date) && (
          <div style={styles.selectedInfo}>
            <strong>Selected:</strong> {formData.employeeName || 'Not selected'} 
            {formData.date && ` on ${formData.date}`}
            {formData.employeeName && formData.date && ` - ${formData.status}`}
          </div>
        )}

        {/* Form Actions */}
        <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
          <button 
            type="submit" 
            style={{
              padding: '10px 24px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              minWidth: '160px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#218838';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 8px rgba(40,167,69,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#28a745';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
            disabled={employees.length === 0}
          >
            {employees.length === 0 ? 'No Employees' : 'Mark Attendance'}
          </button>
          
          <button 
            type="button" 
            style={{
              padding: '10px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              minWidth: '100px',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setFormData({
              employeeId: '',
              employeeName: '',
              date: '',
              status: 'PRESENT'
            })}
            onMouseEnter={(e) => {
              e.target.style.background = '#5a6268';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#6c757d';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendanceForm;