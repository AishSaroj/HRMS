import React, { useState } from "react";

const AttendanceForm = ({ employees, markAttendance }) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [message, setMessage] = useState(""); // <-- inline success message

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmployeeId || !date) {
      alert("Select employee and date");
      return;
    }

    const employee = employees.find(e => e.id === Number(selectedEmployeeId));
    markAttendance({ employeeId: Number(selectedEmployeeId), date, status });

    // Show success message
    setMessage(`✅ Attendance marked for "${employee.name}"!`);
    setTimeout(() => setMessage(""), 3000); // disappear after 3 seconds

    setSelectedEmployeeId("");
    setDate("");
    setStatus("Present");
  };

  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ marginBottom: "15px", color: "#273c75" }}>Mark Attendance</h2>

      {/* Inline success message */}
      {message && <div style={{ marginBottom: "12px", color: "#27ae60", fontWeight: "600" }}>{message}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <select value={selectedEmployeeId} onChange={e => setSelectedEmployeeId(e.target.value)} style={inputStyle}>
          <option value="">Select Employee</option>
          {employees.map(e => (
            <option key={e.id} value={e.id}>{e.name} ({e.employeeId})</option>
          ))}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
        <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        <button type="submit" style={buttonStyle}>Mark</button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #dcdde1",
  fontSize: "14px"
};

const buttonStyle = {
  padding: "10px",
  background: "#273c75",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "all 0.2s"
};

export default AttendanceForm;