// load libraries

let express = require("express");
let multer = require("multer");
let MongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
let cookieParser = require("cookie-parser");
let reloadMagic = require("./reload-magic.js");

// initialize libraries

let app = express();
let upload = multer({ dest: __dirname + "/uploads/" });
app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
reloadMagic(app);

// mongo setup

let dbo = undefined;
let url =
  "mongodb+srv://mstinis:eR5w+i^<*A@cluster0-xb9sp.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  dbo = db.db("EventHorizon");
});

// globals
let generateSID = () => {
  return Math.floor(Math.random() * 100000000);
};

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
  dbo.collection("users").findOne({ username }, (err, user) => {
    if (err) {
      // if db throws error, end login process
      console.log("There was an error at login: ", err);
      return res.send(JSON.stringify({ success: false, err }));
    }
    if (user === null) {
      // if user doesn't exist, return error
      return res.send(JSON.stringify({ success: false, err }));
    }
    if (user.password === enteredPassword) {
      console.log("Login successful");

      // if passwords match, login is successful and sessionID is generated
      let sid = generateSID();
      dbo
        .collection("sessions")
        .insertOne({ sid, userId: user._id }, (err, session) => {
          if (err) {
            return res.send(JSON.stringify({ success: false }));
          }
          res.cookie("sid", sid, { maxAge: 86400000 });
          // TODO add 'secure: true' to cookie options when site hosted
          return res.send(JSON.stringify({ success: true, user }));
        });
    }
  });
});

// app.post("/auto-login", upload.none(), (req, res) => {
//   let sid = parseInt(req.cookies.sid);
//   console.log("sid: ", sid);
//   dbo.collection("sessions").findOne({ sid }, (err, sid) => {
//     if (err || sid === null) {
//       return res.json({ success: false });
//     }

//     if (sid !== null) {

//     }
//   });
// });

// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
