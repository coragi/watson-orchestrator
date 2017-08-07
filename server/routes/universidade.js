'use strict'

const express = require('express');
const router = express.Router();

router.get('/video/*', (req, res) => {
	
	let caminho = req.params[0];
	console.info('Video no caminho ' + caminho);
	
});

module.exports = router;