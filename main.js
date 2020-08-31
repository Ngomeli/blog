var express = require("express");
var app = express();
var bodyParser = require("body-parser"); //to include body-parser
//To Connect to Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog_db', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));
// APP CONFIG
app.use(bodyParser.urlencoded({ extended: true })); //to tell express to use body parser
app.set("view engine", "ejs");
app.use(express.static("public")); //to access our custom styles
// MOGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now } //to allways get the actual time the blog is editted or deleted
});
var Blog = mongoose.model("Blog", blogSchema);
// Blog.create({
//     title: "What to look for when buying a smartphone",
//     image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcnet2.cbsistatic.com%2Fimg%2F-ap7G50oMCeM5mvweaibl-yI2ro%3D%2F2018%2F02%2F27%2F81bf29bd-12ef-43cf-bf3f-90708de31a33%2Fasus-zenfone-5z-5.jpg&f=1&nofb=1",
//     body: "With the current change in technology, phone manufacturers are building better and good looking mobile phones. Other than good looking there are some key features you need to check before buying the mobile phone. When the phone was manufactured, this is because all android phones get security support and phone updates for a maximum of 3 years only while the ios phones get security support and phone updates for a maximum of 6 years. what kind of screen protector is being used, to be on the safe side settle for not less than gorilla glass 3 screen protector. With the use of social media platforms it is much advised to atleast have a 4GB RAM of memory and 32GB or 64GB of storage. The charging system need to be a USB-C type for fast charging and the screen display goes to personal preference, some prefer super amoled displays and others prefer IPS LCD displays. For camera's it's also a personal choice; if you love taking pictures 48 mega pixels an above back camera will serve you better.    "
// });
// ROUTES
app.get("/", function(req, res) {
    res.redirect("/blogs");
});
// INDEX ROUTE
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log("ERROR!");
        } else {
            res.render("index", { blogs: blogs });
        }
    });
});
//NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new");
});
//CREATE ROUTE
app.post("/blogs", function(req, res) {
    //Create blog
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            //then redirect to the index
            res.redirect("/blogs");
        }
    });
});
//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    //find the blog with provided ID
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            //render show template with that blog
            res.render("show", { blog: foundBlog });
        }
    });
});
//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            //render show template with that blog
            res.render("edit", { blog: foundBlog });
        }
    });
});








app.get("*", function(req, res) {
    res.send("Sorry, Page Not Found... What Are You Doing With Your Life??");
});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log("Blog Server Has Started!!");
});