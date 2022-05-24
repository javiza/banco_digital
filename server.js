const express = require('express');
const app = express();
const exphbs = require('express-handlebars');

//levantar servidor
const puerto = process.env.PUERTOS || 3000; 
const servidor = process.env.HOSTORG || 'localhost'; 
app.listen(puerto, () => console.log(`Servidor Disponible >>> http://${servidor}:${puerto} <<`));