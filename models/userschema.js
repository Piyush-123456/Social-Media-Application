const mongoose = require("mongoose");
const plm = require("passport-local-mongoose")

const userschema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    image: {
        fileId: String,
        url: String,
        thumbnailUrl: String
    },
    otp: {
        type: Number,
        default: 0,
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],


}, { timestamps: true })

userschema.plugin(plm);

const userCollection = mongoose.model("User", userschema);
module.exports = userCollection;