// routes/auth-routes.js
const express = require("express");
const authRoutes = express.Router();
const passport = require('passport');
const ensureLogin = require("connect-ensure-login");



// User model
const User = require("../models/user");
const Part = require("../models/parts");
const Store = require("../models/store");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", {'message': req.flash('error')});
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

authRoutes.get("/auth/facebook", passport.authenticate("facebook"));
authRoutes.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/profile",
  failureRedirect: "/signup"
}));

//check roles

function checkRoles(role){
  return function(req,res,next){
    if(req.isAuthenticated() && req.user.role === role){
      return next();
    }else{
      res.redirect("/login");
    }
  }
}

const checkAdmin = checkRoles("admin");
const checkProvider = checkRoles("provider");

//Get Home page
authRoutes.get('/', (req, res, next) => {
  res.render('index', {"user":req.user});
});

//Edit User

authRoutes.get("/edit-user", checkAdmin,(req, res, next)=>{
  User.find()
  .then( user =>{
    res.render("edit_user", { user });
  })
  .catch(err => {next(err)})
});

authRoutes.post("/edit-user", checkAdmin, (req,res,next)=>{
  const username = req.body.username;
  //console.log('-------------',username);
  const password = req.body.password;
  const role = req.body.role;
  const email = req.body.email;
  const store = null;
  if(username === "" || password === "" || role === "" || email === ""){
    res. render("edit_user", {message: "Todos los campos son requeridos"});
    return;
  }
  if(store === ""){
    store = req.body.store;
  }
  User.findOne({username})
  .then(usernameStored =>{
    if(usernameStored !== null){
      res.render("edit_user", {message: "El usuario ya existe"});
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt)

    const newUser = new User({
      username: username,
      password: hashPass,
      email: email,
      store: store,
      role: role
    });
    console.log(newUser);

    newUser.save((err)=>{
      if(err){
        res.render("edit_user", {message: "Algo salio mal"});
      }else {
        res.redirect("/edit-user")
      }
    });
    })
  .catch(err =>{
      next(err)
  })
});

//Delete User

 authRoutes.get("/delete-user/:id", checkAdmin, async (req, res, next)=>{
  const result = await User.deleteOne({_id: req.params.id});
  console.log(result.deletedCount);
  if(result.deletedCount === 1)res.redirect("/edit-user");
 })

 authRoutes.get("/");

authRoutes.get("/signup", (req, res, next)=>{

})

authRoutes.get("/profile", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("profile", { user: req.user });
});

authRoutes.get("/profile/edit/:id",ensureLogin.ensureLoggedIn(),(req,res,next)=>{
  User.findById({"_id": req.params.id})
  .then (user =>{
    res.render("edit", {user});
  })
  .catch(err =>{
    console.log(err)
  })
});
 authRoutes.post("/profile/edit/:id",ensureLogin.ensureLoggedIn(),(req,res,next)=>{
   User.findByIdAndUpdate({"_id": req.params.id}, {username})
   .then((user)=>{
     res.redirect("profile")
   })
   .catch((err)=>{
     console.log(err)
   })
 });

// Get parts

authRoutes.get("/parts", (req, res ,next)=>{
  Part.find()
  .then (parts =>{
    let user = req.user.id
    res.render("parts", {parts});
  })
  .catch(err =>{
    next(err)
  })
});

authRoutes.get("/parts/add", checkAdmin,(req,res,next)=>{
  res.render("parts-add");
})

authRoutes.post("/parts/add",(req,res,next)=>{
  const {name, brand, carModel, year} = req.body;
  const newPart = new Part({ name, brand, carModel, year});
  newPart.save()
  .then((parts)=>{
    res.redirect("/parts")
  })
  .catch(err =>{
    res.render("parts",{message : req.flash("error")})
  })
})

authRoutes.get("/stores", (req, res, next)=>{
  Store.find().populate("parts")
  .then (store =>{
    let user = req.user.id
    res.render("stores", {store});
  })
  .catch(err =>{
    next(err)
  })
});

//get Search

authRoutes.get("/search", (req, res ,next)=>{
  res.render("search")
});

authRoutes.post("/search", (req,res,next)=>{
  Part.find({name: {$regex: req.body.searchBar, $options: "i"}})
    .then(parts=>{
    res.render("search", {parts})
  })
  .catch(err=>{console.log(err)})
})

module.exports = authRoutes;
