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
  let { username, password, email, province } = req.body;
  let frontendPath;
  if (file !== undefined) {
    frontendPath = "/uploads/" + file.filename;
  } else {
    frontendPath = "/images/default-avatar.png";
  }

  // if any field is missing, signup failed
  if (
    username === undefined ||
    password === undefined ||
    email === undefined ||
    province === undefined
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
        isAdmin: false,
        isBanned: false,
        avatar: frontendPath,
        blockUser: [],
        followUser: [],
        savedEvents: []
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
                  isAdmin: false,
                  isBanned: false,
                  avatar: frontendPath,
                  blockUser: [],
                  followUser: [],
                  savedEvents: []
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
  startDateTime = parseInt(startDateTime);
  endDateTime = parseInt(endDateTime);
  let frontendPath;
  if (file !== undefined) {
    frontendPath = "/uploads/" + file.filename;
  } else {
    frontendPath = "/images/default-banner.png";
  }
  if (
    title === "" ||
    hostId === "" ||
    description === "" ||
    startDateTime === "" ||
    endDateTime === "" ||
    city === "" ||
    location === ""
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

app.post("/render-latest-events", (req, res) => {
  console.log("render-latest-events endpoint hit");

  dbo
    .collection("eventListings")
    .find({})
    .sort({ startDateTime: 1 })
    .toArray((err, events) => {
      if (err) {
        console.log("Error getting latest event listings: ", err);
        res.json({ success: false });
        return;
      }
      let notFeaturedEvents = events.filter(event => {
        return !event.isFeatured;
      });
      let userIds = notFeaturedEvents.map(event => {
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
            return;
          }
          let hosts = users.filter(user => {
            return userIds.includes(user._id.toString());
          });

          res.json({ success: true, notFeaturedEvents, hosts });
        });
    });
});

app.post("/render-featured-events", (req, res) => {
  console.log("render-featured-events endpoint hit");
  dbo
    .collection("eventListings")
    .find({})
    .sort({ startDateTime: 1 })
    .toArray((err, events) => {
      if (err) {
        console.log("Error getting featured event listings: ", err);
        res.json({ success: false });
        return;
      }
      let featuredEvents = events.filter(event => {
        return event.isFeatured;
      });
      console.log("FEATURED EVENTS", featuredEvents);

      let userIds = featuredEvents.map(event => {
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
            return;
          }
          let hosts = users.filter(user => {
            return userIds.includes(user._id.toString());
          });
          res.json({ success: true, featuredEvents, hosts });
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
    if (err || user === null) {
      console.log(["Error in render-user", err, user]);
      res.json({ success: false });
      return;
    }
    res.json({ success: true, user });
  });
});

app.post("/render-followed-users", upload.none(), (req, res) => {
  console.log("render followed users hit");
  let followedUsers = req.body.followedUsers.split(",");
  console.log("FOLLOWEDUSERS", followedUsers);

  dbo
    .collection("users")
    .find({ _id: { $in: followedUsers.map(userId => ObjectID(userId)) } })
    .toArray((err, users) => {
      if (err || users === null) {
        console.log(["Error in render-user", err, users]);
        res.json({ success: false });
        return;
      }
      res.json({ success: true, users });
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

app.post("/update-user-credentials", upload.none(), (req, res) => {
  console.log("update-user-credentials hit");
  let { userId, username, password, email } = req.body;
  dbo
    .collection("users")
    .updateOne(
      { _id: ObjectID(userId) },
      { $set: { username, password, email } },
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

// app.post("/update-username", upload.none(), (req, res) => {
//   console.log("update-username endpoint hit");
//   let userId = req.body.userId;
//   let username = req.body.username;
//   dbo
//     .collection("users")
//     .updateOne(
//       { _id: ObjectID(userId) },
//       { $set: { username } },
//       (err, user) => {
//         if (err || user === null) {
//           return res.json({ success: false, err });
//         }
//         console.log("user document on update", user);

//         return res.json({
//           success: true
//         });
//       }
//     );
// });

// app.post("/update-password", upload.none(), (req, res) => {
//   console.log("update-password endpoint hit");
//   let userId = req.body.userId;
//   let password = req.body.password;
//   dbo
//     .collection("users")
//     .updateOne(
//       { _id: ObjectID(userId) },
//       { $set: { password } },
//       (err, user) => {
//         if (err || user == null) {
//           return res.json({ success: false, err });
//         }
//         return res.json({ success: true });
//       }
//     );
// });

// app.post("/update-email", upload.none(), (req, res) => {
//   console.log("update-email endpoint hit");
//   let userId = req.body.userId;
//   let email = req.body.email;
//   dbo
//     .collection("users")
//     .updateOne({ _id: ObjectID(userId) }, { $set: { email } }, (err, user) => {
//       if (err || user === null) {
//         return res.json({ success: false, err });
//       }
//       return res.json({ success: true });
//     });
// });

app.post("/unfollow-user", upload.none(), (req, res) => {
  console.log("unfollow-user endpoint hit");
  let userId = req.body._id;
  let newUnfollowUser = req.body.followUserId;
  console.log("NEW UNFOLLOW", newUnfollowUser);
  dbo
    .collection("users")
    .updateOne(
      { _id: ObjectID(userId) },
      { $pull: { followUser: newUnfollowUser } },
      (err, user) => {
        if (err || user === null) {
          return res.json({ success: false, err });
        }
        return res.json({ success: true });
      }
    );
});

app.post("/follow-user", upload.none(), (req, res) => {
  console.log("follow-user endpoint hit");
  let userId = req.body._id;
  let newFollowUser = req.body.followUserId;
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
  let userId = req.body._id;
  let newBlockUser = req.body.blockUserId;
  console.log("NEW BLOCK", newBlockUser);
  dbo.collection("users").updateOne(
    { _id: ObjectID(userId) },
    {
      $push: { blockUser: newBlockUser },
      $pull: {
        followUser: newBlockUser
      }
    },
    (err, user) => {
      if (err || user === null) {
        return res.json({ success: false, err });
      }
      return res.json({ success: true });
    }
  );
});

app.post("/unblock-user", upload.none(), (req, res) => {
  console.log("unblock-user endpoint hit");
  let userId = req.body._id;
  let newUnblockUser = req.body.blockUserId;
  console.log("NEW UNBLOCK", newUnblockUser);
  dbo
    .collection("users")
    .updateOne(
      { _id: ObjectID(userId) },
      { $pull: { blockUser: newUnblockUser } },
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
  let searchQuery = req.body.searchQuery;
  dbo
    .collection("eventListings")
    .find({ title: { $regex: new RegExp(searchQuery), $options: "?i" } })
    .toArray((err, events) => {
      if (err) {
        console.log("error retrieving events from title search", err);
        res.json({ success: false });
        return;
      }
      console.log("events array from title search: ", events);
      res.json({ success: true, events });
    });
});

app.post("/search-location", upload.none(), (req, res) => {
  console.log("Search location endpoint hit");
  let searchQuery = req.body.searchQuery;
  dbo
    .collection("eventListings")
    .find({ location: { $regex: new RegExp(searchQuery), $options: "?i" } })
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

app.post("/search-date", upload.none(), (req, res) => {
  console.log("Search date endpoint hit");
  let searchQuery = parseInt(req.body.searchQuery);
  dbo
    .collection("eventListings")
    .find({})
    .toArray((err, events) => {
      let specificEvents = events.filter(event => {
        console.log([
          "LOGGING TIME VALUES: ",
          event.startDateTime,
          searchQuery,
          event.endDateTime,
          searchQuery + 86400000
        ]);
        return (
          // TODO: IMPROVE CONDITION FOR DATE RESULTS
          event.startDateTime > searchQuery &&
          event.endDateTime < searchQuery + 126400000
        );
      });
      if (err) {
        console.log("error retrieving events from date search");
        res.json({ success: false });
        return;
      }
      console.log("events array from date search: ", specificEvents);
      res.json({ success: true, specificEvents });
    });
});

app.post("/sort-category", upload.none(), (req, res) => {
  console.log("sort-category endpoint hit");
  let category = req.body.category;
  let options = req.body.options;
  let parsedOptions = JSON.parse(options);
  let chosenCategory = parsedOptions.filter(option => {
    return option.value === category;
  });
  let reformated = chosenCategory[0];
  dbo
    .collection("eventListings")
    .find({
      categories: reformated
    })
    .toArray((err, events) => {
      console.log("SORT CAT EVENTS", events);

      if (err || events === null) {
        console.log("Error getting categorized events");
        res.json({ success: false });
        return;
      }
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
  let frontendPath;
  if (file !== undefined) {
    frontendPath = "/uploads/" + file.filename;
  } else {
    frontendPath = req.body.currentBanner;
  }

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
  categories = JSON.parse(categories);
  startDateTime = parseInt(startDateTime);
  endDateTime = parseInt(endDateTime);

  dbo.collection("eventListings").findOneAndUpdate(
    { _id: ObjectID(eventId) },
    {
      $set: {
        title,
        hostId,
        description,
        startDateTime,
        endDateTime,
        city,
        location,
        banner: frontendPath,
        categories
      }
    },
    { returnOriginal: false },
    (err, event) => {
      if (err || event === null) {
        //console.log("Event update unsuccessful", event);
        res.json({ success: false });
        return;
      }
      console.log("sending updated event", event);
      let updatedEvent = event.value;
      // updatedEvent.categories = JSON.parse(updatedEvent.categories);
      console.log("updatedEvent Categories", updatedEvent.categories);

      res.json({ success: true, event: updatedEvent });
      return;
    }
  );
});

app.post("/hosting-event", upload.none(), (req, res) => {
  console.log("hosting event endpoint hit");
  let userId = req.body.userId;
  console.log("HOST USERID", userId);

  dbo
    .collection("eventListings")
    .find({ hostId: userId })
    .toArray((err, events) => {
      if (err || events === null) {
        console.log("Error getting events I am hosting");
        res.send({ success: false });
        return;
      }
      console.log("HOSTING EVENTS", events);

      res.send({ success: true, events });
    });
});

app.post("/saved-events", upload.none(), (req, res) => {
  console.log("saved events endpoint hit");
  let userId = req.body.userId;
  console.log("USERID", userId);
  dbo.collection("users").findOne(
    {
      _id: ObjectID(userId)
    },
    (err, user) => {
      if (err || user === null) {
        console.log("Error getting user to check saved events");
        res.send({
          success: false
        });
        return;
      }
      console.log("THE USER", user);

      let usersSavedEvents = user.savedEvents;
      console.log("MY SAVED EVENTS: ", usersSavedEvents);
      dbo
        .collection("eventListings")
        .find({
          _id: {
            $in: user.savedEvents.map(eventId => ObjectID(eventId))
          }
        })
        .toArray((err, events) => {
          if (err) {
            console.log("Error getting events from user's savedEvents array");
            res.send({
              success: false
            });
            return;
          }
          console.log("result of saved events search: ", events);
          res.json({
            success: true,
            events
          });
        });
    }
  );
});

app.post("/followed-hosts", upload.none(), (req, res) => {
  console.log("followed-hosts endpoint hit");
  let userId = req.body.userId;
  console.log("user requesting list of hosts: ", userId);
  dbo.collection("users").findOne({ _id: ObjectID(userId) }, (err, user) => {
    if (err || user === null) {
      console.log("Error getting user in followed-hosts endpoint", user);
      res.json({ success: false });
      return;
    }
    console.log("getting user's preferred hosts: ", user.followUser);

    let followedUserIds = user.followUser;
    console.log("followedUserIds", followedUserIds);
    dbo
      .collection("eventListings")
      .find({})
      .toArray((err, events) => {
        if (err || events === null) {
          res.json({ success: false });
          return;
        }
        let hostIds = events.map(event => {
          return event.hostId;
        });
        console.log("HOSTIDs", hostIds);
        let usersHostingEvents = followedUserIds.filter(userId => {
          return hostIds.includes(userId);
        });
        console.log("usersHostingEvents***", usersHostingEvents);
        res.send(JSON.stringify({ success: true, hosts: usersHostingEvents }));
      });
  });
});

app.post("/get-event-hosts", (req, res) => {
  console.log("get-event-hosts endpoint hit");
  dbo
    .collection("users")
    .find({})
    .toArray((err, users) => {
      if (err || users === null) {
        console.log("Error getting users");
        res.send({ success: false });
        return;
      }

      let hosts = users.map(user => {
        return { _id: user._id, username: user.username };
      });
      console.log("EVENT HOSTS", hosts);
      res.send({ success: true, hosts });
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

// NOTES: create isBanned & isAdmin (bool) properties on every user
