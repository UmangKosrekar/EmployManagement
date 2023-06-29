const express = require("express");
const route = express.Router();
const user = require("../controllers/authController");

route.post("/log-in", user.login);
route.get("/check", user.check);

module.exports = route;
