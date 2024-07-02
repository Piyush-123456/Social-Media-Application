const express = require("express");
const PostCollection = require("../models/posts");
const { isLoggedIn } = require("../middleware/auth")
const router = express.Router();
const imagekit = require("../utils/imagekit")

router.post('/create', isLoggedIn, async (req, res, next) => {

    try {
        const newPost = new PostCollection(req.body);
        const { fileId, url, thumbnailUrl } = await imagekit.upload({
            file: req.files.media.data,
            fileName: req.files.media.name,
        });
        newPost.media = { fileId, url, thumbnailUrl };
        newPost.user = req.user._id;

        req.user.posts.push(newPost._id);

        await newPost.save();
        await req.user.save();

        res.send("Post Created!");
    }
    catch (Err) {
        console.log(Err.message);
    }
})


module.exports = router;