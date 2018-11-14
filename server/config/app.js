var config = require('./config'),   
    express = require('./express');

module.exports.start = function() {
  var app = express.init();
  app.listen((process.env.PORT || config.port), function() {
    console.log('App listening on port', (process.env.PORT || config.port));
  });
  return app;
};