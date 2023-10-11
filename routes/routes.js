const express = require("express");
const router = express.Router();

router.get("", (req, res) => {
  res.render("index", { title: "Clientes" });
});

router.get("/add", (req, res) => {
  res.render("add_clients", { title: "Registrar Clientes" });
});

module.exports = router;
