const express = require('express');
const router = express.Router();

var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var discovery = new DiscoveryV1({
  username: process.env.DISCOVERY_USER,
  password: process.env.DISCOVERY_PASS,
  version_date: '2017-04-27'
});


var context = {};
// var watson = require('watson-developer-cloud');
// var conversation = watson.conversation({
//   username: process.env.CONVERSATION_USER,
//   password: process.env.CONVERSATION_PASS,
//   version: 'v1',
//   version_date: '2017-05-26'
// });

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

//GET all posts
// router.get('/msgs', (req, res) => {
//   // Get posts from the mock api
//   // This should ideally be replaced with a service that connects to MongoDB
//   res.setHeader('Content-Type', 'application/json');
//   res.status(200).json({
//     'resultado': 'ok-msg',
//     'count': 2
//   });
// });

//router.get('/:codigo', function (req, res) { });

router.post('/conversation/:mensagem', (req, res, opts) => {
  var mensagem = req.params.mensagem;

  conversation.message({
    workspace_id: process.env.CONVERSATION_WORKSPACE,
    input: {
      'text': mensagem
    },
    context: context
  }, function (error, data) {
    context = data.context;
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
    //console.log(JSON.stringify(data, null, 2));
  });
});


router.get('/discovery/:termo', (req, res) => {
  var termo = req.params.termo;

  discovery.query({
      environment_id: process.env.DISCOVERY_ENVIRONMENT,
      collection_id: process.env.DISCOVERY_COLLECTION,
      query: termo,
      //return: 'text' //
    },
    function (error, data) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(data);
      //console.log(JSON.stringify(data, null, 2));
    });
});

module.exports = router;
