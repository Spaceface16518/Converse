//const modules = require('./assets/module-router.js')
var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
let registry = [];
let port = process.env.PORT || 8080;
server.listen(port);
let loadData = {}
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  loadData.usr = req.query.usr
  loadData.chat = req.query.chat
  loadData.color = require('randomcolor')()
});

io.on("connection", socket => {
  socket.emit("load", loadData); // Onload functions
  loadData = {}

  //  socket.join('admin') // join default chat
  //socket.emit("load", { chat: modules.loadChat() }); // Load chat history on init
  socket.on("message", data => {
    socket.emit("message", data); // When recive message from client, broadcast that message to all clients (including sender)
  });
  socket.on('new id', id => {
    io.emit('scroll', id)
  })
});
