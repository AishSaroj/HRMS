import React, { useState } from "react";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import AttendanceForm from "./components/AttendanceForm";
import AttendanceList from "./components/AttendanceList";

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [activeTab, setActiveTab] = useState("EmployeeList");

  const addEmployee = (employee) => {
    if (employees.find(e => e.employeeId === employee.employeeId)) {
      alert("Employee ID already exists!");
      return;
    }
    setEmployees(prev => [...prev, { ...employee, id: Date.now() }]);
  };

  const deleteEmployee = (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    setEmployees(prev => prev.filter(e => e.id !== id));
    setAttendanceRecords(prev => prev.filter(a => a.employeeId !== id));
  };

  const markAttendance = (record) => {
    setAttendanceRecords(prev => [...prev, record]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "EmployeeForm": return <EmployeeForm addEmployee={addEmployee} />;
      case "EmployeeList": return <EmployeeList employees={employees} deleteEmployee={deleteEmployee} />;
      case "AttendanceForm": return <AttendanceForm employees={employees} markAttendance={markAttendance} />;
      case "AttendanceList": return <AttendanceList employees={employees} attendanceRecords={attendanceRecords} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      {/* Sidebar */}
      <div style={{
        width: "220px",
        background: "#273c75",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        gap: "15px"
      }}>
        <h2 style={{ marginBottom: "30px", textAlign: "center" }}>HRMS Lite</h2>
        {["EmployeeList", "EmployeeForm", "AttendanceForm", "AttendanceList"].map(tab => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 15px",
              cursor: "pointer",
              borderRadius: "6px",
              background: activeTab === tab ? "#40739e" : "transparent",
              transition: "all 0.2s"
            }}
          >
            {tab === "EmployeeList" && "Employee List"}
            {tab === "EmployeeForm" && "Add Employee"}
            {tab === "AttendanceForm" && "Mark Attendance"}
            {tab === "AttendanceList" && "Attendance Records"}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px", background: "#f5f6fa" }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default App;