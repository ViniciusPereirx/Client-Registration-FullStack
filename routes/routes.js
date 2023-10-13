const express = require("express");
const router = express.Router();

const Client = require("../models/clients");
const multer = require("multer"); // middleware para uploads de arquivos

// Upload da imagem
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("image");

// Inserindo Cliente no Banco de Dados
router.post("/add", upload, (req, res) => {
  const client = new Client({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file.filename,
    city: req.body.city,
    state: req.body.state,
  });

  client
    .save()
    .then(() => {
      req.session.message = {
        type: "success",
        message: "Cliente adicionado com sucesso!",
      };
      res.redirect("/");
    })
    .catch((err) => {
      res.json({ message: err.message, type: "danger" });
    });
});

// Lista de Clientes
router.get("", (req, res) => {
  Client.find()
    .then((clients) => {
      res.render("index", { title: "Clientes", clients: clients });
    })
    .catch((err) => {
      res.json({ message: err.message });
    });
});

// Registrar Clientes
router.get("/add", (req, res) => {
  res.render("add_clients", { title: "Registrar Clientes" });
});

module.exports = router;
