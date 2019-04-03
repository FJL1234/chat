var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const Message = require('./routes/models');



const session = require("express-session");
const FileStore = require("session-file-store")(session);

const sessionMiddleware = session({
  store: new FileStore(),
  secret: 'keyboard cat',
  cookie: {maxAge:60000}
});

//socket.io
var iosession = require("express-socket.io-session")(sessionMiddleware);

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

io.use(iosession);

io.on("connection",async function (socket) {
  socket.on("say", data=>{
    const user_name = socket.handshake.session.user.loginname;
    socket.handshake.session.save();
    var d = new Date();
    var time = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 - ${d.getHours()}时${d.getMinutes()}分${d.getSeconds()}秒`;
    io.emit("newsay","用户" + user_name + ":" + data + "(" + time + ")");
    var Chat_record = "用户" + user_name + ":" + data + "(" + time + ")" + "|";
    const mes = new Message({
      loginname:req.session.user.loginname,
      data,
      createTime:time
    });
    // await mes.save();
  })
})




var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var board = require("./routes/board");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/board",board);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

// module.exports = app;
