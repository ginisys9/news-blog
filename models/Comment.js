const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "News",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "approved", "rejected"],
        required: true,
    },
},{
    timestamps:true
});

module.exports = mongoose.model("Comment", commentSchema);
