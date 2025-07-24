from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
import pymysql
import math

# Cài đặt PyMySQL làm MySQLdb
pymysql.install_as_MySQLdb()

# Load biến môi trường
load_dotenv()

app = Flask(__name__)
CORS(app)

# Cấu hình database
DB_HOST = os.getenv('DB_HOST', 'mysql')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_USER = os.getenv('DB_USER', 'gptb2user')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'gptb2password')
DB_NAME = os.getenv('DB_NAME', 'gptb2_db')

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_secret_key_here')

db = SQLAlchemy(app)

# Model Equation
class Equation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    a = db.Column(db.Float, nullable=False)
    b = db.Column(db.Float, nullable=False)
    c = db.Column(db.Float, nullable=False)
    solution = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def to_dict(self):
        return {
            'id': self.id,
            'a': self.a,
            'b': self.b,
            'c': self.c,
            'solution': self.solution,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

def solve_quadratic(a, b, c):
    """Giải phương trình bậc 2: ax² + bx + c = 0"""
    if a == 0:
        if b == 0:
            if c == 0:
                return "Phương trình có vô số nghiệm"
            else:
                return "Phương trình vô nghiệm"
        else:
            x = -c / b
            return f"Phương trình bậc nhất có nghiệm x = {x:.4f}"
    
    # Tính delta
    delta = b * b - 4 * a * c
    
    if delta < 0:
        return "Phương trình vô nghiệm (delta < 0)"
    elif delta == 0:
        x = -b / (2 * a)
        return f"Phương trình có nghiệm kép x = {x:.4f}"
    else:
        x1 = (-b + math.sqrt(delta)) / (2 * a)
        x2 = (-b - math.sqrt(delta)) / (2 * a)
        return f"Phương trình có 2 nghiệm: x1 = {x1:.4f}, x2 = {x2:.4f}"

# API Routes
@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'pong'})

@app.route('/api/equation', methods=['POST'])
def add_equation():
    try:
        data = request.get_json()
        a = float(data.get('a', 0))
        b = float(data.get('b', 0))
        c = float(data.get('c', 0))
        
        # Giải phương trình
        solution = solve_quadratic(a, b, c)
        
        # Lưu vào database
        equation = Equation(a=a, b=b, c=c, solution=solution)
        db.session.add(equation)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'equation': equation.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/equations', methods=['GET'])
def get_equations():
    try:
        equations = Equation.query.order_by(Equation.created_at.desc()).all()
        return jsonify({
            'success': True,
            'equations': [eq.to_dict() for eq in equations]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/equation/<int:equation_id>', methods=['PUT'])
def update_equation(equation_id):
    try:
        equation = Equation.query.get_or_404(equation_id)
        data = request.get_json()
        
        a = float(data.get('a', equation.a))
        b = float(data.get('b', equation.b))
        c = float(data.get('c', equation.c))
        
        # Giải lại phương trình
        solution = solve_quadratic(a, b, c)
        
        # Cập nhật
        equation.a = a
        equation.b = b
        equation.c = c
        equation.solution = solution
        db.session.commit()
        
        return jsonify({
            'success': True,
            'equation': equation.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/equation/<int:equation_id>', methods=['DELETE'])
def delete_equation(equation_id):
    try:
        equation = Equation.query.get_or_404(equation_id)
        db.session.delete(equation)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Equation deleted successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Khởi tạo database


if __name__ == '__main__':
    print(f"DB Config: {DB_HOST}:{DB_PORT}/{DB_NAME} user={DB_USER}")
    
    # Tạo bảng nếu chưa có
    with app.app_context():
        db.create_all()
        print("Database tables created successfully")
    
    app.run(host='0.0.0.0', port=5000, debug=True)

