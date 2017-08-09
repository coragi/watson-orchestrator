const express = require('express');
const router = express.Router();

var removeDiacritics = require('./diacritics');

// Permite o acesso de qualquer lugar
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


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
  router.get('/discovery/:collection?', (req, res) => {
	  	 
    //texto que serah pesquisado
    //front-end deve montar a pesquisa com as regras da API do Discovery
    //usando a funcao removeDiacritics para remover acentos
    var termo = removeDiacritics(req.query.q || req.query.query);	
	
	// Qual collection do Discovery será pesquisado
    var colecao = req.params.collection;	
	
	console.info('Discovery',  {termo: termo, colecao: colecao});

	// DISCOVERY_[colecao_]_ENVIRONMENT / DISCOVERY_[colecao_]_COLLECTION
	prefixoEnv = 'DISCOVERY_' + (colecao ? colecao.toUpperCase() + '_' : '');
	var dadoColecao = {
        environment_id: process.env[prefixoEnv + 'ENVIRONMENT'],
        collection_id: process.env[prefixoEnv + 'COLLECTION'],
	};

    discovery.query({
        environment_id: dadoColecao.environment_id,
        collection_id: dadoColecao.collection_id,
        query: termo,
		count: req.query.count || 3,
        //return: 'text' //apesar de poder colocar qual parte serah retornada
        //isso eh algo que o front-end manda. entao sempre vai retornar tudo
      },
      function (error, data) {
        if (error) {
			console.error('Conversation error', error);
			res.status(500).send('Error communicating with the Discovery service.');
			return;
        }
		  
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
  router.post('/conversation/:workspace?', (req, res, opts) => {
	  
	// Qual Workspace do Conversation será pesquisado
    var workspace = req.params.workspace;	

	console.log('Conversa', workspace, req.body);

	// DISCOVERY_[colecao_]_ENVIRONMENT / DISCOVERY_[colecao_]_COLLECTION
	var workspaceEnv = 'CONVERSATION_' + (workspace ? workspace.toUpperCase() + '_' : '') + 'WORKSPACE';
	var workspace_id = process.env[workspaceEnv];
	
	console.log('Workspace', {env: workspaceEnv, id: workspace_id});

    //mensagem enviada pelo usuario
    var mensagem = req.body.input.text;
    var ctxt = req.body.context;
    //envia a mensagem para o watson  
    conversation.message({
      workspace_id: workspace_id,
      input: {
        'text': mensagem
      },
      context: ctxt
    }, function (error, data) {
      //ao receber a resposta, seta o contexto

      //O CONTEXTO DEVE SER SETADO AQUI OU NO FRONT-END
      //PQ PODE EXISTIR A NECESSIDADE DE MODIFICAR VARIAVEIS DO CONTEXTO

	  if (error) {
		  console.error('Conversation error', error);
		  res.status(500).send('Error communicating with the conversation service.');
		  return;
	  }

      //monta o cabecalho e envia a resposta
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
	  
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
