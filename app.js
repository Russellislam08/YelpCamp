var express        = require("express"),
	  app            = express(),
    bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    seedDB         = require("./seeds"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local");

//Requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes       = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v12";
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended:"true"}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Secret Token",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
    
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
        console.log("Yelpcamp server has started...");
});
