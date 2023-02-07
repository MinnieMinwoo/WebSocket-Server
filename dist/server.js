"use strict";

var _express = _interopRequireDefault(require("express"));
var _socket = require("socket.io");
var _http = _interopRequireDefault(require("http"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var app = (0, _express["default"])();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", _express["default"]["static"](__dirname + "/public"));
app.get("/", function (req, res) {
  return res.render("home");
});
app.get("/*", function (req, res) {
  return res.redirect("/");
});
var server = _http["default"].createServer(app);
var wsServer = new _socket.Server(server);
function publicRooms() {
  var _wsServer$sockets$ada = wsServer.sockets.adapter,
    sids = _wsServer$sockets$ada.sids,
    rooms = _wsServer$sockets$ada.rooms;
  var publicRooms = [];
  rooms.forEach(function (_, key) {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}
wsServer.on("connection", function (socket) {
  socket["nickname"] = "Anon";
  socket.onAny(function (event) {
    console.log("Socket Event: ".concat(event));
  });
  socket.on("enter_room", function (roomName, nickName, done) {
    socket["nickname"] = nickName;
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket["nickname"]);
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", function () {
    socket.rooms.forEach(function (room) {
      socket.to(room).emit("bye", socket["nickname"]);
    });
  });
  socket.on("disconnect", function () {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", function (msg, room, done) {
    socket.to(room).emit("new_message", "".concat(socket["nickname"], ": ").concat(msg));
    done();
  });
  socket.on("nickname", function (nickname) {
    return socket["nickname"] = nickname;
  });
});
server.listen(3000);