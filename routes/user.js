const express = require("express");
const router = express.Router({mergeParams: true});
const Post = require("../models/post");

const middleware = require("../middleware");
const {query} = require("express");

router.get("/", (req, res) => res.send("Welcome"));

router.get("/:name", (req, res) => {
    Post.find({"author.username": req.params.name}, (err, posts) => {
        if (err) {
            console.log("Error in find");
            console.log(err);
        } else {
            console.log(posts);
            res.render("posts/user", {
                posts: posts.reverse(),
                currentUser: req.user,
            });
        }
    });
});

module.exports = router;
