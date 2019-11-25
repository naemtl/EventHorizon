let express = require("express");
let app = express();
let reloadMagic = require("./reload-magic.js");
let MongoClient = require("mongodb".MongoClient);
let ObjectID = require("mongodb").ObjectID;
let multer = require("multer");
let upload = multer({ dest: __dirname + "/uploads/" });
app.use("/uploads", express.static("uploads"));
let dbo = undefined;
let url =
  "mongodb+srv://mstinis:eR5w+i^<*A@cluster0-xb9sp.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  dbo = db.db("event-horizon");
});
//test
reloadMagic(app);

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets

// Your endpoints go after this line

// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
