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
    middleware = require("./middleware/app")
    methodOverride = require("method-override")

mongoose.connect("mongodb+srv://zakerl:labeeb_1234@cluster0-bb19c.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true, useCreateIndex: true }).then(() =>{
  console.log("Connected to DB")
}).catch(err=>{
    console.log("Error:", err.message)
});

app.use(methodOverride("_method"));
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
  Course.findById(req.params.id).populate("reviews").exec(function(err,foundCourse){
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
app.get("/courses/:id/reviews/new",middleware.isLoggedIn,function(req, res){
  res.render("reviewsnew",{courseid: req.params.id})
})
app.post("/courses/:id/reviews",middleware.isLoggedIn, function(req, res){
  Course.findById(req.params.id, function(err, course){
      if(err){
          console.log(err);
          res.redirect("/");
      } else {
       Review.create(req.body.review, function(err, review){
          if(err){
              req.flash("error", "Something went wrong");
              console.log(err);
          } else {
              //add username and id to review
              review.author.id = req.user._id;
              review.author.username = req.user.username;
              //save review
              review.save();
              course.reviews.push(review);
              course.save();
              req.flash("success", "Successfully added review");
              res.redirect('/courses/' + req.params.id);
          }
       });
      }
  });
})
app.get("/courses/:id/reviews/:commentid/edit",function(req, res){
  Review.findById(req.params.commentid, function(err, foundComment){
      if(err){
          console.log(err)
      }
      else{
          res.render("edit", {courseid:req.params.id, review:foundComment})
      }
  })
})
app.put("/courses/:id/reviews/:commentid", function(req, res){
  Review.findByIdAndUpdate(req.params.commentid, req.body.review, function(err, editedComment){
      if(err){
          console.log(err)
      }
      else{
          res.redirect("/courses/"+ req.params.id)
      }
  })
})
app.delete("/courses/:id/reviews/:commentid", function(req, res){
  Review.findByIdAndRemove(req.params.commentid, function(err, deletedComment){
      if(err){
          console.log(err)
      }
      else{
          req.flash("success", "deleted comment")
          res.redirect("/courses/"+ req.params.id)
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
app.get("/results", function(req, res) {
  if (req.query.search) {
     const regex = new RegExp(escapeRegex(req.query.search), 'gi');
     Course.find({ title: regex }, function(err, foundcourses) {
         if(err) {
             console.log(err);
         } else {
            res.render("search", { courses: foundcourses });
         }
     }); 
  }
})
app.get("/results", function(req, res) {
  if (req.query.search) {
     const regex = new RegExp(escapeRegex(req.query.search), 'gi');
     Course.find({ course_code: regex }, function(err, foundcourses) {
         if(err) {
             console.log(err);
         } else {
            res.render("search", { courses: foundcourses });
         }
     }); 
  }
})
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
app.listen(3000,function(req, res){
  console.log("Hello world")
})