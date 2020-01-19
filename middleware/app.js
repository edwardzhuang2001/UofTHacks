// all the middleare goes here
var middlewareObj = {};
middlewareObj.checkReviewOwnership = function(req, res, next) {
  if(req.isAuthenticated()){
         Review.findById(req.params.commentid, function(err, foundReview){
            if(err){
                res.redirect("back");
            }  else {
                // does user own the review?
             if(foundReview.author.id.equals(req.user._id)) {
                 next();
             } else {
                 req.flash("error", "You don't have permission to do that");
                 res.redirect("back");
             }
            }
         });
     } else {
         req.flash("error", "You need to be logged in to do that");
         res.redirect("back");
     }
 }
 
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;