const app = require("express")();
const { checkAuth } = require("../middleware/authentication");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");

app.use("/auth", authRoute);

app.use(checkAuth);

app.use("/user", userRoute);

module.exports = app;
