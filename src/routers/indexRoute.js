const app = require("express")();
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");

app.use("/auth", authRoute);
app.use("/user", userRoute);

module.exports = app;
