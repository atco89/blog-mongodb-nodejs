require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const User = require("./models/user");

const mongo_uri = process.env.MONGO_URI;
const connect = mongoose.connect(mongo_uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
});
connect.then(() => console.log("Database Connected Successfully"))
    .catch((err) => console.log("Error occur while connecting ", err));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

const commentRoutes = require("./routes/comments");
const postRoutes = require("./routes/posts");
const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/user");

app.use(require("express-session")({
    secret: "I am the best",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:id/comments", commentRoutes);
app.use("/user", userRoutes);

let port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server Listening at http://localhost:${port}`);
});
