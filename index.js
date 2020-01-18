var express = require("express")
    app = express()
    path = require("path")
    mongoose = require("mongoose")
    User = require("./models/user")
    bodyParser = require("body-parser")
    LocalStrategy = require("passport-local")
    passport = require("passport")
    flash = require("connect-flash")
    
mongoose.connect("mongodb://localhost/work",{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())
app.use(require("express-session")({
  secret: "welcome",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());  

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
app.post("/signup",function(req, res){
  var newUser = new User({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  })
  User.register(newUser, req.body.password, function(err, newUser){
    if(err){
      console.log(err)
      res.render("register")
    }
    passport.authenticate("local")(req, res, function(){
      console.log(newUser)
      res.redirect("/")
    })
  })
})
app.get("/login", function(req, res){
  res.render("login")
})
app.post("/login",
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' }));
app.listen(3000,function(req, res){
  console.log("Hello world")
})