const express = require("express");
const router = express.Router();
const fs = require("fs");
const validate = require('../public/javascripts/validate');
const Message = require('./models');


router.get("/",async function (req,res) {
  // await Message.remove();

  console.log('root accessed');

  const page = +req.query.page || 1;
  const list = await Message.find()
  .sort("-createTime")
  .limit(10)
  .skip((page-1)*10)

  const prevPage = page - 1 > 0 ? page-1 : 1;
  const nextPage = page + 1 >Math.ceil(await Message.count()/10) ? Math.ceil(await Message.count()/10) : page + 1;

  res.locals.user = req.session.user || "";
  res.render("board",{list,prevPage,nextPage});
  //console.log({list});
})

var users = {};

//退出
router.get("/logout",function (req,res) {
  req.session.user = undefined;
  res.redirect("back");
})


//登陆
router.post("/login",function (req,res) {
  const {lname,lpwd} = req.body;
  var errors = validate.loginvalidate(lname,lpwd);
  if(errors){
    res.send(errors);
  }else{
    if(users[lname] && lpwd != users[lname].password ){
     errors = {};
     errors.password = "密码错误";
     res.send(errors);
   }else if(!users[lname]){
     errors = {};
     errors.name = "未注册用户";
     res.send(errors);
   }else {
     req.session.user = {loginname:lname};
     res.send(errors);
    }
  }
})


//注册
router.post("/reg",function (req,res) {
  const {rname,rpwd,cpwd} = req.body;
  var errors = validate.regvalidate(rname,rpwd,cpwd);
  if(errors){
    res.send(errors);
  }else {
   if(JSON.stringify(users) != "{}"){
     // console.log("111");
    if(users[rname]){
      errors = {};
      errors.name = "已存在此用户";
      res.send(errors);
      // console.log("!!!!");
    }else{
      users[rname] = {
        loginname:rname,
        password:rpwd
      };
      req.session.user = {loginname:rname};
      res.send(errors);
    }
  }else{
    users[rname] = {
      loginname:rname,
      password:rpwd
    };
    req.session.user = {loginname:rname};
    res.send(errors);
  }
}
 console.log(users);
})

//保存留言信息
// router.post("/send",async function (req,res) {
//   const {message} = req.body;
//   var d = new Date();
//   var time = `${d.getFullYear()} / ${d.getMonth()+1} / ${d.getDate()}  - ${d.getHours()} . ${d.getMinutes()} . ${d.getSeconds()} `
//   // var data = req.session.user.loginname + ":" + message + ":" + time + "|";
//   const mes = new Message({
//     loginname:req.session.user.loginname,
//     message,
//     createTime:time
//   });
//    await mes.save();
//    res.redirect("back");
// })





module.exports = router;
