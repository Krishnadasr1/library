const { PORT } = require("./helpers/config");
const app = require("./index");
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(`${process.env.DB_URL}/koha_database`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection.on("error", err => {
  console.log("err", err)
})

mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose connected")
})

app.listen(process.env.PORT || 5000, () => {
  console.log("server started at",PORT);
});
