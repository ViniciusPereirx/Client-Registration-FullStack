const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://127.0.0.1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conecatado ao MongoDB"))
  .catch((err) => console.error(err));
