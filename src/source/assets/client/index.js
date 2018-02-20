$(function() {
  let socket = io();
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
