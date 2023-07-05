const app = require("express")();
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const leaveRoute = require("./leaveRoute");

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/leave", leaveRoute);

module.exports = app;
