// app.js
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const tagRoutes = require("./routes/tag");

const app = express();

mongoose
  .connect(process.env.DATABASE_CLOUD)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB connection error:", err));

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: '*',  // allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // if you want to allow cookies/credentials
}));


app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

app.use("/api", blogRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", tagRoutes);

module.exports = app;
