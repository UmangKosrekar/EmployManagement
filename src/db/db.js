const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://umang:1234@cluster0.jmxcg.mongodb.net/todo?retryWrites=true&w=majority", (err) => {
  if (err) {
    console.log("connection error...", err);
  } else {
    console.log("connection successfuly.");
  }
});
