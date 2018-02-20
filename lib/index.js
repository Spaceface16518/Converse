$(function() {
  let socket = io('https://converse2.herokuapp.com/');
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
