var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())

app.get('/', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

const port = 5000;

app.listen(port, function () {
  console.log(`CORS-enabled web server listening on port ${port}`)
})