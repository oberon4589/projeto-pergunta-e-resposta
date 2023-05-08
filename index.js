const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database"); //importando a conexão com o banco de dados
const Pergunta = require("./database/Pergunta"); //importando o model de perguntas
const Resposta = require("./database/Resposta"); //importando o model de respostas

//database
connection.authenticate()
.then(() => {
    console.log("Conexão feita com o banco de dados!");
})
.catch((msgErro) => {
    console.log(msgErro);
}); //autentica a conexão com o banco de dados
    //caso a conexão seja bem sucedida, ele vai executar o then, caso contrário, ele vai executar o catch


//configurações
app.set('view engine', 'ejs');//estou dizendo para o express usar o ejs como view engine
app.use(express.static('public')); //serve para usar arquivos estaticos como css, js e imagens
app.use(bodyParser.urlencoded({extended: false})); //comando que permite que os dados do formulário sejam enviados para o servidor
app.use(bodyParser.json()); //permite que os dados do formulário sejam enviados para o servidor em formato json, só é utilizado quando tiver trabalhando com API

//rotas
app.get("/", (req, res) => {
    Pergunta.findAll({ raw: true, order:[
        ['id', 'DESC'] //faz com que as perguntas sejam ordenadas de forma decrescente utilziando o id e após a virgula, o tipo de ordenação. Equivalente ao order by
    ] }).then(perguntas => {    //equivalente ao select * from perguntas
        res.render("index", {
            perguntas: perguntas
        });
    });
});     // aqui os dados são enviados para o front-end através do render, assim criando uma variável "perguntas" que recebe os dados do banco de dados. 
        //Esta rota pesquisa todas as perguntas e as envia para o front-end

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req,res) => { //tipo post porque ele vai receber os dados do formulário
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Pergunta.create( {  //cria uma pergunta no banco de dados, sintaxe equivalente ao insert into
        titulo: titulo,
        descricao: descricao
    }).then (() => {
        res.redirect("/"); //redireciona para a página inicial
    });
});

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Pergunta.findOne ({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){
            Resposta.findAll({  //pesquisa todas as respostas que tem o id da pergunta
                where: {perguntaId: pergunta.id}, //pesquisa todas as respostas que tem o id da pergunta
                order: [ 
                    ['id','DESC'] //ordena as respostas de forma decrescente
                ]
            }).then(respostas => {
                res.render("pergunta", { //renderiza a página de resposta com os dados da pergunta
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        }else {
            res.redirect ("/"); //caso a pergunta não exista, ele redireciona para a página inicial
        };
    });
});

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId); //redireciona para a página de resposta
    });
}); 


app.listen(8181,() => {
    console.log("Servidor rodando na porta 8181");
});