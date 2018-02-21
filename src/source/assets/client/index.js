$(function() {
  $("#messages").append($("<li>").text("Connected to JQuery"))
  let socket = io();
    $("#messages").append($("<li>").text("Connected to Socket.io"));

  $("form").submit(function() {
    console.log($("#m").val())
    socket.emit("message", $("#m").val());
    $("#m").val("");
    return false;
  });
  socket.on("message", function(msg) {
    console.log(`message recieved: ${msg}`)
    $("#messages").append($("<li>").text(msg));
  });
});
