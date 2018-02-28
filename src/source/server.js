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
app.get("/favicon", (req, res) => {
  res.sendFile(__dirname + "/favicon/custom.png");
});

io.on("connection", socket => {
  socket.emit("load", loadData); // Onload functions
  socket.join(loadData.chat);
  loadData = {};

  // TODO: Load chat history on init, with mongoDB
  socket.on("message", data => {
    io.emit("message", data); // When recive message from client, broadcast that message
  });
});
