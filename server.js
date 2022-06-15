//echar a andar nodemon--npm run start
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const secret = '123';
//traer modulos
const {
  register_user,
  login,
  getAllTransfers,
  getAllUsers,
  newTransfer,
  getDatoUsers,
  admin,borrar
} = require('./consultas.js');
const {
  checkRut,
} = require('./script.js')

//levantar servidor
const puerto = process.env.PUERTOS || 3000;
const servidor = process.env.HOSTORG || "localhost";
app.listen(puerto, () => console.log(`Servidor Disponible >>> http://${servidor}:${puerto} <<`));


//usar expres de url y express de json para poder tomar el dato de parte del usuario
app.use(express.urlencoded({
  extended: false
}))
//json
app.use(express.json());
// cookie parser
app.use(cookieParser());
//disponibilizar public
//body parser
app.use(bodyParser.json());

//disponibilizar bootstrap para que el front sepa que este disponible
app.use("/bootstrap", express.static("/node_modules/bootstrap/dist"));

//disponibilizar public y su contenido
app.use("/js", express.static(__dirname + "/public/js")); //disponiblizando las carpetas de public y su contenido js
app.use("/css", express.static(__dirname + "/public/css")); //disponiblizando las carpetas de public y su contenido css

//configurar motor de vistas, dejandolo como handlebars
app.set("view engine", "handlebars");
//configurar motor de vistas
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: `${__dirname}/views/layout`, //directorio de los layouts
    partialsDir: `${__dirname}/views/partial`, //directorio de los parciales
  })
);
//renderizar raiz
app.get("/", (req, res) => {
  const {
    token
  } = req.cookies;
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.render('login');
      } else {
        res.redirect('/dashboard');
      }
    });
  } else {
    res.render('login');
  }
});
// login verificando con jwt 
app.post('/login', async (req, res) => {
  const user_data = req.body;

  try {
    let resp = await login(user_data);

    if (resp.rowCount == 0) {
      res.redirect('/');
    } else {
      const current_user = resp.rows[0];
      const token = jwt.sign(current_user, secret);

      res.cookie('token', token); //utilizamos los cookies para setear el token 
      //tambien se usa localStorage pero no es recomendable porque estamos en el back,
      //       // localStorage se usa en el front
      res.redirect('/dashboard');
    }
  } catch (error) {
    res.status(402).send({
      code: 402,
      message: error.message,
    });
  }
});
//loginAdmin render
app.get("/loginAdmin", async (req, res) => {
  const {
    token
  } = req.cookies;
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.render('loginadmin');
      } else {
        res.redirect('/admin');
      }
    });
  } else {
    res.render('loginadmin');
  }
});
//
app.post('/loginAdmin', async (req, res) => {
  const user_data = req.body;

  try {
    let resp = await admin(user_data);

    if (resp.rowCount == 0) {
      res.redirect('/loginAdmin');
    } else {
      const current_user = resp.rows[0];
      const token = jwt.sign(current_user, secret);

      res.cookie('token', token); //utilizamos los cookies para setear el token 
      //tambien se usa localStorage pero no es recomendable porque estamos en el back,
      //       // localStorage se usa en el front
      res.redirect('/admin');
    }
  } catch (error) {
    res.status(402).send({
      code: 402,
      message: error.message,
    });
  }
});
//
app.get('/register', (req, res) => {
  res.render('register');
});

// registrar nuevo usuario
app.post('/register', async (req, res) => {
  const user_data = req.body;


  try {
    let checkRutUsr = await checkRut(user_data.rut)
    if(checkRutUsr === true) {
    
      await register_user(user_data)
      res.redirect('/dashboard')
    }else {
      alert('rut invalido');
      console.log('rut invalido')
     res.redirect('/register')     
    }

  } catch (error) {
    res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
})
//dashboard para clientes
app.get('/dashboard', async (req, res) => {
  const {
    token
  } = req.cookies;
  let users = await getAllUsers();
  let saldo = 0;
  const transfers = await getAllTransfers();

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      saldo = users.find((user) => user.id == decoded.id).balance;
      users = users.filter((user) => user.id != decoded.id);
      if (err) {
        res.redirect('/');
      } else {
        res.render('dashboard', {
          current_user: decoded,
          users,
          transfers,
          saldo,
        });
      }
    });
  } else {
    res.redirect('/');
  }
});
//transferencia
app.post('/transfer', async (req, res) => {
  const data_transfer = req.body;
  try {
    await newTransfer(data_transfer);
    res.redirect('/dashboard');
  } catch (e) {
    res.status(500).send({
        error: `Algo salió mal... ${e}`,
        code: 500
    });
  }
});
//renderizar admin persistiendo token
app.get('/admin', async (req, res) => {
  const {
    token
  } = req.cookies;

  const allUsers = await getDatoUsers();
 
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {

      if (err) {
        res.redirect('/loginAdmin');
      } else {
        res.render('admin', {
          current_user: decoded,
          allUsers,
        });
      }
    });
  } else {
    res.redirect('/loginAdmin');
  }
})
//eliminar cliente
app.delete("/delete/:id", async (req, res) =>  {
  
  const { id } = req.params

  console.log(id)
 
  try {
   //aca el nombre que desea eliminar el cliente

     await borrar(id);
    res.status(200).send();
  
  } catch (e) {
      res.status(500).send({
          error: `Algo salió mal... ${e}`,
          code: 500
      })
  };
});


// logout(salida)
app.get('/logout', (req, res) => {
  res.clearCookie('token'); //se limpia el token al salir
  res.redirect('/');
});