cat > hrms_backend/main.py << 'EOF'
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import schemas
from typing import List

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "HRMS API is running"}

# Employee endpoints
@app.get("/api/employees", response_model=List[schemas.Employee])
def get_employees(db: Session = Depends(get_db)):
    employees = db.query(models.Employee).all()
    return employees

@app.post("/api/employees", response_model=schemas.Employee)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = models.Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

# Attendance endpoints
@app.get("/api/attendance", response_model=List[schemas.Attendance])
def get_attendance(db: Session = Depends(get_db)):
    attendance = db.query(models.Attendance).all()
    return attendance

@app.post("/api/attendance", response_model=schemas.Attendance)
def create_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    db_attendance = models.Attendance(**attendance.dict())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}
EOF