var express = require("express")
    app = express()
    path = require("path")

app.use(express.static(path.join(__dirname,'public')))

app.set("view engine", "ejs");

app.get("/",function(req, res){
  res.render("index")
})
app.get("/1p03",function(req,res){
  res.render("1P03")
})
app.listen(3000,function(req, res){
  console.log("Hello world")
})