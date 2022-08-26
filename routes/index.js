var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const Link = require('../models/link');

<<<<<<< HEAD
const swaggerUI = require('swagger-ui-express');
YAML = require('yamljs');
const spec= YAML.load('./swagger.yaml');
router.use('/docs', swaggerUI.serve, swaggerUI.setup(spec));

// Busca url_encurtada no banco pelo id
router.post('/buscar', async (req, res, next) => {
  id = req.body.id;
  
  resultado = [];
=======
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Encurtador' });
});

/* Busca url_encurtada no banco pelo id */
router.get('/buscar/:id', async (req, res, next) => {
  id = req.params.id;
>>>>>>> 25ef6a78d1ecbaf1978cde5982351597aa5c8063
  resultado = await Link.findAll({ where: { id } });
  res.json(resultado[0] ? resultado[0].dataValues : [{'Mensagem': 'Nenhum registro encontrado.'}]);
});

/* Recebe como parametro post $data (dd/mm/yyyy) para listar as urls */
router.post('/buscardata', async (req, res, next) => {
  const Op = Sequelize.Op; 
  data_original = req.body.data;
  data = data_original.split('/').reverse().join('-');
  filtro = `%${data}%`;

  const startedDate = new Date(data + " 00:00:00");
  const endDate = new Date(data + " 20:59:59");

  resultado = await Link.findAll({where : {"createdAt" : {[Op.between] : [startedDate , endDate ]}}});
  res.json(resultado[0] ? resultado : [{'Mensagem': 'Nenhum registro encontrado.'}]);
});

/* Recebe como parametro post $url URL para encurtar */
router.post('/new', async (req, res, next) => {
  url_original = req.body.url;
  url_encurtada = generationUrl();

  resultado = await Link.create({
    url_encurtada,
    url_original
  });

  res.json(resultado ? resultado.dataValues : [{'Mensagem': 'Não foi possível gerar a URL.'}]);
});

/* Gera nova URL */
function generationUrl() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

module.exports = router;
