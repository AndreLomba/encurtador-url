const Sequelize = require('sequelize');
const database = require('../db');
 
const Link = database.define('link', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    url_encurtada: {
        type: Sequelize.STRING,
        allowNull: false
    },
    url_original: {
        type: Sequelize.STRING,
        allowNull: false
    }
})
 
module.exports = Link;