"use strict";

var socket = io();
var welcome = document.getElementById("welcome");
var form = welcome === null || welcome === void 0 ? void 0 : welcome.querySelector("form");
var room = document.getElementById("room");
var roomName;
function addMessage(message) {
  var ul = room === null || room === void 0 ? void 0 : room.querySelector("ul");
  var li = document.createElement("li");
  li.innerText = message;
  ul === null || ul === void 0 ? void 0 : ul.appendChild(li);
}
if (room) room.hidden = true;
function handleMessageSubmit(event) {
  event.preventDefault();
  var input = room === null || room === void 0 ? void 0 : room.querySelector("#msg input");
  var value = input.value;
  socket.emit("new_message", input.value, roomName, function () {
    addMessage("You: ".concat(value));
    input.value = "";
  });
}
function handleNicknameSubmit(event) {
  event.preventDefault();
  var input = room === null || room === void 0 ? void 0 : room.querySelector("#name input");
  socket.emit("nickname", input.value);
}
function showRoom() {
  if (welcome) welcome.hidden = true;
  if (room) room.hidden = false;
  var h3 = room === null || room === void 0 ? void 0 : room.querySelector("h3");
  if (h3) h3.innerText = "Room ".concat(roomName);
  var msgForm = room === null || room === void 0 ? void 0 : room.querySelector("#msg");
  var nameForm = room === null || room === void 0 ? void 0 : room.querySelector("#name");
  msgForm === null || msgForm === void 0 ? void 0 : msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm === null || nameForm === void 0 ? void 0 : nameForm.addEventListener("submit", handleNicknameSubmit);
}
function handleRoomSubmit(event) {
  event.preventDefault();
  var roomInput = form === null || form === void 0 ? void 0 : form.querySelector("#roomName");
  var nameInput = form === null || form === void 0 ? void 0 : form.querySelector("#firstName");
  socket.emit("enter_room", roomInput.value, nameInput.value, showRoom);
  roomName = roomInput.value;
  roomInput.value = "";
  var changeNameInput = room === null || room === void 0 ? void 0 : room.querySelector("#name input ");
  changeNameInput.value = nameInput.value;
}
form === null || form === void 0 ? void 0 : form.addEventListener("submit", handleRoomSubmit);
socket.on("welcome", function (user) {
  addMessage("".concat(user, " joined"));
});
socket.on("bye", function (left) {
  addMessage("".concat(left, " left \uC73C\uC559"));
});
socket.on("new_message", addMessage);
socket.on("room_change", function (rooms) {
  var roomList = welcome === null || welcome === void 0 ? void 0 : welcome.querySelector("ul");
  if (rooms.length === 0) {
    roomList.innerHTML = "";
    return;
  }
  rooms.forEach(function (room) {
    var li = document.createElement("li");
    li.innerText = room;
    roomList === null || roomList === void 0 ? void 0 : roomList.append(li);
  });
});