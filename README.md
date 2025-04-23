# Projeto REST com Node.js, Express e MongoDB - Aluna Laura Jane Antunes

Este é um projeto básico de API REST desenvolvido com **Node.js**, **Express** e **MongoDB** para aula de Programação de Dispositivos Móveis II do 5º semestre, do curso de DSM - Desenvolvimento de Software Multiplataforma, da Fatec de Votorantim. 
Permite realizar operações de **CRUD** (Create, Read, Update, Delete) em uma coleção de usuários.

---

## 🚀 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Body-parser](https://www.npmjs.com/package/body-parser)
- [Method-override](https://www.npmjs.com/package/method-override)
- [CORS](https://www.npmjs.com/package/cors)

---

## 📁 Estrutura

- `app.js` – Arquivo principal do servidor
- `package.json` – Gerenciador de dependências e scripts

---

## ⚙️ Como rodar o projeto

### Pré-requisitos

- Node.js e npm instalados
- MongoDB rodando localmente em `mongodb://localhost:27017/`

### Passos

1. Clone o repositório ou baixe os arquivos.

2. Instale as dependências:

   npm install

3. Inicie o servidor:

    npm start


📡 Rotas da API

GET /
Lista todos os usuários salvos no banco.

POST /add
Adiciona um novo usuário. Envie no body:

json
{
  "name": "Nome do usuário",
  "email": "email@exemplo.com"
}

DELETE /delete/:id
Remove um usuário pelo ID.

PUT /put_update/:id
Atualiza completamente um usuário pelo ID. Envie no body os novos dados.

PATCH /update/:id
Atualiza parcialmente os dados de um usuário pelo ID.


📄 Licença
Este projeto está sob a licença MIT.