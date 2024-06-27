const mongoose = require("mongoose");
const plm = require("passport-local-mongoose")

const userschema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    image: {
        type: String,
        default: "https://www.gravatar.com/avatar/",
    },
    otp: {
        type: Number,
        default: 0,
    },

}, { timestamps: true })

userschema.plugin(plm);

const userCollection = mongoose.model("User", userschema);
module.exports = userCollection;