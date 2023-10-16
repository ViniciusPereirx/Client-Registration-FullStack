const express = require("express");
const router = express.Router();

const Client = require("../models/clients");
const multer = require("multer"); // middleware para uploads de arquivos
const fs = require("fs");

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

// Editar Cliente
router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  Client.findById(id)
    .then((client) => {
      if (client === null) {
        res.redirect("/");
      } else {
        res.render("edit_clients", {
          title: "Editar Cliente",
          client: client,
        });
      }
    })
    .catch((err) => {
      res.redirect("/");
    });
});

router.get("/update/:id", upload, (req, res) => {
  const id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }

  Client.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: new_image,
    city: req.body.city,
    state: req.body.state,
  })
    .then((result) => {
      req.session.message = {
        type: "success",
        message: "Cliente atualizado com sucesso!",
      };
      res.redirect("/");
    })
    .catch(() => {
      res.json({ message: err.message, type: "danger" });
    });
});

// Deletar Cliente
router.get("/delete/:id", (req, res) => {
  const id = req.params.id;

  Client.findByIdAndRemove(id)
    .then((result) => {
      if (result.image != "") {
        fs.unlinkSync("./uploads/" + result.image);
      }

      req.session.message = {
        type: "info",
        message: "Cliente deletado com sucesso!",
      };
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: err.message, type: "danger" });
    });
});
module.exports = router;
