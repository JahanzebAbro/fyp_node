const express = require("express");
const router = express.Router();
// const pool = require(__dirname + "/db/db_config");


// ROUTES

// Create a user
// router.post()

// Get a user
// router.get()

// Update a user
// router.post()

// Delete a user


// Get all users


// Static ALWAYS before dynamic
// Static Routes
// router.get("/", (req, res) => {
//     res.send("User List");
// })

// router.post("/", (req, res) => {
//     res.redirect("users/1");
// })


// // Create new user
// router.get("/new", (req, res) => {
//     res.render("register");
// })


// // Dynamic Routes
// router
//     .route("/:id")
//     .get((req, res) => {
//         console.log(req.user);
//         res.send(`Get User ID ${req.params.id}`);
//     })
//     .put((req, res) => {
//         res.send(`Update User ID ${req.params.id}`);
//     })
//     .delete((req, res) => {
//         res.send(`Delete User ID ${req.params.id}`);
//     });

    
// // Whenever router sees the param id it runs this
// // middleware code (action between req. and res.)

// const users = [{name: "Bilbo"}, {name: "Keisha"}];
// router.param("id", (req, res, next, id) => {
//     req.user = users[id];
//     next();
// })



module.exports = router;