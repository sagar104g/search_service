// const Sentry = require('@sentry/node');
// Sentry.init({ dsn: 'https://005b49f9aa8945b29d3938a0e4ed70b2@sentry.io/1813560' });
const express = require('express')
const app = express()
var mongoConnection = require('./services/mongo')
var elasticSearch = require('./services/elasticSearch')
var search = require('./routes/search')
var index = require('./routes/index')
var bodyParser = require('body-parser')
var middlewares = require('./middlewares/authorization')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(middlewares.authorization);
elasticSearch.indexSetup(function (err, res) {
  if (err) {
    console.log(err)
  } else {
    console.log(res)
  }
})

app.use('/search', search)
app.use('/index', index)
app.get('/status', function (req, res) {
  res.status(200)
  res.send({ "status": "ok" })
})

Promise.all(mongoConnection.mongoPromise).then(function () {
  var watcher = require('./services/mongoWatcher')
  app.listen(3000, function () {
    console.log("Server is running on 3000 port");
  });
}).catch(function (err) {
  console.log(err)
})