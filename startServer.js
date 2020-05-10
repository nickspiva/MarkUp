"use strict";

const { db } = require("./server/db/index");
const app = require("./server/server");
const PORT = 1337;

db.sync() // if you update your db schemas, make sure you drop the tables first and then recreate them
  .then(() => {
    console.log("db synced");
    app.listen(PORT, () =>
      console.log(`studiously serving silly sounds on port ${PORT}`)
    );
  });
