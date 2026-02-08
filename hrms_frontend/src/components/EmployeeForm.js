import React, { useState } from "react";

const EmployeeForm = ({ addEmployee }) => {
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    department: "IT"
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(""); // <-- inline success message

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.employeeId) newErrors.employeeId = "Required";
    if (!formData.name) newErrors.name = "Required";
    if (!formData.email) newErrors.email = "Required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addEmployee(formData);
    setFormData({ employeeId: "", name: "", email: "", department: "IT" });

    // Show success message
    setMessage(`✅ Employee "${formData.name}" added successfully!`);
    setTimeout(() => setMessage(""), 3000); // disappear after 3 seconds
  };

  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ marginBottom: "15px", color: "#273c75" }}>Add Employee</h2>

      {/* Inline success message */}
      {message && <div style={{ marginBottom: "12px", color: "#27ae60", fontWeight: "600" }}>{message}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          placeholder="Employee ID"
          value={formData.employeeId}
          onChange={e => handleChange("employeeId", e.target.value)}
          style={inputStyle}
        />
        {errors.employeeId && <span style={errorStyle}>{errors.employeeId}</span>}

        <input
          placeholder="Full Name"
          value={formData.name}
          onChange={e => handleChange("name", e.target.value)}
          style={inputStyle}
        />
        {errors.name && <span style={errorStyle}>{errors.name}</span>}

        <input
          placeholder="Email"
          value={formData.email}
          onChange={e => handleChange("email", e.target.value)}
          style={inputStyle}
        />
        {errors.email && <span style={errorStyle}>{errors.email}</span>}

        <select value={formData.department} onChange={e => handleChange("department", e.target.value)} style={inputStyle}>
          {["IT", "HR", "Finance", "Marketing", "Sales"].map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <button type="submit" style={buttonStyle}>Add Employee</button>
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
  marginTop: "5px",
  transition: "all 0.2s"
};

const errorStyle = { color: "red", fontSize: "12px" };

export default EmployeeForm;