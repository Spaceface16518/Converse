//const modules = require('./assets/module-router.js')
var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
let registry = [];
let port = process.env.PORT || 8080;
server.listen(port);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/index/", (req, res) => {
  res.sendFile(__dirname + "/index.js");
});

io.on("connection", socket => {
  socket.emit("load"); // Onload functions
  socket.emit("assign color", require('randomcolor')()); // Assign user color

  //  socket.join('admin') // join default chat
  //socket.emit("load", { chat: modules.loadChat() }); // Load chat history on init
  socket.on("message", data => {
    io.emit("message", data); // When recive message from client, broadcast that message to all clients (including sender)
  });
  socket.on('new location', id => {
    io.emit('scroll', id)
  })
});
