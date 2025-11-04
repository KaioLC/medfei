from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import distinct
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash # criptografar as senhas
from datetime import datetime, timezone, timedelta
from validate_docbr import CPF # validar CPF
from email_validator import validate_email, EmailNotValidError # validar email
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity # criar token de acesso JWT
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

migrate = Migrate(app, db) # inicializa o Flask-Migrate


# configurando o JWT
app.config["JWT_SECRET_KEY"] = "aquario-douradinho-medfei-2025-atualizada" # acess secret key
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8) # token expira em 8 horas

jwt = JWTManager(app) # gerenciador do JWT

# callback de erros do jwt

@jwt.invalid_token_loader
def invalid_token_callback(error_string):
    """Callback para quando um token é inválido (mal formatado, assinatura errada, etc)"""
    print(f" ERRO DE TOKEN INVALIDO: {error_string} ")
    return jsonify(message=f"token é inválido: {error_string}"), 422

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    """Callback para quando um token já expirou"""
    print(" ERRO DE TOKEN EXPIRADO:")
    return jsonify(message="Seu token expirou. Por favor, faça login novamente."), 422

@jwt.unauthorized_loader
def unauthorized_callback(reason):
    """Callback para quando o header 'Authorization' está faltando"""
    print(f" ERRO DE AUTORIZACAO FALTANDO:  {reason} ---")
    return jsonify(message="Requisição não autorizada. Token de acesso está faltando."), 401


# definindo a tabela user
class User(db.Model):

    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    cpf = db.Column(db.String(20), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    appointments = db.relationship('Appointment', backref='user', lazy=True)

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
    crm = db.Column(db.Integer, unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    specialty = db.Column(db.String(120), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'specialty': self.specialty,
            'email': self.email,
            'crm': self.crm
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
            'appointment_date': self.appointment_date.isoformat(),
            'created_at': self.created_at.isoformat()
        }

# rota pra adicionar um usuario
@app.route("/api/register", methods=['POST'])
def register_user():

    data = request.json # recebe o json do frontend e transforma em dict
    username = data.get('username')
    password = data.get('password')
    cpf = data.get('cpf')
    email = data.get('email')
    
    # verificando se o usuario ta preenchido
    if not username or not password or not email or not cpf:
        return jsonify(message="Preencha todos os campos*"), 400 # 400 é codigo de bad request
    

    # validando o email dado
    try:
        valid_email_data = validate_email(email, check_deliverability=False)
        email = valid_email_data.normalized
    
    except EmailNotValidError as e: # email nao valido
        return jsonify(message=f"Email inválido: {str(e)}"), 400


    # validando o cpf dado
    cpf_validator = CPF()
    if not cpf_validator.validate(cpf):
        return jsonify(message="CPF inválido"), 400
    
    clean_cpf = "".join(filter(str.isdigit, cpf))

    # verificando se o usuario já existe
    existing_user = db.session.execute(
        db.select(User).filter_by(username=username)
    ).scalar_one_or_none()

    if existing_user:
        return jsonify(message="Usuário já cadastrado"), 409 # 409 é codigo de conflito
    
    existing_email = db.session.execute(
        db.select(User).filter_by(email=email)
    ).scalar_one_or_none()

    if existing_email:
        return jsonify(message="Email já cadastrado"), 409 # 409 é codigo de conflito
    
    existing_cpf = db.session.execute(
        db.select(User).filter_by(cpf=clean_cpf)
    ).scalar_one_or_none()

    if existing_cpf:
        return jsonify(message="CPF já cadastrado"), 409 # 409 é codigo de conflito

    hashed_password = generate_password_hash(password)

    new_user = User(
        username=username,
        email=data.get('email'),
        password_hash=hashed_password,
        cpf=clean_cpf
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
    cpf_attempt = data.get('cpf')
    password_attempt = data.get('password')

    # validando os campos preenchidos
    if not cpf_attempt or not password_attempt:
        return jsonify(message="Preencha todos os campos*"), 400
    
    clean_cpf = "".join(filter(str.isdigit, cpf_attempt))

    # buscando o usuario no banco de dados
    user = db.session.execute(
        db.select(User).filter_by(cpf=clean_cpf)
    ).scalar_one_or_none()

    # verificando se o usuario existe + senha correta
    if user and check_password_hash(user.password_hash, password_attempt):

        access_token = create_access_token(identity=str(user.id)) # criando token de acesso JWT
        return jsonify(access_token=access_token,user=user.to_dict(), message=f"Login bem-sucedido! Bem vindo {user.username}"), 200
    
    else:
        return jsonify(message="Usuário ou senha incorretos"), 401 # 401 é codigo de unauthorized

# rota pra listar os medicos
@app.route("/api/doctors", methods=['GET'])
def get_doctors():
    try:

        # verificado se o frontend enviou um filtro de especialidade
        specialty_filter = request.args.get('specialty')

        # debugando recebimento do filtro
        print(f"\n--- REQUISIÇÃO PARA /api/doctors ---")
        print(f"--- FILTRO DE ESPECIALIDADE RECEBIDO: '{specialty_filter}' ---")

        # fazendo a query no banco de dados
        query = db.select(Doctor)

        # se o filtro existir, aplicando ele na query
        if specialty_filter:
            print(specialty_filter)
            print("--- FILTRO ENCONTRADO! APLICANDO FILTRO... ---")
            
            query = query.filter_by(specialty=specialty_filter)

            print(query)

        else:
            print("--- NENHUM FILTRO APLICADO ---")

        # executando a query
        doctors_from_db = db.session.execute(query).scalars()
        doctors_list = [doctor.to_dict() for doctor in doctors_from_db]

        print(f"--- MÉDICOS ENCONTRADOS: {doctors_list} ---\n")


        return jsonify(doctors=doctors_list)
    except Exception as e:
        return jsonify(message=f"Erro ao buscar médicos: {str(e)}"), 500

# rota pra listar todas especialidades *unicas*
@app.route("/api/specialties", methods=['GET'])
def get_specialties():
    try:
        specialties_from_db = db.session.execute(
            db.select(distinct(Doctor.specialty))
            ).all()
        
        specialties_list = [specialty[0] for specialty in specialties_from_db]

        return jsonify(specialties=specialties_list)
    except Exception as e:
        return jsonify(message=f"Erro ao buscar especialidades: {str(e)}"), 500

# rota pra adicionar uma consulta
@app.route("/api/register_appointments", methods=['POST'])
@jwt_required() # rota protegida com token JWT
def add_appointment():

    current_user_id = get_jwt_identity()
    
    data = request.json
    doctor_id = data.get('doctor_id')
    start_time_str = data.get('start_time')

    if not doctor_id or not start_time_str:
        return jsonify(message="Médico e data/hora são obrigatórios."), 400

    try:
        start_time_obj = datetime.fromisoformat(start_time_str.replace('Z', '+00:00'))
    except ValueError:
        return jsonify(message="Formato de data inválido."), 400


    existing_appointment = db.session.execute(
        db.select(Appointment).filter_by(
            doctor_id=doctor_id,
            appointment_date=start_time_obj
        )
    ).scalar_one_or_none()

    if existing_appointment:
        return jsonify(message="Horário já agendado para este médico."), 409
    
    new_appointment = Appointment(
        appointment_date=start_time_obj,
        user_id=current_user_id,
        doctor_id=doctor_id
    )
    try:
        db.session.add(new_appointment)
        db.session.commit()
        return jsonify(message="Consulta agendada com sucesso!"), 201
    except Exception as e:
        db.session.rollback()
        return jsonify(message=f"Erro ao salvar no banco: {str(e)}"), 500

# listando consultas
@app.route("/api/appointments", methods=['GET'])
@jwt_required() # rota protegida com token JWT
def get_appointments():

    try:
        current_user_id = get_jwt_identity() # pega o id do usuario logado

    except Exception as e:
        return jsonify(message="Token inválido ou expirado"), 422 # 422 codigo de unprocessable entity
    
    user = db.session.get(User, current_user_id) # buscando todo o usuario  no banco de dados

    if not user:
        return jsonify(message="Usuário não encontrado"), 404 # 404 codigo de not found
    
    query = (
        db.select(Appointment, Doctor)
        .join(Doctor, Appointment.doctor_id == Doctor.id)
        .filter(Appointment.user_id == current_user_id)
        .order_by(Appointment.appointment_date.desc())
    )
    results = db.session.execute(query).all()
    
    appointment_list = []

    for (appointment, doctor) in results:

        appt_dict = appointment.to_dict()
        
        appt_dict['doctor_name'] = doctor.name
        appt_dict['doctor_specialty'] = doctor.specialty
        
        appointment_list.append(appt_dict)

    return jsonify(appointments=appointment_list), 200

# seeding medicos no banco de dados
@app.cli.command("seed_db_doctors")
def seed_db_doctors():

    print("Adicionando médicos ao banco de dados...")
    
    if db.session.execute(db.select(Doctor)).scalar_one_or_none() is None:
        doc1 = Doctor(name="Dr. Ana Silva", email="ana.silva@medfei.com", crm="123456-SP", specialty="Cardiologia")
        doc2 = Doctor(name="Dr. Bruno Costa", email="bruno.costa@medfei.com", crm="789012-SP", specialty="Dermatologia")
        doc3 = Doctor(name="Dr. Carla Dias", email="carla.dias@medfei.com", crm="345678-RJ", specialty="Pediatria")

        db.session.add_all([doc1, doc2, doc3])
        db.session.commit()
        print("Médicos adicionados com sucesso!")
    else:
        print("Já existem médicos no banco de dados.")



# rodando o servidor
if __name__ == "__main__":
    # o host é '0.0.0.0' pra permitir acesso externo (como o celular)
    app.run(debug=True, host='0.0.0.0', port=5000)