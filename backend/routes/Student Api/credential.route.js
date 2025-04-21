/* This JavaScript code snippet is setting up a router using the Express framework for a web
application. It imports the necessary modules, defines routes for handling login, registration,
updating, and deleting student credentials, and exports the router for use in the application. */
const express = require("express");
const router = express.Router();
const { loginHandler, registerHandler, updateHandler, deleteHandler } = require("../../controllers/Student/credential.controller.js");

router.post("/login", loginHandler);

router.post("/register", registerHandler);

router.put("/update/:id", updateHandler);

router.delete("/delete/:id", deleteHandler);

module.exports = router;
