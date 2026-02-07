from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
import uuid

app = FastAPI(title="HRMS Lite API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== MODELS ==========
class EmployeeBase(BaseModel):
    full_name: str
    email: str
    department: str

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int
    
    class Config:
        orm_mode = True

class AttendanceBase(BaseModel):
    employee_id: int
    date: date
    status: str

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: int
    employee_name: Optional[str] = None
    
    class Config:
        orm_mode = True

# ========== IN-MEMORY DATABASE ==========
# In production, use a real database like SQLite, PostgreSQL, etc.

# Employees storage
employees_db = []
next_employee_id = 1

# Attendance storage
attendance_db = []
next_attendance_id = 1

# ========== EMPLOYEE ENDPOINTS ==========

@app.get("/")
def read_root():
    return {
        "message": "HRMS Lite API",
        "version": "1.0.0",
        "endpoints": {
            "employees": "/employees",
            "attendance": "/attendance"
        }
    }

@app.get("/employees", response_model=List[Employee])
def get_employees():
    """Get all employees"""
    return employees_db

@app.get("/employees/{employee_id}", response_model=Employee)
def get_employee(employee_id: int):
    """Get a specific employee by ID"""
    for employee in employees_db:
        if employee["id"] == employee_id:
            return employee
    raise HTTPException(status_code=404, detail="Employee not found")

@app.post("/employees", response_model=Employee)
def create_employee(employee: EmployeeCreate):
    """Create a new employee"""
    global next_employee_id
    
    # Check if email already exists
    for emp in employees_db:
        if emp["email"] == employee.email:
            raise HTTPException(
                status_code=400, 
                detail="Email already exists"
            )
    
    new_employee = {
        "id": next_employee_id,
        "full_name": employee.full_name,
        "email": employee.email,
        "department": employee.department
    }
    
    employees_db.append(new_employee)
    next_employee_id += 1
    
    return new_employee

@app.put("/employees/{employee_id}", response_model=Employee)
def update_employee(employee_id: int, employee: EmployeeCreate):
    """Update an existing employee"""
    for emp in employees_db:
        if emp["id"] == employee_id:
            emp["full_name"] = employee.full_name
            emp["email"] = employee.email
            emp["department"] = employee.department
            return emp
    
    raise HTTPException(status_code=404, detail="Employee not found")

@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: int):
    """Delete an employee"""
    global employees_db
    
    for i, emp in enumerate(employees_db):
        if emp["id"] == employee_id:
            # Also delete related attendance records
            global attendance_db
            attendance_db = [att for att in attendance_db if att["employee_id"] != employee_id]
            
            employees_db.pop(i)
            return {"message": f"Employee {employee_id} deleted successfully"}
    
    raise HTTPException(status_code=404, detail="Employee not found")

# ========== ATTENDANCE ENDPOINTS ==========

@app.get("/attendance", response_model=List[Attendance])
def get_attendance():
    """Get all attendance records with employee names"""
    attendance_with_names = []
    
    for attendance in attendance_db:
        # Find employee name
        employee_name = "Unknown"
        for emp in employees_db:
            if emp["id"] == attendance["employee_id"]:
                employee_name = emp["full_name"]
                break
        
        attendance_with_names.append({
            **attendance,
            "employee_name": employee_name
        })
    
    return attendance_with_names

@app.get("/attendance/{attendance_id}", response_model=Attendance)
def get_attendance_record(attendance_id: int):
    """Get a specific attendance record"""
    for attendance in attendance_db:
        if attendance["id"] == attendance_id:
            # Find employee name
            employee_name = "Unknown"
            for emp in employees_db:
                if emp["id"] == attendance["employee_id"]:
                    employee_name = emp["full_name"]
                    break
            
            return {
                **attendance,
                "employee_name": employee_name
            }
    
    raise HTTPException(status_code=404, detail="Attendance record not found")

@app.post("/attendance", response_model=Attendance)
def create_attendance(attendance: AttendanceCreate):
    """Create a new attendance record"""
    global next_attendance_id
    
    # Check if employee exists
    employee_exists = False
    employee_name = "Unknown"
    for emp in employees_db:
        if emp["id"] == attendance.employee_id:
            employee_exists = True
            employee_name = emp["full_name"]
            break
    
    if not employee_exists:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check if attendance already marked for this employee on this date
    for att in attendance_db:
        if (att["employee_id"] == attendance.employee_id and 
            att["date"] == attendance.date):
            raise HTTPException(
                status_code=400, 
                detail=f"Attendance already marked for employee {attendance.employee_id} on {attendance.date}"
            )
    
    new_attendance = {
        "id": next_attendance_id,
        "employee_id": attendance.employee_id,
        "date": attendance.date,
        "status": attendance.status,
        "employee_name": employee_name
    }
    
    attendance_db.append(new_attendance)
    next_attendance_id += 1
    
    return new_attendance

@app.put("/attendance/{attendance_id}", response_model=Attendance)
def update_attendance(attendance_id: int, attendance: AttendanceCreate):
    """Update an attendance record"""
    for att in attendance_db:
        if att["id"] == attendance_id:
            # Check if employee exists
            employee_exists = False
            employee_name = "Unknown"
            for emp in employees_db:
                if emp["id"] == attendance.employee_id:
                    employee_exists = True
                    employee_name = emp["full_name"]
                    break
            
            if not employee_exists:
                raise HTTPException(status_code=404, detail="Employee not found")
            
            att["employee_id"] = attendance.employee_id
            att["date"] = attendance.date
            att["status"] = attendance.status
            att["employee_name"] = employee_name
            
            return att
    
    raise HTTPException(status_code=404, detail="Attendance record not found")

@app.delete("/attendance/{attendance_id}")
def delete_attendance(attendance_id: int):
    """Delete an attendance record"""
    global attendance_db
    
    for i, att in enumerate(attendance_db):
        if att["id"] == attendance_id:
            attendance_db.pop(i)
            return {"message": f"Attendance record {attendance_id} deleted successfully"}
    
    raise HTTPException(status_code=404, detail="Attendance record not found")

@app.get("/attendance/employee/{employee_id}", response_model=List[Attendance])
def get_employee_attendance(employee_id: int):
    """Get all attendance records for a specific employee"""
    # Check if employee exists
    employee_exists = False
    employee_name = "Unknown"
    for emp in employees_db:
        if emp["id"] == employee_id:
            employee_exists = True
            employee_name = emp["full_name"]
            break
    
    if not employee_exists:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    employee_attendance = []
    for att in attendance_db:
        if att["employee_id"] == employee_id:
            employee_attendance.append({
                **att,
                "employee_name": employee_name
            })
    
    return employee_attendance

@app.get("/attendance/date/{date_str}", response_model=List[Attendance])
def get_attendance_by_date(date_str: str):
    """Get all attendance records for a specific date"""
    try:
        target_date = date.fromisoformat(date_str)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    date_attendance = []
    for att in attendance_db:
        if att["date"] == target_date:
            # Find employee name
            employee_name = "Unknown"
            for emp in employees_db:
                if emp["id"] == att["employee_id"]:
                    employee_name = emp["full_name"]
                    break
            
            date_attendance.append({
                **att,
                "employee_name": employee_name
            })
    
    return date_attendance

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)