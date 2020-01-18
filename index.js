var express = require("express")
    app = express()
    path = require("path")
    mongoose = require("mongoose")
    User = require("./models/user")


mongoose.connect("mongodb://localhost/work",{ useNewUrlParser: true });
app.use(express.static(path.join(__dirname, 'public')))  

app.set("view engine", "ejs");

app.get("/",function(req, res){
  res.render("index")
})
app.get("/1p03",function(req,res){
  res.render("1P03")
})
app.get("/signup", function(req,res){
  res.render("register")
})
app.get("/login", function(req, res){
  res.render("login")
})
app.post("/signup",function(req, res){
  res.send("Welcome to the post route")
})
// app.post("/login",
// passport.authenticate('local', {
//   failureRedirect: '/login',
//   failureFlash: true
// }),
// function(req, res){
//   req.flash('success', 'You\'ve successfully logged in!');
//   res.redirect('/blogs');
// })
app.listen(3000,function(req, res){
  console.log("Hello world")
})