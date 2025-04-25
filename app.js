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
let url = 'mongodb://localhost:27017/agenda';

mongoose.connect(url)
    .then(() => {
        console.log('Conectado ao MongoDb');
    })
    .catch((e) => {
        console.log(e);
    });

    // Schema do Mongoose (modelo dos dados) com as validações
    var Usuario = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Nome é obrigatório'],
            trim: true, // Garante que não haja espaços em branco no início ou no final
            minlength: [3, 'Nome deve ter pelo menos 3 caracteres'],
        },
        email: {
            type: String,
            required: [true, 'Email é obrigatório'],
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido'],
        },
        celular: {
            type: String,
            required: [true, 'Celular é obrigatório'],
            trim: true,
            match: [/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Celular inválido'],
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
    
    try {
        const I = await new RefDoc({ name: nome, email: email, celular: celular });
        await I.validate(); // Adicionei o await para garantir que a validação seja concluída antes de salvar
        await I.save(); // Adiocionei o await pra arrumar o erro de não avisar que foi adionado
        res.send({ status: "adicionado" });
    // Validação do Back. Se o usuário tentar cadastrar com um e-mail ou celular inválido receberá um erro.   
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).send({ erro: errors.join(', ') });
        }
        res.status(500).send({ erro: 'Erro ao adicionar usuário' });
    }
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

    // Validações do Backend. Validar se o nome tem pelo menos 3 caracteres, celular e email são válidos.
    if (update.name && typeof update.name === 'string' && update.name.trim().length < 3) {
        return res.status(400).send({ erro: 'Nome deve ter pelo menos 3 caracteres' });
    }
    
    if (update.celular && !/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(update.celular)) {
        return res.status(400).send({ erro: 'Celular inválido' });
    }

    if (update.email && !/^\S+@\S+\.\S+$/.test(update.email)) {
        return res.status(400).send({ erro: 'Email inválido' });
    }

    try {
        // Precisei alterar pra findByIdAndUpdate para usar a validação do Mongoose
        const updatedUser = await RefDoc.findByIdAndUpdate({ _id: id }, update, { new: true, runValidators: true });
            if (updatedUser) {
                res.send({ status: "alterado", user: updatedUser });
            } else {
                res.send({ erro: 'erro' });
            }
        } catch (err) {
    res.status(500).send({ erro: 'Erro ao atualizar usuário' });
    }
});

// Inicialização do servidor
app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`Servidor esta rodando na porta ${url}`);
});