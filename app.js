const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');





const app = express();
const port = 3000;


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors());


//https://expressjs.com/en/resources/middleware/body-parser.html
app.use(bodyParser.json())
app.use(bodyParser.urlencoded(true))



//https://expressjs.com/en/resources/middleware/method-override.htmlnpm
app.use(methodOverride('X-HTTP-Method'))
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('X-Method-Override'));
app.use(methodOverride('_method'));



// conexao
let url = 'mongodb://localhost:27017/livro';

mongoose.connect(url)
    .then(
        () => { console.log('Conecatado ao MongoDb') }
    ).catch(
        (e) => { console.log(e) }
    )
//shema
var Usuario = new mongoose.Schema({
    name: String,
    email: String
});

// criar o model
const RefDoc = new mongoose.model('Usuarios', Usuario);




// rota 

// exibir
app.get("/", async (req, res) => {
    const users = await RefDoc.find({});
    res.json(users);
});

// inserir
app.post("/add", async (req, res) => {

    let nome = req.body.name;
    let email = req.body.email;
    const I = await new RefDoc({ name: nome , email: email});
    I.save();
    res.send({ status: "adicionado" });
});

// deletar

app.delete("/delete/:id", async (req, res) => {
    let id = req.params.id;
    let i = await RefDoc.findByIdAndDelete(id);
    if (i) {
        res.send({ status: "deletado" });
    } else {
        res.send({ erro: 'erro' });
    }
});


// 
app.put('/put_update/:id', async(req, res)=>{
    const id = req.params.id;
    const update = req.body;

    const updatedUser = await RefDoc.findByIdAndUpdate( id, update);
    if (updatedUser) {
        res.send({ status: "alterado" });
    } else {
        res.send({ erro: 'erro' });
    }

});




// atualizar campos espeficios
app.patch('/update/:id', async (req, res) => {
    const { id } = req.params;
    const update = req.body;
    //             // filtro, altera   
    // .updateOne({ _id: id }, updateData);
    const updatedUser = await RefDoc.updateOne({ _id: id }, update);
    if (updatedUser) {
        res.send({ status: "alterado" });
    } else {
        res.send({ erro: 'erro' });
    }


//       if (updatedUser.modifiedCount === 0) {
//         return res.status(404).send('User not found or no changes made');
//       }
//       res.status(200).send('User updated successfully');
//     } catch (err) {
//       res.status(500).send('Error updating user');
//     }
//   }
})





app.listen(port, () => {
    console.log(`Example  app listening port ${port}`)

});