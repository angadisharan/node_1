var express = require('express');

var path = require('path');


var expressSession = require('express-session')

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var handle_request = require('./routes/handle_request');






//Handlers
var db_utils = require('./db/db_utils')

var store_item_add = require('./routes/store_item/store_item_add')
var store_item_getall = require('./routes/store_item/store_item_getall')
var store_item_update = require('./routes/store_item/store_item_update')
var store_item_delete = require('./routes/store_item/store_item_delete')





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


//=================================== Passport ==========================================


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
  
  var sql = " SELECT * FROM user where email = '" + username + "'; "


  db_utils.executeSQL(sql, function(error, result){
    if (error || !result || result.length <= 0 ) {
      done(error, null);
    } else {
      done(null, result[0]);
    }

  });
}))


passport.serializeUser(function(user, done){
  
  console.log('inside serializeUser');

  done(null, user._id);
});

passport.deserializeUser(function(id, done){

  console.log('inside deserializeUser ' + id);
  var sql = " select * from user where _id = '" + id + "' ; "
  
  db_utils.executeSQL(sql, function(error, result){
    if (error || !result || result.length <= 0 ) {
      done(error, null);
    } else {
      done(null, result[0]);
    }
  });


  
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
    res.redirect("/")
  } else {
    res.redirect('/login')
  }

});


app.get('/logout', function(req, res){

  req.logout();
  res.redirect('/login')

})















//=================================== Passport ==========================================










app.use('/', routes);
app.use('/users', users);



app.get("/my_defined_url", function(request, response){
  response.send("Hello from defined url");
});



app.get("/login", handle_request.login);

app.get("/signup", handle_request.render_signup);
app.post("/api/signup", handle_request.perform_signup);





app.get('/api/admin/item/getall', store_item_getall.handleRequest)



app.post("/post_login", handle_request.handle_login);




var mobile_api = require('./routes/mobile_api')
var mobile_api2 = require('./routes/mobile_api2')
//=========================== mobile api ======================================

app.post('/mobile_api/login', mobile_api.login);
app.get('/mobile_api/get_my_cart', mobile_api.get_my_cart);



app.get('/dummy_insert', mobile_api2.insertDummyData);



app.post('/mobile_api/admin/item/add', store_item_add.handleRequest)
app.get('/mobile_api/admin/item/getall', store_item_getall.handleRequest)
app.put('/mobile_api/admin/item/update', store_item_update.handleRequest)
app.delete('/mobile_api/admin/item/:id', store_item_delete.handleRequest)



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
