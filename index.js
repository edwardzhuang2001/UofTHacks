var express = require("express")
    app = express()
    path = require("path")
    mongoose = require("mongoose")
    User = require("./models/user")
    bodyParser = require("body-parser")
    LocalStrategy = require("passport-local")
    passport = require("passport")
    flash = require("connect-flash")
    Course = require("./models/course")
    Review = require("./models/review")

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

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.set("view engine", "ejs");

app.get("/",function(req, res){
  res.render("index")
})
app.get("/1p03",function(req,res){
  res.render("1P03")
})
app.get("/courses", function(req, res){
  Course.find({}, function(err, foundCourses){
    if(err){
      console.log(err)
    }
    else{
      res.render("courses", {courses:foundCourses})
    }
  })
})
app.get("/courses/:id",function(req, res){
  Course.findById(req.params.id, function(err,foundCourse){
    if(err){
      console.log(err)
    }
    else{
      res.render("course",{course: foundCourse})
    }
  })
})
app.get("/new", function(req, res){
  res.render("new")
})
app.post("/new", function(req, res){
  var newCourse = new Course({
    title: req.body.title,
    prof_name: req.body.prof_name,
    course_code: req.body.course_code,
    description: req.body.description
  })
  Course.create(newCourse, function(err, newCourse){
    if(err){
      console.log(err)
    }
    else{
      req.flash("success", "Added course sucessfully")
      res.redirect("/")
    }
  })
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
app.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    req.flash('success', 'You\'ve successfully logged in!');
    res.redirect('/');
  }
);
app.get("/logout", function(req, res){
  req.logout()
  req.flash("success", "Logged you out!");
  res.redirect("/");
})
app.listen(3000,function(req, res){
  console.log("Hello world")
})