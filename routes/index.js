var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const Link = require('../models/link');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Encurtador' });
});

// Redireciona para URL original a URL encurtada recebida
router.get('/:url_encurtada', async (req, res, next) => {
  const url_encurtada = req.params.url_encurtada;
 
  const resultado = await Link.findOne({ where: { url_encurtada } });
  if (!resultado) return res.sendStatus(404);
 
  resultado.hits++;
  await resultado.save();
 
  res.redirect(resultado.url_original);
})

// Busca url_encurtada no banco pelo id
router.post('/buscar', async (req, res, next) => {
  id = req.body.id;
  
  resultado = [];
  resultado = await Link.findAll({ where: { id } });
  res.render('details', resultado[0] ? resultado[0].dataValues : []);
});

// Busca url_encurtadas no banco pela data
router.post('/buscardata', async (req, res, next) => {
  const Op = Sequelize.Op; 
  data_original = req.body.data;
  data = data_original.split('/').reverse().join('-');
  filtro = `%${data}%`;

  const startedDate = new Date(data + " 00:00:00");
  const endDate = new Date(data + " 20:59:59");

  resultado = [];
  resultado = await Link.findAll({where : {"createdAt" : {[Op.between] : [startedDate , endDate ]}}});
  res.render('list', resultado.dataValues);
});

/* Gera nova URL */
function generationUrl() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

/* Recebe como parametro post $url URL para encurtar */
router.post('/new', async (req, res, next) => {
  url_original = req.body.url;
  url_encurtada = generationUrl();

  resultado = await Link.create({
    url_encurtada,
    url_original
  });

  res.render('stats', resultado.dataValues);
});

module.exports = router;
