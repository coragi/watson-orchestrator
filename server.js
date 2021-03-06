// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
require('dotenv').config();

// Get our API routes
const api = require('./server/routes/api');
const universidade = require('./server/routes/universidade');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist, unless STATIC_ROOT is informed
app.use(express.static(path.join(__dirname, process.env.STATIC_ROOT || 'dist')));

// Set our api routes
app.use('/api', api);
app.use('/universidade', universidade);

// Catch all other routes and return the index file
/*
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
*/

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`Watson Orchestrator running on localhost:${port}`));