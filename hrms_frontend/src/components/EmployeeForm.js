import React, { useState } from 'react';

const EmployeeForm = ({ addEmployee }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    department: 'IT'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Employee ID validation
    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    } else if (!/^[A-Za-z0-9#\-_]+$/.test(formData.employeeId)) {
      newErrors.employeeId = 'Only letters, numbers, #, -, _ are allowed';
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add employee
      addEmployee(formData);
      
      // Reset form
      setFormData({
        employeeId: '',
        name: '',
        email: '',
        department: 'IT'
      });
      setErrors({});
      
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Support'];

  const styles = {
    container: {
      background: 'white',
      borderRadius: '8px',
      padding: '20px',
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
    input: {
      padding: '10px',
      border: '1px solid #ced4da',
      borderRadius: '6px',
      fontSize: '14px',
      fontFamily: 'inherit',
      width: '100%'
    },
    select: {
      padding: '10px',
      border: '1px solid #ced4da',
      borderRadius: '6px',
      fontSize: '14px',
      fontFamily: 'inherit',
      width: '100%',
      background: 'white'
    },
    errorText: {
      color: '#dc3545',
      fontSize: '12px',
      marginTop: '4px'
    },
    helperText: {
      fontSize: '12px',
      color: '#6c757d',
      marginTop: '4px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Add New Employee</h3>
        <p style={styles.subtitle}>Fill in employee details to add to the system</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Employee ID:</label>
            <input
              type="text"
              value={formData.employeeId}
              onChange={(e) => handleChange('employeeId', e.target.value)}
              placeholder="e.g., EMP001, #1"
              style={styles.input}
              required
            />
            {errors.employeeId && <div style={styles.errorText}>{errors.employeeId}</div>}
            <div style={styles.helperText}>Unique identifier for the employee</div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter employee's full name"
              style={styles.input}
              required
            />
            {errors.name && <div style={styles.errorText}>{errors.name}</div>}
            <div style={styles.helperText}>First and last name</div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="employee@company.com"
              style={styles.input}
              required
            />
            {errors.email && <div style={styles.errorText}>{errors.email}</div>}
            <div style={styles.helperText}>Valid email address</div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Department:</label>
            <select
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
              style={styles.select}
              required
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <div style={styles.helperText}>Select department</div>
          </div>
        </div>

        <button 
          type="submit" 
          style={{
            padding: '10px 24px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            minWidth: '160px',
            opacity: isSubmitting ? 0.7 : 1,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '10px'
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.target.style.background = '#0069d9';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,123,255,0.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.target.style.background = '#007bff';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div style={{
                display: 'inline-block',
                width: '14px',
                height: '14px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                borderTopColor: 'white',
                animation: 'spin 1s linear infinite'
              }}></div>
              Adding...
            </>
          ) : (
            'Add Employee'
          )}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;