const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware para habilitar CORS (permite requisições de qualquer origem)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors());

// Body Parser - para interpretar requisições com corpo JSON ou formulário
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(true));

// Method Override - permite utilizar outros métodos HTTP via headers ou query (_method)
app.use(methodOverride('X-HTTP-Method'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('X-Method-Override'));
app.use(methodOverride('_method'));

// Conexão com o MongoDB
let url = 'mongodb://localhost:27017/';

mongoose.connect(url)
    .then(() => {
        console.log('Conectado ao MongoDb');
    })
    .catch((e) => {
        console.log(e);
    });

// Schema do Mongoose (modelo dos dados)
var Usuario = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: /^\S+@\S+\.\S+$/, // validação básica de email
    },
    celular: {
        type: String,
        required: true,
        match: /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, // Regex simples para (xx) xxxxx-xxxx
    }
});

// Model baseado no schema acima
const RefDoc = new mongoose.model('Usuarios', Usuario);

// Rotas

// Rota principal - listar todos os usuários
app.get("/", async (req, res) => {
    const users = await RefDoc.find({});
    res.json(users);
});

// Rota para adicionar novo usuário
app.post("/add", async (req, res) => {
    let nome = req.body.name;
    let email = req.body.email;
    let celular = req.body.celular;
    const I = await new RefDoc({ name: nome, email: email, celular: celular });
    await I.save(); // Adiocionei o await pra arrumar o erro de não avisar que foi adionado
    res.send({ status: "adicionado" });
});

// Rota para deletar um usuário pelo ID
app.delete("/delete/:id", async (req, res) => {
    let id = req.params.id;
    let i = await RefDoc.findByIdAndDelete(id);
    if (i) {
        res.send({ status: "deletado" });
    } else {
        res.send({ erro: 'erro' });
    }
});

// Rota para atualizar (PUT) - substitui o documento inteiro
app.put('/put_update/:id', async (req, res) => {
    const id = req.params.id;
    const update = req.body;

    const updatedUser = await RefDoc.findByIdAndUpdate(id, update);
    if (updatedUser) {
        res.send({ status: "alterado" });
    } else {
        res.send({ erro: 'erro' });
    }
});

// Rota para atualizar parcialmente (PATCH)
app.patch('/update/:id', async (req, res) => {
    const { id } = req.params;
    const update = req.body;

    const updatedUser = await RefDoc.updateOne({ _id: id }, update);
    if (updatedUser) {
        res.send({ status: "alterado" });
    } else {
        res.send({ erro: 'erro' });
    }
});

// Inicialização do servidor
app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`Servidor esta rodando na porta ${url}`);
});