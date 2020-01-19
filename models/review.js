var mongoose = require("mongoose")

var reviewSchema = new mongoose.Schema({
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    image: String,
    created: {type: Date, default: Date.now},
    text: String
})
module.exports = mongoose.model("Review", reviewSchema)