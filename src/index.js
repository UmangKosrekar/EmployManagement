require("dotenv").config();

const express = require("express");
const cors = require("cors");
const coockieParser = require("cookie-parser");
const morgan = require("morgan");
const app = express();

//db
const db = require("./db/db");

const handler = require("./util/response");

// global handler
global.response = handler.response;
global.errorHandler = handler.errorHandler;

require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(coockieParser());
app.use(morgan("dev"));

const indexRoute = require("./routers/indexRoute");
app.use("/api/v1", indexRoute);

const PORT = process.env.port || 4000;

app.listen(PORT, () => {
  db;
  console.log(`server runing on ${PORT}`);
});
