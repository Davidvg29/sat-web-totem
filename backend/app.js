const express = require('express');
const app = express();
const routes = require('./routes/routes');
const cors = require("cors")

app.use(express.json());

app.use(cors())

// rutas
app.use('/totem', routes);

module.exports = app;