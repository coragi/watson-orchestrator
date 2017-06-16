const express = require('express');
const router = express.Router();


/* o ideal aqui eh colocar na tela a lista das APIs disponiveis nesse modulo */
router.get('/', (req, res) => {
  res.send('General Endpoint - It is working! It is a Christmas miracle!');
});


/* as variaveis abaixo soh sao inicializadas se
as respectivas flags forem habilitadas*/
var discovery;
var conversation;
var nlu;

if (process.env.DISCOVERY_FLAG == 'true') {
  var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
  discovery = new DiscoveryV1({
    username: process.env.DISCOVERY_USER,
    password: process.env.DISCOVERY_PASS,
    version_date: '2017-04-27'
  });

  //trata o endpoint do discovery
  router.get('/discovery/:termo', (req, res) => {

    //texto que serah pesquisado
    //front-end deve montar a pesquisa com as regras da API do Discovery
    var termo = req.params.termo;

    discovery.query({
        environment_id: process.env.DISCOVERY_ENVIRONMENT,
        collection_id: process.env.DISCOVERY_COLLECTION,
        query: termo,
        //return: 'text' //apesar de poder colocar qual parte serah retornada
        //isso eh algo que o front-end manda. entao sempre vai retornar tudo
      },
      function (error, data) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(data);
        //console.log(JSON.stringify(data, null, 2));
      });
  });


}

if (process.env.CONVERSATION_FLAG == 'true') {
  var watson = require('watson-developer-cloud');
  conversation = watson.conversation({
    username: process.env.CONVERSATION_USER,
    password: process.env.CONVERSATION_PASS,
    version: 'v1',
    version_date: '2017-05-26'
  });

  //trata o endpoint do conversation
  router.post('/conversation/:mensagem', (req, res, opts) => {

    //mensagem enviada pelo usuario
    var mensagem = req.params.mensagem;
    var ctxt = req.params.context; // NAO TESTEI AINDA
    //envia a mensagem para o watson  
    conversation.message({
      workspace_id: process.env.CONVERSATION_WORKSPACE,
      input: {
        'text': mensagem
      },
      context: ctxt
    }, function (error, data) {
      //ao receber a resposta, seta o contexto

      //O CONTEXTO DEVE SER SETADO AQUI OU NO FRONT-END
      //PQ PODE EXISTIR A NECESSIDADE DE MODIFICAR VARIAVEIS DO CONTEXTO

      //context = data.context;

      //monta o cabecalho e envia a resposta
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(data);
      //console.log(JSON.stringify(data, null, 2));
    });
  });


}

if (process.env.NLU_FLAG == 'true') {
  var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
  nlu = new NaturalLanguageUnderstandingV1({
    'username': process.env.NLU_USER,
    'password': process.env.NLU_PASS,
    'version_date': '2017-02-27'
  });


  //trata o endpoint do nlu
  router.get('/nlu/:texto', (req, res) => {
    //texto que serah analisado
    var texto = req.params.texto;

    //avaliar quais sao os parametros que o nlu recuperarah  
    var parameters = {
      'text': texto,
      'features': {
        'entities': {
          'model': process.env.NLU_MODEL, //TESTAR O QUE ACONTECE SE ESSE VALOR VIER VAZIO
          'limit': 10
        },
        'keywords': {
          'limit': 2
        }
      }
    }

    nlu.analyze(parameters, function (err, response) {
      // if (err)
      //   console.log('error:', err);
      // else
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(data);
      //console.log(JSON.stringify(response, null, 2));
    });
  });

}


module.exports = router;
