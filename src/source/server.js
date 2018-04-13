//const modules = require('./assets/module-router.js')
// IMPORTS -------------
require('dotenv').config()
// MONGODB
const stitch = require("mongodb-stitch");
let db;
const clientPromise = stitch.StitchClientFactory.create(process.env.APP_ID);
console.log(process.env.APP_ID)
let clientID;
clientPromise.then(client => {
  db = client.service("mongodb", "mongodb-atlas").db("Chats");
  client.authenticate("anon")
  .then( authedUserId => {
      console.log("logged in anonymously as user", authedUserId);
  })
  .catch( err => {
      console.error("failed to log in anonymously:", err);
  });
})
  /*
    .then(() =>
      db
        .collection("Open")
        .find({})
        .limit(100)
        .execute()
    )
    .then(docs => {
      console.log("Found docs", docs);
      console.log("[MongoDB Stitch] Connected to Stitch");
    })
    .then(() => {
      console.log(client.authedId());
      clientID = client.authedId();
    })
    .catch(err => {
      console.error(err);
    });
});*/

// SERVER
var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
let registry = [];
let port = process.env.PORT || 8080;
server.listen(port);

let loadData = {};

// ROUTES ---------------
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  loadData.usr = req.query.usr;
  loadData.chat = req.query.chat;
  loadData.history = getAllInChat(req.query.chat);
  loadData.color = require("randomcolor")();
});
app.get("/favicon", (req, res) => {
  res.sendFile(__dirname + "/favicon/custom.png");
});

// EVENT HANDLERS ------------
io.on("connection", socket => {
  console.log("Client connected");
  console.log(`Sending load data: ${loadData.usr}`);
  socket.join(loadData.chat);
  socket.emit("load", loadData); // Onload functions
  console.log("loadData send");
  loadData = {};

  socket.on("message", data => {
    console.log(`message recived: ${data.msg}`);
    io.in(data.chat).emit("message", data); // When recive message from client, broadcast that message
    enterToMongo(data);
  });
  io.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// CLASSES
class MessageEncode {
  // INIT

  // CONSTRUCTOR
  constructor(raw) {
    this.encoded = {};
    this.encoded.owner_id = undefined;
    this.encoded.head = {};
    this.encoded.head.type = "Message";
    this.encoded.head.chat = raw.chat;
    this.encoded.body = {};
    this.encoded.body.usr = raw.usr;
    this.encoded.body.msg = raw.msg;
    this.encoded.meta = {};
    this.encoded.meta.color = raw.color;
    this.encoded.expedite = false;
    this.encoded.timestamp = raw.time;
  }

  // METHODS

  send() {
    console.log("Send function triggered");
    clientPromise.then(client => {
      this.encoded.owner_id = client.authedId();
      console.log(this.encoded.owner_id);
      client.executeFunction("add", this.encoded).catch(err => {
        throw err;
      });
    });
  }
}
class MessageDecode {
  // INIT

  // CONSTRUCTOR
  constructor(incoming) {
    this.encoded = incoming; // COMBAK: code needs cleanup after JSON.parse was removed
    this.decoded.chat = this.encoded.head.chat;
    this.decoded.usr = this.encoded.body.usr;
    this.decoded.msg = this.encoded.body.msg;
    this.decoded.color = this.encoded.meta.color;
    this.decoded.time = this.encoded.timestamp;
  }

  // METHODS
  getDecoded() {
    return this.decoded;
  }
}

// FUNCTIONS

function enterToMongo(data) {
  let parser = new MessageEncode(data);
  parser.send();
}

function getAllInChat(chat) {
  let parsedDocs = [];
  let findDocs = clientPromise.then(client => {
    // BUG: UnhandledPromiseRejectionWarning: SyntaxError: Unexpected token o in JSON at position 1
    client.executeFunction("getAll", chat).then(result => {
      if (typeof result === "array" || typeof result === "object") {
        Array.from(result).forEach(element => {
          let parser = new MessageDecode(element);
          parsedDocs.push(parser.getDecoded());
        });
      } else {
        throw "getAll did not return an valid value: " + result;
      }
    });
  });
  return parsedDocs;
}
