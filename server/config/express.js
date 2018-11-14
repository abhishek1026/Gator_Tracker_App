var express = require('express'), 
    mongoose = require('mongoose'),
    config = require('./config'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    listingsRouter = require('../routes/listings.server.routes'),
    coursesRouter = require('../routes/courses.server.routes'),
    authRouter = require('../routes/auth.server.routes');

module.exports.init = function() {

  var app = express();

  var options = {
    useMongoClient: true,
    user: config.db.username,
    pass: config.db.password
  };
  
  mongoose.connect(config.db.uri, options, function(err){
    if(err)
        console.log(err);
    else
        console.log("Successful connection to MongoDB!");
  });

  app.use(morgan('dev'));

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(bodyParser.json());

  app.use(express.static('client'));

  app.use('/api/listings', listingsRouter);

  app.use('/api/courses', coursesRouter);

  app.use('/api/auth', authRouter);

  app.get('*', function(req, res) {
    res.redirect('index.html');
  });

  return app;
}; 