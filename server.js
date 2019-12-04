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

// CLEAR EXPIRED COOKIES
setInterval(() => {
  // map all sessions to an array
  dbo
    .collection("sessions")
    .find({})
    .toArray((err, sessions) => {
      if (err) {
        console.log("error getting sessions from database: ", err);
        return;
      }
      let expiredSessions = [];
      // evaluate if sessions are expired, if so -> push session ID to expiredSessions array
      sessions.forEach(session => {
        if (session.expirationDate < Date.now()) {
          expiredSessions.push(session._id);
        }
      });
      console.log("expired SESH", expiredSessions);
      // delete all entries in sessions that match the _id's in my expiredSessions array
      dbo.collection("sessions").deleteMany({ _id: { $in: expiredSessions } });
    });
}, 600000);

// SIGNUP
app.post("/signup", upload.single("img"), (req, res) => {
  console.log("signup endpoint hit", req.body);
  let file = req.file;
  let {
    username,
    password,
    email,
    province,
    myCategories,
    accountType
  } = req.body;
  let frontendPath;
  if (file !== undefined) {
    frontendPath = "/uploads/" + file.filename;
  } else {
    frontendPath = "/images/default-avatar.png";
  }
  myCategories = JSON.parse(myCategories);

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
    dbo.collection("users").insertOne(
      {
        username,
        password,
        email,
        province,
        accountType,
        isAdmin: false,
        isBanned: false,
        avatar: frontendPath,
        blockUser: [],
        followUser: [],
        savedEvents: [],
        myCategories
      },
      (err, doc) => {
        let sid = generateSID();
        dbo.collection("sessions").insertOne(
          {
            sid,
            userId: doc.ops[0]._id,
            expirationDate: Date.now() + 86400000
          },
          (err, session) => {
            if (err) {
              return res.send(JSON.stringify({ success: false }));
            }
            res.cookie("sid", sid, { maxAge: 86400000 });
            // TODO add 'secure: true' to cookie options when site hosted
            console.log("SIGNUP USER*****", user);
            return res.send(
              JSON.stringify({
                success: true,
                user: {
                  _id: doc.ops[0]._id,
                  username,
                  password,
                  email,
                  province,
                  accountType,
                  isAdmin: false,
                  isBanned: false,
                  avatar: frontendPath,
                  blockUser: [],
                  followUser: [],
                  savedEvents: [],
                  myCategories
                }
              })
            );
          }
        );
      }
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
    if (user === null || user.password !== enteredPassword) {
      // if user doesn't exist, return error
      return res.send(JSON.stringify({ success: false, err }));
    }
    if (user.password === enteredPassword) {
      console.log("Login successful");

      // if passwords match, login is successful and sessionID is generated
      let sid = generateSID();
      dbo
        .collection("sessions")
        .insertOne(
          { sid, userId: user._id, expirationDate: Date.now() + 86400000 },
          (err, session) => {
            if (err) {
              return res.send(JSON.stringify({ success: false }));
            }
            res.cookie("sid", sid, { maxAge: 86400000 });
            // TODO add 'secure: true' to cookie options when site hosted
            console.log("LOGIN USER*****", user);

            return res.send(
              JSON.stringify({
                success: true,
                user
              })
            );
          }
        );
    }
  });
});

app.post("/logout", upload.none(), (req, res) => {
  let sid = parseInt(req.cookies.sid);
  console.log("sid: ", sid);
  dbo.collection("sessions").findOneAndDelete({ sid }, (err, session) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({ success: true });
  });
});

app.post("/auto-login", upload.none(), (req, res) => {
  let sid = parseInt(req.cookies.sid);
  console.log("sid: ", sid);
  dbo.collection("sessions").findOne({ sid }, (err, session) => {
    if (err || session === null) {
      return res.json({ success: false });
    }

    if (session !== null) {
      dbo
        .collection("users")
        .findOne({ _id: ObjectID(session.userId) }, (err, user) => {
          if (err) {
            console.log("Something is wrong...");
            return res.json({ success: false });
          }
          console.log("active user: ", user.username);
          return res.json({
            success: true,
            user
          });
        });
    }
  });
});

app.post("/new-event", upload.single("img"), (req, res) => {
  console.log("new event endpoint hit");
  let file = req.file;
  let {
    title,
    hostId,
    description,
    startDateTime,
    endDateTime,
    city,
    location,
    categories
  } = req.body;
  categories = JSON.parse(categories);
  let frontendPath;
  if (file !== undefined) {
    frontendPath = "/uploads/" + file.filename;
  } else {
    frontendPath = "/images/default-banner.png";
  }
  if (
    title === undefined ||
    hostId === undefined ||
    description === undefined ||
    startDateTime === undefined ||
    endDateTime === undefined ||
    city === undefined ||
    location === undefined
  ) {
    res.json({ success: false });
    return;
  }

  dbo
    .collection("eventListings")
    .findOne({ _id: ObjectID() }, (err, listing) => {
      if (err) {
        console.log("There was an error on event creation: ", err);
        return res.json({ success: false });
      }
      dbo.collection("eventListings").insertOne({
        title,
        hostId,
        description,
        startDateTime,
        endDateTime,
        city,
        location,
        banner: frontendPath,
        categories,
        comments: [],
        isFeatured: false,
        isSpam: false
      });
      res.json({ success: true });
    });
});

app.post("/render-events", (req, res) => {
  console.log("render-events endpoint hit");

  dbo
    .collection("eventListings")
    .find({})
    .toArray((err, events) => {
      if (err) {
        console.log("Error getting event listings: ", err);
        return res.json({ success: false });
      }
      let userIds = events.map(event => {
        return event.hostId;
      });
      dbo
        .collection("users")
        .find({})
        .toArray((err, users) => {
          if (err) {
            console.log(
              "error getting users from event listings endpoint: ",
              err
            );
            res.json({ success: false });
          }
          let hosts = users.filter(user => {
            return userIds.includes(user._id.toString());
          });

          return res.json({ success: true, events, hosts });
        });
    });
});

app.post("/render-single-event", upload.none(), (req, res) => {
  console.log("single-event endpoint hit");
  let eventId = req.body.eventId;
  dbo
    .collection("eventListings")
    .findOne({ _id: ObjectID(eventId) }, (err, event) => {
      if (err) {
        console.log("Error getting event: ", err);
        res.json({ success: false });
        return;
      }
      res.json({ success: true, event });
    });
});

app.post("/render-user", upload.none(), (req, res) => {
  console.log("RENDER USER HIT", req.body._id);

  let userId = req.body._id;
  dbo.collection("users").findOne({ _id: ObjectID(userId) }, (err, user) => {
    if (err) {
      console.log("Error in render-user");
      return res.json({ success: false });
    }
    if (user === null || user === undefined) {
      console.log("user not found");
      return res.json({ success: false });
    }
    return res.json({ success: true, user });
  });
});

app.post("/update-avatar", upload.single("img"), (req, res) => {
  console.log("update-avatar endpoint hit");
  let file = req.file;
  let userId = req.body.userId;
  let frontendPath = "/uploads/" + file.filename;
  dbo
    .collection("users")
    .updateOne(
      { _id: ObjectID(userId) },
      { $set: { avatar: frontendPath } },
      (err, user) => {
        if (err || user === null) {
          return res.json({ success: false, err });
        }
        return res.json({ success: true });
      }
    );
});

app.post("/update-username", upload.none(), (req, res) => {
  console.log("update-username endpoint hit");
  let userId = req.body.userId;
  let username = req.body.username;
  dbo
    .collection("users")
    .updateOne(
      { _id: ObjectID(userId) },
      { $set: { username } },
      (err, user) => {
        if (err || user === null) {
          return res.json({ success: false, err });
        }
        console.log("user document on update", user);

        return res.json({
          success: true
        });
      }
    );
});

app.post("/update-password", upload.none(), (req, res) => {
  console.log("update-password endpoint hit");
  let userId = req.body.userId;
  let password = req.body.password;
  dbo
    .collection("users")
    .updateOne(
      { _id: ObjectID(userId) },
      { $set: { password } },
      (err, user) => {
        if (err || user == null) {
          return res.json({ success: false, err });
        }
        return res.json({ success: true });
      }
    );
});

app.post("/update-email", upload.none(), (req, res) => {
  console.log("update-email endpoint hit");
  let userId = req.body.userId;
  let email = req.body.email;
  dbo
    .collection("users")
    .updateOne({ _id: ObjectID(userId) }, { $set: { email } }, (err, user) => {
      if (err || user === null) {
        return res.json({ success: false, err });
      }
      return res.json({ success: true });
    });
});

app.post("/follow-user", upload.none(), (req, res) => {
  console.log("follow-user endpoint hit");
  let userId = req.body.userId;
  let newFollowUser = req.body.followUser;
  console.log("NEW FOLLOW", newFollowUser);
  dbo
    .collection("users")
    .updateOne(
      { _id: ObjectID(userId) },
      { $push: { followUser: newFollowUser } },
      (err, user) => {
        if (err || user === null) {
          return res.json({ success: false, err });
        }
        return res.json({ success: true });
      }
    );
});

app.post("/block-user", upload.none(), (req, res) => {
  console.log("block-user endpoint hit");
  let userId = req.body.userId;
  let newBlockUser = req.body.blockUser;
  console.log("NEW BLOCK", newBlockUser);
  dbo
    .collection("users")
    .updateOne(
      { _id: ObjectID(userId) },
      { $push: { blockUser: newBlockUser } },
      (err, user) => {
        if (err || user === null) {
          return res.json({ success: false, err });
        }
        return res.json({ success: true });
      }
    );
});

app.post("/search-title", upload.none(), (req, res) => {
  console.log("Search title endpoint hit");
  let searchQuery = new RegExp(req.body.searchQuery);
  dbo
    .collection("eventListings")
    .find({ title: searchQuery })
    .toArray((err, events) => {
      if (err) {
        console.log("error retrieving events from title search");
        res.json({ success: false });
        return;
      }
      console.log("events array from title search: ", events);
      res.json({ success: true, events });
    });
});

app.post("/search-location", upload.none(), (req, res) => {
  console.log("Search location endpoint hit");
  let searchQuery = new RegExp(req.body.searchQuery);
  dbo
    .collection("eventListings")
    .find({ location: searchQuery })
    .toArray((err, events) => {
      if (err) {
        console.log("error retrieving events from location search");
        res.json({ success: false });
        return;
      }
      console.log("events array from location search: ", events);
      res.json({ success: true, events });
    });
});

app.post("/save-event", upload.none(), (req, res) => {
  console.log("save-event endpoint hit");
  let { _id, eventId } = req.body;
  // sdkskldjdsklj
  console.log("NEW EVENT SAVE", eventId);
  dbo
    .collection("users")
    .updateOne(
      { _id: ObjectID(_id) },
      { $push: { savedEvents: eventId } },
      (err, user) => {
        if (err || user === null) {
          console.log("Error, could not save ", err);
          res.json({ success: false });
          return;
        }
        res.json({ success: true });
      }
    );
});

app.post("/discard-saved-event", upload.none(), (req, res) => {
  console.log("Discard saved event endpoint hit");
  let { _id, eventId } = req.body;
  console.log("DISCARD SAVED EVENT", eventId);
  dbo
    .collection("users")
    .update(
      { _id: ObjectID(_id) },
      { $pull: { savedEvents: eventId } },
      (err, user) => {
        if (err || user === null) {
          console.log("Could not update savedEvents array");
          res.json({ success: false });
          return;
        }
        res.json({ success: true });
      }
    );
});

app.post("/update-event", upload.single("img"), (req, res) => {
  console.log("new update-event endpoint hit");
  let file = req.file;
  let {
    eventId,
    title,
    hostId,
    description,
    startDateTime,
    endDateTime,
    city,
    location,
    categories
  } = req.body;
  let frontendPath = "/uploads/" + file.filename;

  dbo.collection("eventListings").findOneAndUpdate(
    { _id: ObjectID(eventId) },
    {
      $set: title,
      hostId,
      description,
      startDateTime,
      endDateTime,
      city,
      location,
      frontendPath,
      categories
    },
    { returnOriginal: false },
    (err, event) => {
      if (err || event === null) {
        console.log("Event update unsuccessful");
        res.json({ success: false });
        return;
      }
      res.json({ success: true, event });
      return;
    }
  );
});

// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});

// NOTES: create isBanned & isAdmin (bool) properties on every user
