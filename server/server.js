const express = require("express");
const path = require("path");
const volleyball = require("volleyball");
const bodyParser = require("body-parser");

const app = express();

app.use(volleyball);

//app.use(express.JSON());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "./static.html")));

app.use(bodyParser.json());

app.use("/api", require("./api"));

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./static.html"));
});

app.use(function(err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error");
});

module.exports = app;
