const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require('dotenv').config()

var app = express();

app.use(cors());

app.get("/", function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

const PORT = process.env.PORT || 9000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`CORS-enabled web server listening on port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));