var messageList = document.querySelector("ul");
var nickForm = document.querySelector("#nick");
var messageForm = document.querySelector("#message");
var frontSocket = new WebSocket("ws://".concat(window.location.host));
function makeMessage(type, payload) {
    var msg = { type: type, payload: payload };
    return JSON.stringify(msg);
}
frontSocket.addEventListener("open", function () {
    console.log("Connected to Server ^^");
});
frontSocket.addEventListener("close", function () {
    console.log("DisConnected to Server ^^");
});
function handleSubmit(event) {
    event.preventDefault();
    var input = messageForm === null || messageForm === void 0 ? void 0 : messageForm.querySelector("input");
    if (input) {
        frontSocket.send(makeMessage("new_message", input.value));
        var li = document.createElement("li");
        li.innerText = "You: ".concat(input.value);
        messageList === null || messageList === void 0 ? void 0 : messageList.append(li);
        input.value = "";
    }
}
function handleNickSubmit(event) {
    event.preventDefault();
    var input = nickForm === null || nickForm === void 0 ? void 0 : nickForm.querySelector("input");
    if (input) {
        frontSocket.send(makeMessage("nickname", input.value));
    }
}
messageForm === null || messageForm === void 0 ? void 0 : messageForm.addEventListener("submit", handleSubmit);
nickForm === null || nickForm === void 0 ? void 0 : nickForm.addEventListener("submit", handleNickSubmit);
