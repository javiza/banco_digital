//echar a andar nodemon--npm run start
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
//traer modulos
const {register_user,login} = require('./consultas.js');                                      

//levantar servidor
const puerto = process.env.PUERTOS || 3000; 
const servidor = process.env.HOSTORG || "localhost"; 
app.listen(puerto, () => console.log(`Servidor Disponible >>> http://${servidor}:${puerto} <<`));


//usar expres de url y express de json para poder tomar el dato de parte del usuario
app.use(express.urlencoded({ extended: false }))
//json
app.use(express.json());
//disponibilizar public


//disponibilizar bootstrap para que el front sepa que este disponible
app.use("/bootstrap", express.static("/node_modules/bootstrap/dist"));

//disponibilizar public y su contenido
app.use("/js", express.static(__dirname + "/public/js"));//disponiblizando las carpetas de public y su contenido js
app.use("/css", express.static(__dirname + "/public/css"));//disponiblizando las carpetas de public y su contenido css

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
app.get("/", (_req, res) => {
    try {
        res.render("login");
    } catch (e) {
        res.status(500).send({
            error: `Algoo salió mal... ${e}`,
            code: 500
        })
    };
});
app.get('/register', (_req, res) => {
    res.render('register');
});
app.post('/login', async (req, res) => {
    const user_data = req.body;
  
    try {
      let resp = await login(user_data);
      if (resp.rowCount == 0) {
        res.redirect('/');
      } else {
        const current_user = resp.rows[0];
        const token = jwt.sign(current_user, secret);
        res.cookie('token', token);
        res.redirect('/dashboard');
      }
    } catch (error) {
      res.status(402).send({
        code: 402,
        message: error.message,
      });
    }
  });
app.post('/register', async (req, res) => {
    const user_data = req.body;
   
    try {
        await register_user(user_data);
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send({
            code: 500,
            message: 'No se pudo crear Usuario',
          });
    }
})
app.get('/dashboard', (_req, res) => {
    res.render('dashboard');
});
app.get('/logout', (_req, res) => {
    res.redirect('/');
});
