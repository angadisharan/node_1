var express = require('express');

var path = require('path');



var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var handle_request = require('./routes/handle_request');

var app = express();

console.log("__dirname " + __dirname);


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

app.use('/', routes);
app.use('/users', users);



app.get("/my_defined_url", function(request, response){
  response.send("Hello from defined url");
});



app.get("/login", handle_request.login);

app.get("/signup", handle_request.render_signup);
app.post("/api/signup", handle_request.perform_signup);


app.post("/post_login", handle_request.handle_login);




var mobile_api = require('./routes/mobile_api')
var mobile_api2 = require('./routes/mobile_api2')
//=========================== mobile api ======================================

app.post('/mobile_api/login', mobile_api.login);
app.get('/mobile_api/get_my_cart', mobile_api.get_my_cart);



app.get('/dummy_insert', mobile_api2.insertDummyData);


//=========================== mobile api ======================================










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
