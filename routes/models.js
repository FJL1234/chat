const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test",{useNewUrlParser: true});
mongoose.Promise = Promise;

const Message = mongoose.model("Message",{
  loginname:String,
  message:String,
  createTime:String,
})

module.exports = Message;
