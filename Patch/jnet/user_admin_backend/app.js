var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var Order = require('./routes/Order');
var Code = require('./routes/Code');

var WechatIndex = require('./routes/WechatIndex');
var WechatTem = require('./routes/WechatTem');
var WechatUser = require('./routes/WechatUser');
var WechatPolicy = require('./routes/WechatPolicy');
var WechatCompany = require('./routes/WechatCompany');
var WechatuserPolicy = require('./routes/WechatuserPolicy');

var index = require('./routes/index');
var config = require('./config/config');
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
app.use(session({
    secret: "s",
    name: "s",
    resave: true,
    saveUninitialized: false,
}));

app.use('/', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
})

config.serverPath.indexOf('localhost') > -1 ? mongoose.connect('mongodb://localhost:27017/zscapply',{useNewUrlParser: true }):
mongoose.connect('mongodb://18.219.177.53:27017/zscapply',{useNewUrlParser: true });

app.use('/', index);
app.use('/Code', Code);
app.use('/Order', Order);
app.use('/WechatIndex', WechatIndex);
app.use('/WechatTem', WechatTem);
app.use('/WechatUser', WechatUser);
app.use('/WechatPolicy', WechatPolicy);
app.use('/WechatCompany', WechatCompany);
app.use('/WechatuserPolicy', WechatuserPolicy);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

