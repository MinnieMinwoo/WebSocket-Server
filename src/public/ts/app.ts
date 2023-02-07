declare const io: () => any;
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome?.querySelector("form");
const room = document.getElementById("room");

let roomName: string;

function addMessage(message: string) {
  const ul = room?.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul?.appendChild(li);
}

if (room) room.hidden = true;

function handleMessageSubmit(event: Event) {
  event.preventDefault();
  const input = room?.querySelector("#msg input") as HTMLInputElement;
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
    input.value = "";
  });
}

function handleNicknameSubmit(event: Event) {
  event.preventDefault();
  const input = room?.querySelector("#name input") as HTMLInputElement;
  socket.emit("nickname", input.value);
}

function showRoom() {
  if (welcome) welcome.hidden = true;
  if (room) room.hidden = false;
  const h3 = room?.querySelector("h3");
  if (h3) h3.innerText = `Room ${roomName}`;
  const msgForm = room?.querySelector("#msg");
  const nameForm = room?.querySelector("#name");
  msgForm?.addEventListener("submit", handleMessageSubmit);
  nameForm?.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event: Event) {
  event.preventDefault();
  const roomInput = form?.querySelector("#roomName") as HTMLInputElement;
  const nameInput = form?.querySelector("#firstName") as HTMLInputElement;
  socket.emit("enter_room", roomInput.value, nameInput.value, showRoom);
  roomName = roomInput.value;
  roomInput.value = "";
  const changeNameInput = room?.querySelector("#name input ") as HTMLInputElement;
  changeNameInput.value = nameInput.value;
}

form?.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user: string, newCount: number) => {
  const h3 = room?.querySelector("h3");
  if (h3) h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} joined`);
});

socket.on("bye", (left: string, newCount: number) => {
  const h3 = room?.querySelector("h3");
  if (h3) h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${left} left 으앙`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms: string[]) => {
  const roomList = welcome?.querySelector("ul") as HTMLElement;
  if (rooms.length === 0) {
    roomList.innerHTML = "";
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList?.append(li);
  });
});
