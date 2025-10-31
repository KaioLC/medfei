from flask import Flask, jsonify
from flask_cors import CORS

# configurando o app
app = Flask(__name__)

# configurando o CORS para permitir requisições de qualquer origem
CORS(app)


@app.route("/api/hello")

def hello_word():
    return jsonify(message="Flask!")

# rodando o servidor
if __name__ == "__main__":
    # o host é '0.0.0.0' pra permitir acesso externo (como o celular)
    app.run(debug=True, host='0.0.0.0', port=5000)