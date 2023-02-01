const frontSocket: WebSocket = new WebSocket(`ws://${window.location.host}`);

frontSocket.addEventListener("open", () => {
    console.log("Connected to Server ^^");
});

frontSocket.addEventListener("message", (message: MessageEvent) => {
    console.log("Just got This: ", message.data, " from the server");
});

frontSocket.addEventListener("close", () => {
    console.log("DisConnected to Server ^^");
});
