const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const bodyParser = require('body-parser');
const mongoServer = require('./config/db');
const cors = require('cors');
const expressSession = require('express-session');
const finalRoute = require('./route');
const secretConfig = process.env.secret || require('./config.json').secret;
const port = process.env.PORT || 4000;
const app = express();

app.use(cors());

mongoServer();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  expressSession({
    secret: secretConfig,
    saveUninitialized: true,
    resave: true,
  })
);

app.use(favicon(__dirname + '/build/favicon.ico'));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.use('/', finalRoute);
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
