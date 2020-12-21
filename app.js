require('dotenv').config();

const express = require('express');

const history = require('connect-history-api-fallback');
const serveStatic = require('serve-static');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const db = require('./db/db');
const userAPI = require('./api/user.api');

const app = express();

db.sync();

app.use(history());
app.use(cookieParser());
app.use(serveStatic(__dirname + '/dist'));
app.use(compression());
app.use(bodyParser.json());
app.use(userAPI);


const PORT = 8080;

app.listen(PORT, () => { console.log('Server running on port:', PORT); });