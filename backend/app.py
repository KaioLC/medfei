from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash # criptografar as senhas
from datetime import datetime, timezone
import os

# configurando o app
app = Flask(__name__)

# configurando o CORS para permitir requisições de qualquer origem
CORS(app)

# localização do banco de dados
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, 'project.db')

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}' # conectando com o banco de dados
db = SQLAlchemy(app) # inicializa o SQLAlchemy

# definindo a tabela user
class User(db.Model):

    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    cpf = db.Column(db.String(20), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)


    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'cpf': self.cpf
        }

# definindo a tabela doctor
class Doctor(db.Model):

    __tablename__ = 'doctors'
    id = db.Column(db.Integer, primary_key=True)
    crm = db.Column(db.Integer(20), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    specialty = db.Column(db.String(120), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'specialty': self.specialty
        }
    
class Appointment(db.Model):

    __tablename__ = 'appointments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    appointment_date = db.Column(db.DateTime(120), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'doctor_id': self.doctor_id,
            'appointment_date': self.appointment_date,
            'created_at': self.created_at
        }


# rota pra adicionar um usuario
@app.route("/api/users", methods=['POST'])
def add_user():

    data = request.json # recebe o json do frontend e transforma em dict
    username = data.get('username')
    password = data.get('password')
    
    # verificando se o usuario ta preenchido
    if not username or not password:
        return jsonify(message="Preencha todos os campos*"), 400 # 400 é codigo de bad request
    

    # verificando se o usuario já existe
    existing_user = User.query.filter_by(username=username).scalar_one_or_none()

    if existing_user:
        return jsonify(message="Usuário já cadastrado"), 409 # 409 é codigo de conflito
    
    hashed_password = generate_password_hash(password)

    new_user = User(
        username=username,
        email=data.get('email'),
        password_hash=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify(message="Usuário cadastrado"), 201 # codigo 201 "Created"

# rota pra listar usuarios
@app.route("/api/users", methods=['GET'])
def get_users():

    users_from_db = db.session.execute(db.select(User)).scalars()
    users_list = [user.to_dict() for user in users_from_db]

    return jsonify(users=users_list)

# rota para login de usuario
@app.route("/api/login", methods=['POST'])
def login_user():
    data = request.json
    username = data.get('username')
    password_attempt = data.get('password')

    # validando os campos preenchidos
    if not username or not password_attempt:
        return jsonify(message="Preencha todos os campos*"), 400
    
    # buscando o usuario no banco de dados
    user = db.session.execute(
        db.select(User).filter_by(username=username)
    ).scalar_one_or_none()

    # verificando se o usuario existe + senha correta
    if user and check_password_hash(user.password_hash, password_attempt):
        return jsonify(message=f"Login bem-sucedido! Bem vindo {user.username}"), 200
    else:
        return jsonify(message="Usuário ou senha incorretos"), 401 # 401 é codigo de unauthorized

# rota pra listar os medicos
@app.route("/api/doctors", methods=['GET'])
def get_doctors():

    doctors_from_db = db.session.execute(db.select(Doctor)).scalars()
    doctors_list = [doctor.to_dict() for doctor in doctors_from_db]

    return jsonify(doctors=doctors_list)

# rota pra adicionar um medico (implementar no hardcode)
@app.route("/api/doctors", methods=['POST'])
def add_doctor():

    data = request.json
    new_doctor = Doctor(
        crm=data['crm'],
        name=data['name'],
        specialty=data['specialty']
    )
    db.session.add(new_doctor)
    db.session.commit()

    return jsonify(message="Médico cadastrado"), 201

# rota pra adicionar uma consulta
@app.route("/api/appointments", methods=['POST'])
def add_appointment():

    data = request.json
    new_appointment = Appointment(
        user_id=data['user_id'],
        doctor_id=data['doctor_id'],
        appointment_date=data['appointment_date']
    )
    db.session.add(new_appointment)
    db.session.commit()

    return jsonify(message="Consulta agendada"), 201


# rota de teste
@app.route("/api/hello")
def hello_word():
    return jsonify(message="Flask!")



# rodando o servidor
if __name__ == "__main__":
    # o host é '0.0.0.0' pra permitir acesso externo (como o celular)
    app.run(debug=True, host='0.0.0.0', port=5000)