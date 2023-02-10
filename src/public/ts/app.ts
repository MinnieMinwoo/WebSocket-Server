declare const io: () => any;
const socket = io();

const myFace = document.getElementById("myFace") as HTMLVideoElement;
const muteBtn = document.getElementById("mute") as HTMLButtonElement;
const cameraBtn = document.getElementById("camera") as HTMLButtonElement;
const cameraSelect = document.getElementById("cameras") as HTMLSelectElement;

const call = document.getElementById("call") as HTMLDivElement;

call.hidden = true;

let myStream: MediaStream;
let muted = false;
let cameraOff = false;
let roomName: string;
let myPeerConnection: RTCPeerConnection;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      cameraSelect.appendChild(option);
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
    });
  } catch (e) {
    console.log(e);
  }
}

async function getMedia(deviceId?: string) {
  const cameraConstraints = {
    audio: true,
    video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: "user" },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(cameraConstraints);
    myFace.srcObject = myStream;
    if (!deviceId) await getCameras();
  } catch (e) {
    console.log(e);
  }
}

function handleMuteClick() {
  if (!myStream) return;
  myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
  if (!muted) muteBtn.innerText = "Unmute";
  else muteBtn.innerText = "Mute";
  muted = !muted;
}
function handleCameraBtnClick() {
  if (!myStream) return;
  myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
  if (!cameraOff) cameraBtn.innerText = "Turn Camera On";
  else cameraBtn.innerText = "Turn Camera Off";
  cameraOff = !cameraOff;
}

async function handleCameraChange() {
  await getMedia(cameraSelect.value);
  const videoTrack = myStream.getVideoTracks()[0];
  if (myPeerConnection) {
    const videoSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track?.kind === "video");
    videoSender?.replaceTrack(videoTrack);
  }
}
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraBtnClick);
cameraSelect.addEventListener("input", handleCameraChange);

// Welcome form

const welcome = document.getElementById("welcome") as HTMLDivElement;
const welcomeForm = welcome.querySelector("form") as HTMLFormElement;

async function initCall() {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
}

async function handleWelcomeSubmit(event: Event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input") as HTMLInputElement;
  await initCall();
  socket.emit("join_room", input.value);
  roomName = input.value;
  input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket code

socket.on("welcome", async () => {
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  socket.emit("offer", offer, roomName);
});

socket.on("offer", async (offer: RTCSessionDescriptionInit) => {
  console.log("received the offer");
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("offer", answer, roomName);
  console.log("sent the answer");
});

socket.on("answer", async (answer: RTCSessionDescriptionInit) => {
  console.log("received the answer");
  myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", async (ice: RTCIceCandidate) => {
  console.log("received candidate");
  myPeerConnection.addIceCandidate(ice);
});

// RTC Code

function makeConnection() {
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });
  myPeerConnection.addEventListener("icecandidate", handleIce);
  myPeerConnection.addEventListener("track", handleAddStream);

  myStream.getTracks().forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data: RTCPeerConnectionIceEvent) {
  console.log("sent candidate");
  socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data: RTCTrackEvent) {
  const peerFace = document.getElementById("peerFace") as HTMLVideoElement;
  peerFace.srcObject = data.streams[0];
}

/*
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
*/
