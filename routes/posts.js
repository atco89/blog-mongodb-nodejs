const express = require("express");
const router = express.Router({mergeParams: true});
const Post = require("../models/post");
const middleware = require("../middleware");

router.get("/", (req, res) => {
    Post.find({}, (err, posts) => {
        err ? console.log(err) : res.render("posts/index", {
            posts: posts.reverse(),
            currentUser: req.user,
        });
    });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    Post.create({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username,
        },
    }, (err) => err ? console.log("Error in inserting into DB") : res.redirect("/posts"));
});

router.get("/publish", middleware.isLoggedIn, (req, res) => res.render("posts/new"));

router.get("/:id", function (req, res) {
    Post.findById(req.params.id)
        .populate("comments")
        .exec((err, foundPost) => err
            ? console.log("Error occurred in finding ID")
            : res.render("posts/show", {post: foundPost}));
});

router.get("/:id/edit", middleware.checkPostOwnership, (req, res) => {
    Post.findById(req.params.id, (err, foundPost) => res.render("posts/edit", {post: foundPost}));
});

router.put("/:id", middleware.checkPostOwnership, (req, res) => {
    Post.findByIdAndUpdate(req.params.id, req.body.post,(err) => {
        if (err) {
            console.log(err);
            return;
        }
        err ?console.log(err): res.redirect("/posts/" + req.params.id)
    });
});

router.delete("/:id", middleware.checkPostOwnership, (req, res) => {
    Post.findByIdAndRemove(req.params.id, (err) => err ? res.redirect("/posts") : res.redirect("/posts"));
});

module.exports = router;
