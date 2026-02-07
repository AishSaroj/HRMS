from flask import Flask, jsonify, request
from flask_cors import CORS
from database import SessionLocal, engine
from models import Employee, Attendance
import models
import datetime

# Create tables
models.Base.metadata.create_all(bind=engine)

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "HRMS API Running"})

# Employees Routes
@app.route('/api/employees', methods=['GET'])
def get_employees():
    db = SessionLocal()
    employees = db.query(Employee).all()
    db.close()
    return jsonify([{
        "id": e.id,
        "name": e.name, 
        "email": e.email,
        "department": e.department
    } for e in employees])

@app.route('/api/employees', methods=['POST'])
def create_employee():
    data = request.json
    db = SessionLocal()
    employee = Employee(
        name=data['name'],
        email=data['email'],
        department=data.get('department', 'IT')
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    db.close()
    return jsonify({
        "id": employee.id,
        "name": employee.name,
        "email": employee.email,
        "department": employee.department
    }), 201

# Attendance Routes  
@app.route('/api/attendance', methods=['GET'])
def get_attendance():
    db = SessionLocal()
    attendance = db.query(Attendance).all()
    db.close()
    return jsonify([{
        "id": a.id,
        "employee_id": a.employee_id,
        "date": a.date,
        "status": a.status
    } for a in attendance])

@app.route('/api/attendance', methods=['POST'])
def create_attendance():
    data = request.json
    db = SessionLocal()
    attendance = Attendance(
        employee_id=data['employee_id'],
        date=datetime.datetime.utcnow(),
        status=data['status']
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    db.close()
    return jsonify({
        "id": attendance.id,
        "employee_id": attendance.employee_id,
        "date": attendance.date,
        "status": attendance.status
    }), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)