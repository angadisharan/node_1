var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




var passport = require('passport')
var passportLocal = require('passport-local')
var expressSession = require('express-session')

app.use(expressSession({
  secret:'secret',
  resave:false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());


passport.use(new passportLocal.Strategy(function(username, password, done){
  

  console.log("inside strategy " + username + " " + password);

  if (username == password) {
    done(null, {id: username, name:username});
  } else {
    done(null, null);
  }  
}))


passport.serializeUser(function(user, done){
  
  console.log('inside serializeUser');

  done(null, user.id);
});

passport.deserializeUser(function(id, done){

  console.log('inside deserializeUser ' + id);

  done(null, {id:id, name:id});
})



app.get('/', function(req, res) {

  if (req.isAuthenticated()) {

    console.log(" req.user " + JSON.stringify(req.user));

    res.render('home', {user : req.user})
  } else {
    res.redirect('/login')
  }

});

app.get('/login', function(req, res) {

  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('login')
  }

});


app.post('/login', passport.authenticate('local'), function(req, res) {

    console.log(" req.isAuthenticated() " + req.isAuthenticated());

   if (req.isAuthenticated()) {
    console.log(" req.user " + JSON.stringify(req.user));
    res.render('home', {user : req.user})
  } else {
    res.redirect('/login')
  }

});



app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
