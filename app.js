var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var ueditor = require("ueditor-nodejs");
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var webroutes = require('./routes/web/index');
var serverroutes = require('./routes/servers/index');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var settings = require('./settings');
var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
        secret:settings.cookieSecret,
        key:settings.db,
        cookie:{maxAge:1000*60*60*24*30},
        store:new MongoStore({
            url:'mongodb://localhost/hqblog'
        })
    })
);
webroutes(app);
serverroutes(app);
//图片处理
app.use('/ueditor/ue', ueditor({//这里的/ueditor/ue是因为文件件重命名为了ueditor,如果没改名，那么应该是/ueditor版本号/ue
    configFile: '/ueditor/nodejs/config.json',//如果下载的是jsp的，就填写/ueditor/jsp/config.json
    mode: 'local', //本地存储填写local
    accessKey: 'Adxxxxxxx',//本地存储不填写，bcs填写
    secrectKey: 'oiUqt1VpH3fdxxxx',//本地存储不填写，bcs填写
    staticPath: path.join(__dirname, 'public'), //一般固定的写法，静态资源的目录，如果是bcs，可以不填
    dynamicPath: '/images/ueditor' //动态目录，以/开头，bcs填写buckect名字，开头没有/.路径可以根据req动态变化，可以是一个函数，function(req) { return '/xx'} req.query.action是请求的行为，uploadimage表示上传图片，具体查看config.json.
}));

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
