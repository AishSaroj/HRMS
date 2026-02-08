import React, { useState } from "react";

const EmployeeList = ({ employees, deleteEmployee }) => {
  const [search, setSearch] = useState("");

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.employeeId.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>Employee List</h2>
      <input
        type="text"
        placeholder="Search by Name, ID, Email or Department"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={searchStyle}
      />

      {filteredEmployees.length === 0 ? <p>No employees found.</p> :
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.employeeId}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>
                  <button onClick={() => deleteEmployee(emp.id)} style={deleteBtnStyle}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
};

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
};

const titleStyle = { marginBottom: "15px", color: "#273c75" };

const searchStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "20px",
  borderRadius: "6px",
  border: "1px solid #dcdde1",
  fontSize: "14px"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left"
};

const deleteBtnStyle = {
  padding: "5px 10px",
  background: "#e84118",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default EmployeeList;