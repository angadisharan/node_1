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


app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


app.use(expressSession({secret: 'someSecret', resave:false, saveUninitialize:false, 
  cookie: {maxAge: 3000000}})
)

//=================================== Passport ==========================================


app.get('/new_login', function(req, res){
  res.render('new_login')
})


// app.use(function(req, res, next){

//   console.log("=================== inside middleware")
//   next();
// });


var passport = require('passport');
var passportLocal = require('passport-local');

passport.use(new passportLocal.Strategy(
  {passReqToCallback: true},
  verifyCredentials
));



function verifyCredentials(req, username, password, done) {
  
    var info = { message: 'Invalid User name or password', 'username':username, 'password':password }
    var sql = " select * from user where email = '" + username + "' "
    
    console.log(" inside verifyCredentials " + username + password)

    db_utils.executeSQL(sql, function(result) {


      console.log(" result ==== inside verifyCredentials " + JSON.stringify(result))

      if(!result || result.length <= 0) {
        done(null, null, info);
      } else {
        if(result[0].password == password){
          var user = {
            'user_id': result[0].user_id
          }
          done(null, user);
        } else {
          done(null, null, info);
        }
      }
    });
}


passport.serializeUser(function(user, done) {

    console.log("inside serializeUser")

    var sid_user = {
      'user_id':user.user_id
    };
    done(null, sid_user);
});


passport.deserializeUser(function(sid_user, done) {

    console.log("inside deserializeUser")

    var sql = " select * from user where usre_id = '" + sid_user.user_id + "' "
    db_utils.executeSQL(sql, function(result) {
      if(result.length <= 0){
        done(null, null, { message: 'Invalid User name or password' });
      } else {
        done(null, result[0]);
      }
    });
});

app.use(passport.initialize());
app.use(passport.session());

  app.post('/new_post_login', function(req, res, next) {

    console.log("inside post newLogin")

    passport.authenticate('local', function(err, user, info) {
      

      console.log(" user ==== iinside post " + JSON.stringify(user));
      console.log(" user isAuthenticated " + req.isAuthenticated());



      if (err) { return next(err) }
      if (!user) {



        return res.render('login', info);
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
          res.redirect("/");
      });
    })(req, res, next);



  });

module.exports.isAuthenticated = isAuthenticated;
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
       return next();
    } else {
      return utils.sendWithStatus(res, 401, "Unauthorised");
    }
}


















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
