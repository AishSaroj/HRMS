from pydantic import BaseModel
from datetime import datetime

class EmployeeBase(BaseModel):
    name: str
    email: str
    department: str = "IT"

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int
    class Config:
        from_attributes = True

class AttendanceBase(BaseModel):
    employee_id: int
    status: str

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: int
    date: datetime
    class Config:
        from_attributes = True
