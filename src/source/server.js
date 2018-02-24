//const modules = require('./assets/module-router.js')
var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
let registry = [];
let port = process.env.PORT || 8080;
server.listen(port);
let loadData = {};
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  loadData.usr = req.query.usr;
  loadData.chat = req.query.chat;
  loadData.color = require("randomcolor")();
});
});

io.on("connection", socket => {
  socket.emit("load", loadData); // Onload functions
  socket.join(loadData.chat);
  loadData = {};
  io.to("alien5").emit("message", {
    id: Math.random()
      .toString(36)
      .slice(2),
    msg: "Testing, testing; this thing on?",
    usr: "alien",
    chat: "alien5",
    color: "#f49842",
    time: new Date()
  });

  // TODO: Load chat history on init, with mongoDB
  socket.on("message", data => {
    io.emit("message", data); // When recive message from client, broadcast that message
  });
});
