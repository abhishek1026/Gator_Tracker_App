var express = require('express'),
  mongoose = require('mongoose'),
  config = require('./config'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  listingsRouter = require('../routes/listings.server.routes'),
  coursesRouter = require('../routes/courses.server.routes'),
  authRouter = require('../routes/auth.server.routes'),
  profileRouter = require('../routes/profile.server.routes'),
  sessions = require("client-sessions");

module.exports.init = function () {

  var app = express();

  var options = {
    useMongoClient: true,
    user: config.db.username,
    pass: config.db.password
  };

  mongoose.connect(config.db.uri, options, function (err) {
    if (err)
      console.log(err);
    else
      console.log("Successful connection to MongoDB!");
  });

  app.use(sessions({
    cookieName: 'session', // cookie name dictates the key name added to the request object
    secret: 'abhikeks1026',
    duration: 1000 * 60 * 30,
    activeDuration: 1000 * 60 * 5
  }));

  app.use(morgan('dev'));

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(bodyParser.json());

  app.get('/', checkSession);

  app.get('/login', function (req, res, next) {
    res.redirect('/index.html');
  });

  app.get('/register', function (req, res, next) {
    res.redirect('/register.html');
  });

  app.use(express.static('client', { extensions: ['html', 'js', 'css'] }));

  app.use('/api/listings', listingsRouter);

  app.use('/api/courses', coursesRouter);

  app.use('/api/auth', authRouter);

  app.use('/api/profile', profileRouter);

  app.get('/admin/:username', isAdmin, function (req, res, next) {
    if (req.params.username)
      return res.redirect('/views/admin.html');
    return res.redirect('/login');
  });

  app.get('/user/:username', isUser, function (req, res, next) {
    if (req.params.username)
      return res.redirect('/views/user.html');
    return res.redirect('/login');
  });

  app.get('*', checkSession);

  function isUser(req, res, next) {

    if (doCheck(req, false)) {
      console.log('valid auth!');
      next();
    }
    else {
      console.log('invalid auth!');
      return res.redirect('/login');
    }

  }

  function isAdmin(req, res, next) {

    if (doCheck(req, true)) {
      console.log('valid auth!');
      next();
    }
    else {
      console.log('invalid auth!');
      return res.redirect('/login');
    }

  }

  function doCheck(req, flag) {
    return req.session && req.session.user && req.session.user.isAdmin === flag && req.params.username === req.session.user.username;
  }

  function checkSession(req, res) {
    if(req.session && req.session.user){
      if(req.session.user.isAdmin){
        return res.redirect(`/admin/${req.session.user.username}`);
      }
      return res.redirect(`/user/${req.session.user.username}`);
    }
    res.redirect('/login');
  }

  return app;

};