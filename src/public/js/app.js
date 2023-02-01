var frontSocket = new WebSocket("ws://".concat(window.location.host));
frontSocket.addEventListener("open", function () {
    console.log("Connected to Server ^^");
});
frontSocket.addEventListener("message", function (message) {
    console.log("Just got This: ", message.data, " from the server");
});
frontSocket.addEventListener("close", function () {
    console.log("DisConnected to Server ^^");
});
