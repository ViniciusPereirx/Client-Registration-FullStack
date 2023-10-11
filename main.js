const express = require("express");
const moongose = require("mongoose");
const session = require("express-session");

const app = express();

// Conectando ao MongoDB
require("./database/db");

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Inserindo template engine
app.set("view engine", "ejs");

// Rotas
app.use("/", require("./routes/routes"));

app.listen(3000, () => {
  console.log("Servidor Ligado!");
});
