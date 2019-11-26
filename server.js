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
  dbo = db.db("EventHorizon");
});
let generateSID = () => {
  return Math.floor(Math.random() * 100000000);
};
reloadMagic(app);

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets

// Your endpoints go after this line

// SIGNUP

app.post("/signup", upload.none(), (req, res, dbo) => {
  console.log("signup endpoint hit", req.body);
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let province = req.body.province;
  let accountType = req.body.accountType;

  // if any field is missing, signup failed
  if (
    username === undefined ||
    password === undefined ||
    email === undefined ||
    province === undefined ||
    accountType === undefined
  ) {
    res.send(JSON.stringify({ success: false }));
    return;
  }
  // dbo.standardUsers.aggregate([  ASK ABOUT LOOKUP
  //   {
  //     $lookup: {
  //       from: "businessUsers",
  //       localField: "username",
  //       foreignField: "username",
  //       as: "usernames"
  //     }
  //   }
  // ]);
  dbo.collection(users).findOne({ email }, (err, user) => {
    if (err) {
      // if db returns error, signup process is terminated
      console.log("There was an error on signup: ", err);
      return res.send(JSON.stringify({ success: false }));
    }

    if (user !== null) {
      // if username is taken, return false with error
      console.log("Username is taken");
      return res.send(JSON.stringify({ success: false, err }));
    }
    // if no error and username is free, add data to collection
    dbo.collection(users).insertOne({
      // should I add messages and event listings to user collection...? I don't know about that...
      username,
      password,
      email,
      province,
      accountType
    });
    res.send(
      JSON.stringify({
        success: true,
        user: {
          username,
          password,
          email,
          province,
          accountType
        }
      })
    );
  });
});
// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
