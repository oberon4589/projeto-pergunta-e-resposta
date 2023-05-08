const Sequelize = require('sequelize');
const connection = new Sequelize('guiaperguntas', 'root', 'oberon020303', { //nome do banco, usuario, senha
    host: 'localhost', //onde está hospedado
    dialect: 'mysql' //qual o tipo de banco que está sendo utilizado
});

module.exports = connection; //exportando a conexão para ser utilizada em outros arquivos