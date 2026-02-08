import React from "react";

const AttendanceList = ({ employees, attendanceRecords }) => {
  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === Number(id));
    return emp ? `${emp.name} (${emp.employeeId})` : "Unknown";
  };

  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      marginTop: "30px"
    }}>
      <h2 style={{ marginBottom: "15px", color: "#273c75" }}>Attendance Records</h2>
      {attendanceRecords.length === 0 ? <p>No attendance yet.</p> :
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((a, index) => (
              <tr key={index}>
                <td>{getEmployeeName(a.employeeId)}</td>
                <td>{a.date}</td>
                <td style={{ color: a.status === "Absent" ? "#e84118" : "#44bd32", fontWeight: "600" }}>
                  {a.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left"
};

export default AttendanceList;