const express = require("express");
const route = express.Router();
const user = require("../controllers/userController");

route.post("/add", user.add);

module.exports = route;
