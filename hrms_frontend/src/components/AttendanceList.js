import React, { useState, useEffect } from 'react';

const AttendanceList = ({ attendanceRecords, deleteAttendance, employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [filteredRecords, setFilteredRecords] = useState(attendanceRecords);
  const [uniqueDates, setUniqueDates] = useState([]);

  // Get unique dates from records
  useEffect(() => {
    const dates = [...new Set(attendanceRecords.map(item => item.date))].sort((a, b) => new Date(b) - new Date(a));
    setUniqueDates(dates);
  }, [attendanceRecords]);

  // Apply filters
  useEffect(() => {
    let filtered = attendanceRecords;
    
    if (selectedEmployee !== 'all') {
      filtered = filtered.filter(record => record.employeeName === selectedEmployee);
    }
    
    if (selectedDate !== 'all') {
      filtered = filtered.filter(record => record.date === selectedDate);
    }
    
    setFilteredRecords(filtered);
  }, [selectedEmployee, selectedDate, attendanceRecords]);

  // Calculate statistics
  const presentCount = filteredRecords.filter(item => item.status === 'PRESENT').length;
  const absentCount = filteredRecords.filter(item => item.status === 'ABSENT').length;
  const totalCount = filteredRecords.length;

  // Get employee statistics
  const employeeStats = employees.map(emp => {
    const empRecords = attendanceRecords.filter(r => r.employeeName === emp.name);
    const present = empRecords.filter(r => r.status === 'PRESENT').length;
    const total = empRecords.length;
    return {
      name: emp.name,
      present,
      total,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0
    };
  });

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
    statsContainer: {
      display: 'flex',
      gap: '16px'
    },
    statBadge: {
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
      alignItems: 'flex-end'
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    filterLabel: {
      fontWeight: '600',
      color: '#495057',
      fontSize: '14px'
    },
    select: {
      padding: '10px',
      border: '1px solid #ced4da',
      borderRadius: '6px',
      fontSize: '14px',
      minWidth: '200px',
      background: 'white'
    },
    clearBtn: {
      padding: '10px 20px',
      background: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600'
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    },
    statCard: {
      padding: '20px',
      borderRadius: '8px',
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '8px'
    },
    statLabel: {
      fontSize: '14px',
      color: '#6c757d',
      textTransform: 'uppercase',
      letterSpacing: '1px'
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
    statusBadge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      display: 'inline-block'
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
    employeeStats: {
      marginTop: '24px',
      padding: '20px',
      background: '#f8f9fa',
      borderRadius: '8px'
    },
    employeeStatsTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#495057'
    },
    employeeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '12px'
    },
    employeeStatCard: {
      padding: '12px',
      background: 'white',
      borderRadius: '6px',
      border: '1px solid #e9ecef'
    },
    noData: {
      textAlign: 'center',
      padding: '40px',
      color: '#6c757d',
      fontStyle: 'italic'
    },
    activeFilter: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: '#e7f3ff',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      marginTop: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Attendance Records</h3>
        <div style={styles.statsContainer}>
          <div style={{...styles.statBadge, background: '#28a745', color: 'white'}}>
            Present: {presentCount}
          </div>
          <div style={{...styles.statBadge, background: '#dc3545', color: 'white'}}>
            Absent: {absentCount}
          </div>
          <div style={{...styles.statBadge, background: '#007bff', color: 'white'}}>
            Total: {totalCount}
          </div>
        </div>
      </div>

      <div style={styles.filters}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Filter by Employee</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Employees</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee.name}>
                {employee.name} ({employee.employeeId})
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Filter by Date</label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Dates</option>
            {uniqueDates.map((date, index) => (
              <option key={index} value={date}>
                {new Date(date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </option>
            ))}
          </select>
        </div>

        {(selectedEmployee !== 'all' || selectedDate !== 'all') && (
          <button 
            style={styles.clearBtn}
            onClick={() => {
              setSelectedEmployee('all');
              setSelectedDate('all');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Active filters display */}
      {(selectedEmployee !== 'all' || selectedDate !== 'all') && (
        <div style={{marginBottom: '16px'}}>
          Active filters:
          {selectedEmployee !== 'all' && (
            <div style={styles.activeFilter}>
              Employee: <strong>{selectedEmployee}</strong>
              <button 
                onClick={() => setSelectedEmployee('all')}
                style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer'}}
              >
                ×
              </button>
            </div>
          )}
          {selectedDate !== 'all' && (
            <div style={styles.activeFilter}>
              Date: <strong>{new Date(selectedDate).toLocaleDateString()}</strong>
              <button 
                onClick={() => setSelectedDate('all')}
                style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer'}}
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}

      <div style={styles.stats}>
        <div style={{...styles.statCard, background: '#d4edda'}}>
          <div style={{...styles.statNumber, color: '#155724'}}>{presentCount}</div>
          <div style={styles.statLabel}>Present</div>
        </div>
        <div style={{...styles.statCard, background: '#f8d7da'}}>
          <div style={{...styles.statNumber, color: '#721c24'}}>{absentCount}</div>
          <div style={styles.statLabel}>Absent</div>
        </div>
        <div style={{...styles.statCard, background: '#d1ecf1'}}>
          <div style={{...styles.statNumber, color: '#0c5460'}}>{totalCount}</div>
          <div style={styles.statLabel}>Total Records</div>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Employee ID</th>
              <th style={styles.th}>Employee Name</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Status</th>
              {/* Removed Actions column */}
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.noData}>
                  No attendance records found {selectedEmployee !== 'all' ? `for ${selectedEmployee}` : ''} 
                  {selectedDate !== 'all' ? ` on ${new Date(selectedDate).toLocaleDateString()}` : ''}
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr key={record._id}>
                  <td style={styles.td}>
                    <code style={{background: '#f8f9fa', padding: '4px 8px', borderRadius: '4px'}}>
                      {record.employeeId}
                    </code>
                  </td>
                  <td style={styles.td}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#007bff',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600'
                      }}>
                        {record.employeeName.charAt(0)}
                      </div>
                      <div>
                        <div style={{fontWeight: '600'}}>{record.employeeName}</div>
                        <div style={{fontSize: '12px', color: '#6c757d'}}>
                          {employees.find(e => e.name === record.employeeName)?.department || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={{fontWeight: '500'}}>
                      {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div style={{fontSize: '12px', color: '#6c757d'}}>
                      {new Date(record.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      background: record.status === 'PRESENT' ? '#d4edda' : '#f8d7da',
                      color: record.status === 'PRESENT' ? '#155724' : '#721c24'
                    }}>
                      {record.status}
                    </span>
                  </td>
                  {/* Removed Actions cell */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.summary}>
        <div>
          Showing <strong>{filteredRecords.length}</strong> of <strong>{attendanceRecords.length}</strong> records
          {selectedEmployee !== 'all' && ` for ${selectedEmployee}`}
          {selectedDate !== 'all' && ` on ${new Date(selectedDate).toLocaleDateString()}`}
        </div>
        <div style={{display: 'flex', gap: '24px'}}>
          <div>Present: <strong style={{color: '#28a745'}}>{presentCount}</strong></div>
          <div>Absent: <strong style={{color: '#dc3545'}}>{absentCount}</strong></div>
          <div>Total: <strong style={{color: '#007bff'}}>{totalCount}</strong></div>
        </div>
      </div>

      {/* Employee Statistics */}
      <div style={styles.employeeStats}>
        <div style={styles.employeeStatsTitle}>Employee Attendance Summary</div>
        <div style={styles.employeeGrid}>
          {employeeStats.map((stat) => (
            <div key={stat.name} style={styles.employeeStatCard}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <div style={{fontWeight: '600'}}>{stat.name}</div>
                <div style={{
                  background: stat.percentage >= 80 ? '#d4edda' : stat.percentage >= 60 ? '#fff3cd' : '#f8d7da',
                  color: stat.percentage >= 80 ? '#155724' : stat.percentage >= 60 ? '#856404' : '#721c24',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {stat.percentage}%
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6c757d'}}>
                <div>Present: <strong>{stat.present}</strong></div>
                <div>Total: <strong>{stat.total}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;