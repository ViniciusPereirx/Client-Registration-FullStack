const moongose = require("mongoose");
const clientSchema = new moongose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  image: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now },
  city: { type: String, required: true },
  state: { type: String, required: true },
});
