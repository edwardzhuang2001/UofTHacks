var mongoose = require("mongoose")
var courseSchema = new mongoose.Schema({
  title: String,
  prof_name: String,
  course_code: String,
  description: String,
  reviews: [
    {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Review"
    }
]
})
module.exports = mongoose.model("Course",courseSchema)