//const modules = require('./assets/module-router.js')
// IMPORTS -------------

// MONGODB
const stitch = require("mongodb-stitch")
let stitchClient;
initApplication()

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
  loadData.history = getAllInChat(loadData.chat)
  loadData.color = require("randomcolor")();
});
app.get("/favicon", (req, res) => {
  res.sendFile(__dirname + "/favicon/custom.png");
});

// EVENT HANDLERS ------------
io.on("connection", socket => {
  socket.emit("load", loadData); // Onload functions
  socket.join(loadData.chat);
  loadData = {};

  socket.on("message", data => {
    io.emit("message", data); // When recive message from client, broadcast that message
    enterToMongo(data)
  });
});

// CLASSES
class MessageEncode {
  // INIT
  encoded = {};

  // CONSTRUCTOR
  constructor(raw) {
    this.encoded.head.type = "Message";
    this.encoded.head.chat = raw.chat;
    this.encoded.body.usr = raw.usr;
    this.encoded.body.msg = raw.msg;
    this.encoded.meta.color = raw.color;
    this.encoded.expedite = false;
    this.encoded.timestamp = raw.time;
  }

  // METHODS
  send() {
    stitchClient.executeFunction('add', this.encoded)
  }
}

class MessageDecode {
  // INIT
  decoded = {};

  // CONSTRUCTOR
  constructor(encoded) {
    this.decoded.chat = encoded.head.chat;
    this.decoded.usr = encoded.body.usr;
    this.decoded.msg = encoded.body.msg;
    this.decoded.color = encoded.meta.color;
    this.decoded.time = encoded.timestamp;
  }

  // METHODS
  getDecoded() {
    return this.decoded;
  }
}


// FUNCTIONS
function initApplication() {
  return stitch.StitchClientFactory.create('converse-pnxkb').then(client => {
    stitchClient = client;
  })
}

function enterToMongo(data) {
  let parser = new MessageEncode(data);
  parser.send();
}

function getAllInChat(chat) {
  let parsedDocs = [];
  let docs = stitchClient.executeFunction('getAll', chat);
  docs.foreach(element => {
    let parser = new MessageDecode(element);
    parsedDocs.push(parser.getDecoded);
  })
  return parsedDocs;
}


