'use strict'

const express = require('express');
const router = express.Router();

const request = require('request');

const CAMINHO_BASE = 'http://universidadeats.com.br/pluginfile.php/';

router.get('/video/*', (req, res) => {
	
	let caminho = req.params[0];
	console.info('Video no caminho ' + caminho);
	
	let caminhoCompleto = CAMINHO_BASE + caminho;
	request.get(caminhoCompleto, {
		auth: {
			user: process.env.UNIVERSIDADE_USER,
			pass: process.env.UNIVERSIDADE_PASS
		}
	}).pipe(res);
});

module.exports = router;