from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
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
    username = db.Column(db.String(80), unique=True, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username
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
    

# rota pra adicionar um usuario
@app.route("/api/users", methods=['POST'])
def add_user():

    data = request.json # recebe o json do frontend e transforma em dict
    new_user = User(username=data['username'])
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify(message="Usuário cadastrado"), 201 # codigo 201 "Created"

# rota pra listar usuarios
@app.route("/api/users", methods=['GET'])
def get_users():

    users_from_db = db.session.execute(db.select(User)).scalars()
    users_list = [user.to_dict() for user in users_from_db]

    return jsonify(users=users_list)


# rota de teste
@app.route("/api/hello")
def hello_word():
    return jsonify(message="Flask!")



# rodando o servidor
if __name__ == "__main__":
    # o host é '0.0.0.0' pra permitir acesso externo (como o celular)
    app.run(debug=True, host='0.0.0.0', port=5000)