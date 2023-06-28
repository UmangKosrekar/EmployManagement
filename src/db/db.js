const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/todo", (err) => {
  if (err) {
    console.log("connection error...", err);
  } else {
    console.log("connection successfuly.");
  }
});
