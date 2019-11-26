let express = require("express");
let app = express();
let reloadMagic = require("./reload-magic.js");
let MongoClient = require("mongodb").MongoClient;
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

app.post("/signup", upload.none(), (req, res) => {
  console.log("signup endpoint hit", req.body);
  let { username, password, email, province, accountType } = req.body;

  // if any field is missing, signup failed
  if (
    username === undefined ||
    password === undefined ||
    email === undefined ||
    province === undefined ||
    accountType === undefined
  ) {
    res.json({ success: false }); // same as res.send(JSON.stringify({ success: false })
    return;
  }

  dbo.collection("users").findOne({ email }, (err, user) => {
    if (err) {
      // if db returns error, signup process is terminated
      console.log("There was an error on signup: ", err);
      return res.json({ success: false });
    }

    if (user !== null) {
      // if username is taken, return false with error
      console.log("Username is taken");
      return res.send(JSON.stringify({ success: false, err }));
    }
    // if no error and username is free, add new user data to collection
    dbo.collection("users").insertOne({
      username,
      password,
      email,
      province,
      accountType,
      avatar: undefined,
      blockUser: [],
      friendsList: []
    });
    res.send(
      JSON.stringify({
        success: true,
        user: {
          username,
          password,
          email,
          province,
          accountType,
          avatar: undefined,
          blockUser: [],
          friendsList: []
        }
      })
    );
  });
});

app.post("/login", upload.none(), (req, res) => {
  console.log("login endpoint hit", req.body);
  let username = req.body.username;
  let enteredPassword = req.body.password;
  console.log("credentials: ", username, enteredPassword);

  if (username === undefined || enteredPassword === undefined) {
    return res.send(JSON.stringify({ success: false }));
  }
  dbo.collection("users").findOne({ username }, (err, foundUser) => {
    if (err) {
      // if db throws error, end login process
      console.log("There was an error at login: ", err);
      return res.send(JSON.stringify({ success: false, err }));
    }
    if (foundUser === null) {
      // if user doesn't exist, return error
      return res.send(JSON.stringify({ success: false, err }));
    }
    if (foundUser.password === enteredPassword) {
      console.log("Login successful");

      // if passwords match, login is successful and sessionID is generated
      let sid = generateSID();
      dbo
        .collection("sessions")
        .insertOne({ sid, userId: user._id }, (err, insertedSession) => {
          if (err) {
            return res.send(JSON.stringify({ success: false }));
          }
          res.cookie("sid", sid);
          return res.send(JSON.stringify({ success: true, user }));
        });
    }
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
