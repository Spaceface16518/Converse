//const modules = require('./assets/module-router.js')
var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);

let port = process.env.PORT || 8080;
server.listen(port);

app.get("/", function(req, res) {
  res.sendFile(".//index.html");
});

io.on("connection", socket => {
  //  socket.join('admin') // join default chat
  //socket.emit("load", { chat: modules.loadChat() }); // Load chat history on init
  socket.on("message", message => {
    io.emit("message", message); // When recive message from client, broadcast that message to all clients (including sender)
  });
});
