var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var socket = io();
var myFace = document.getElementById("myFace");
var muteBtn = document.getElementById("mute");
var cameraBtn = document.getElementById("camera");
var cameraSelect = document.getElementById("cameras");
var call = document.getElementById("call");
call.hidden = true;
var myStream;
var muted = false;
var cameraOff = false;
var roomName;
var myPeerConnection;
function getCameras() {
    return __awaiter(this, void 0, void 0, function () {
        var devices, cameras, currentCamera_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.mediaDevices.enumerateDevices()];
                case 1:
                    devices = _a.sent();
                    cameras = devices.filter(function (device) { return device.kind === "videoinput"; });
                    currentCamera_1 = myStream.getVideoTracks()[0];
                    cameras.forEach(function (camera) {
                        var option = document.createElement("option");
                        option.value = camera.deviceId;
                        option.innerText = camera.label;
                        cameraSelect.appendChild(option);
                        if (currentCamera_1.label === camera.label) {
                            option.selected = true;
                        }
                    });
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getMedia(deviceId) {
    return __awaiter(this, void 0, void 0, function () {
        var cameraConstraints, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cameraConstraints = {
                        audio: true,
                        video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: "user" }
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia(cameraConstraints)];
                case 2:
                    myStream = _a.sent();
                    myFace.srcObject = myStream;
                    if (!!deviceId) return [3 /*break*/, 4];
                    return [4 /*yield*/, getCameras()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    e_2 = _a.sent();
                    console.log(e_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function handleMuteClick() {
    if (!myStream)
        return;
    myStream.getAudioTracks().forEach(function (track) { return (track.enabled = !track.enabled); });
    if (!muted)
        muteBtn.innerText = "Unmute";
    else
        muteBtn.innerText = "Mute";
    muted = !muted;
}
function handleCameraBtnClick() {
    if (!myStream)
        return;
    myStream.getVideoTracks().forEach(function (track) { return (track.enabled = !track.enabled); });
    if (!cameraOff)
        cameraBtn.innerText = "Turn Camera On";
    else
        cameraBtn.innerText = "Turn Camera Off";
    cameraOff = !cameraOff;
}
function handleCameraChange() {
    return __awaiter(this, void 0, void 0, function () {
        var videoTrack, videoSender;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMedia(cameraSelect.value)];
                case 1:
                    _a.sent();
                    videoTrack = myStream.getVideoTracks()[0];
                    if (myPeerConnection) {
                        videoSender = myPeerConnection
                            .getSenders()
                            .find(function (sender) { var _a; return ((_a = sender.track) === null || _a === void 0 ? void 0 : _a.kind) === "video"; });
                        videoSender === null || videoSender === void 0 ? void 0 : videoSender.replaceTrack(videoTrack);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraBtnClick);
cameraSelect.addEventListener("input", handleCameraChange);
// Welcome form
var welcome = document.getElementById("welcome");
var welcomeForm = welcome.querySelector("form");
function initCall() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    welcome.hidden = true;
                    call.hidden = false;
                    return [4 /*yield*/, getMedia()];
                case 1:
                    _a.sent();
                    makeConnection();
                    return [2 /*return*/];
            }
        });
    });
}
function handleWelcomeSubmit(event) {
    return __awaiter(this, void 0, void 0, function () {
        var input;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    input = welcomeForm.querySelector("input");
                    return [4 /*yield*/, initCall()];
                case 1:
                    _a.sent();
                    socket.emit("join_room", input.value);
                    roomName = input.value;
                    input.value = "";
                    return [2 /*return*/];
            }
        });
    });
}
welcomeForm.addEventListener("submit", handleWelcomeSubmit);
// Socket code
socket.on("welcome", function () { return __awaiter(_this, void 0, void 0, function () {
    var offer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, myPeerConnection.createOffer()];
            case 1:
                offer = _a.sent();
                myPeerConnection.setLocalDescription(offer);
                socket.emit("offer", offer, roomName);
                return [2 /*return*/];
        }
    });
}); });
socket.on("offer", function (offer) { return __awaiter(_this, void 0, void 0, function () {
    var answer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("received the offer");
                myPeerConnection.setRemoteDescription(offer);
                return [4 /*yield*/, myPeerConnection.createAnswer()];
            case 1:
                answer = _a.sent();
                myPeerConnection.setLocalDescription(answer);
                socket.emit("offer", answer, roomName);
                console.log("sent the answer");
                return [2 /*return*/];
        }
    });
}); });
socket.on("answer", function (answer) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("received the answer");
        myPeerConnection.setRemoteDescription(answer);
        return [2 /*return*/];
    });
}); });
socket.on("ice", function (ice) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("received candidate");
        myPeerConnection.addIceCandidate(ice);
        return [2 /*return*/];
    });
}); });
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
                ]
            },
        ]
    });
    myPeerConnection.addEventListener("icecandidate", handleIce);
    myPeerConnection.addEventListener("track", handleAddStream);
    myStream.getTracks().forEach(function (track) { return myPeerConnection.addTrack(track, myStream); });
}
function handleIce(data) {
    console.log("sent candidate");
    socket.emit("ice", data.candidate, roomName);
}
function handleAddStream(data) {
    var peerFace = document.getElementById("peerFace");
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
