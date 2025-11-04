# medfei

Aplicativo full-stack para agendamento de consultas médicas, utilizando React Native (Expo) para o frontend e Python (Flask) para o backend.

## Stack de Tecnologias

* **Frontend:** React Native (Expo)
    * Expo Router (Navegação)
    * Axios (Cliente HTTP)
    * React Context (Gerenciamento de Estado de Autenticação)
* **Backend:** Python
    * Flask (Servidor de API)
    * Flask-SQLAlchemy (ORM)
    * Flask-Migrate (Migrações de Banco de Dados)
    * Flask-JWT-Extended (Autenticação por Token JWT)
* **Banco de Dados (Desenvolvimento):** SQLite

---

## Pré-requisitos

Para executar este projeto, os seguintes componentes de software são necessários:

* [Git](https://git-scm.com/)
* [Python](https://www.python.org/downloads/) (versão 3.8 ou superior)
* [Node.js (LTS)](https://nodejs.org/en/) (que inclui `npm`)
* O aplicativo **Expo Go** em um dispositivo móvel (iOS ou Android) para testes nativos.

---

## Instalação e Configuração

### 1. Configuração do Backend (Flask)

1.  Acesse o diretório do backend:
    ```bash
    cd backend
    ```

2.  Crie o ambiente virtual:
    ```bash
    python -m venv venv
    ```

3.  Ative o ambiente virtual:
    ```bash
    # No Windows (PowerShell)
    .\venv\Scripts\activate
    
    # No Mac/Linux
    source venv/bin/activate
    ```

4.  Instale as dependências do Python:
    ```bash
    pip install -r requirements.txt
    ```

5.  Defina a variável de ambiente `FLASK_APP` para habilitar os comandos de banco de dados:
    ```powershell
    # No Windows (PowerShell)
    $env:FLASK_APP = "app.py"

    # No Mac/Linux
    export FLASK_APP="app.py"
    ```

6.  **Migre o banco de dados** para criar o arquivo `project.db` e suas tabelas:
    ```bash
    flask db upgrade
    ```

7.  **Popule (seed)** o banco com dados de teste (médicos, usuários, etc.):
    ```bash
    flask seed_db_doctors
    ```
    *(Nota: O nome exato deste comando está definido no `app.py` em `@app.cli.command(...)`)*

### 2. Configuração do Frontend (Expo)

1.  Em um **novo terminal**, acesse o diretório do frontend:
    ```bash
    cd medfei/frontend
    ```

2.  Instale as dependências do JavaScript:
    ```bash
    npm install
    ```

---

## Como Executar

#### 1. Servidor Backend (Terminal 1)

1.  Navegue até o diretório `backend/` e ative o `venv`.
2.  Defina a variável `FLASK_APP` (se for uma nova sessão de terminal).
3.  Inicie o servidor Flask:
    ```bash
    python app.py
    ```
*O servidor de API estará em execução na porta 5000.*

#### 2. Servidor Frontend (Terminal 2)

1.  Navegue até o diretório `frontend/`.
2.  Inicie o servidor Expo (recomenda-se limpar o cache na primeira vez):
    ```bash
    npx expo start --clear
    ```

#### 3. Acessando o Aplicativo

* **Para Teste Mobile (Expo Go):**
    1.  Certifique-se de que seu dispositivo móvel esteja na mesma rede Wi-Fi que o computador.
    2.  Abra o app Expo Go e escaneie o QR Code exibido no terminal.

* **Para Teste Web:**
    1.  Pressione `w` no terminal do Expo.
    2.  O aplicativo será aberto no seu navegador padrão (ex: `http://localhost:8081`).