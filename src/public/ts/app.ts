const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const frontSocket: WebSocket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type: string, payload: string) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}

frontSocket.addEventListener("open", () => {
    console.log("Connected to Server ^^");
});

frontSocket.addEventListener("message", (message: MessageEvent) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList?.append(li);
});

frontSocket.addEventListener("close", () => {
    console.log("DisConnected to Server ^^");
});

function handleSubmit(event: Event) {
    event.preventDefault();
    const input = messageForm?.querySelector("input");
    if (input) {
        frontSocket.send(makeMessage("new_message", input.value));
        const li = document.createElement("li");
        li.innerText = `You: ${input.value}`;
        messageList?.append(li);
        input.value = "";
    }
}

function handleNickSubmit(event: Event) {
    event.preventDefault();
    const input = nickForm?.querySelector("input");
    if (input) {
        frontSocket.send(makeMessage("nickname", input.value));
    }
}

messageForm?.addEventListener("submit", handleSubmit);
nickForm?.addEventListener("submit", handleNickSubmit);
