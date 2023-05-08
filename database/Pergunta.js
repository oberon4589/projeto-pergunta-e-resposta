const Sequelize = require('sequelize');
const connection = require('./database');

const Pergunta = connection.define('perguntas', { //define o model
    titulo: {
        type: Sequelize.STRING,
        allowNull: false //não permite que o campo seja nulo
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Pergunta.sync({force: false}).then(() => {
    console.log("Tabela criada com sucesso!")
}); //Força a criação da tabela, caso ela não exista

module.exports = Pergunta; //exportando o model para ser utilizado em outros arquivos