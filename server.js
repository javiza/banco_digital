//echar a andar nodemon--npm run start
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');


//levantar servidor
const puerto = process.env.PUERTOS || 3000; 
const servidor = process.env.HOSTORG || "localhost"; 
app.listen(puerto, () => console.log(`Servidor Disponible >>> http://${servidor}:${puerto} <<`));

//disponibilizar bootstrap para que el front sepa que este disponible
app.use("/bootstrap", express.static("node_modules/bootstrap"));

//disponibilizar public y su contenido
app.use("/js", express.static(__dirname + "public/js"));//disponiblizando las carpetas de public y su contenido
app.use("/css", express.static(__dirname + "public/css"));//disponiblizando las carpetas de public y su contenido

//configurar motor de vistas, dejandolo como handlebars
app.set("view engine", "handlebars");
//configurar motor de vistas
app.engine(
    "handlebars",
    exphbs.engine({
        defaultLayout: "main",
        layoutsDir: `${__dirname}/views/layout`, //directorio de los layouts
        partialsDir: `${__dirname}/views/partial`,//directorio de los parciales
    })
);
//renderizar raiz
app.get("/", (req, res) => {
    res.render("login");
});
app.get('/register', (req, res) => {
    res.render('register');
});
