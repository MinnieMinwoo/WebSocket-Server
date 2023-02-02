import express, { Response, Request } from "express";
import WebSocket from "ws";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req: Request, res: Response) => res.render("home"));
app.get("/*", (req: Request, res: Response) => res.redirect("/"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const sockets: WebSocket[] = [];

wss.on("connection", (backSocket: WebSocket) => {
    sockets.push(backSocket);
    backSocket["nickname"] = "Anon";
    console.log("Connected to Browser ^^");
    backSocket.on("close", () => {
        console.log("Disconnected to Browser ^^");
    });
    backSocket.on("message", (msg: WebSocket.RawData) => {
        const message = JSON.parse(msg.toString());
        switch (message.type) {
            case "new_message":
                sockets.forEach((aSocket) =>
                    aSocket.send(`${backSocket["nickname"]} : ${message.payload}`)
                );
                break;
            case "nickname":
                backSocket["nickname"] = message.payload;
                break;
        }
    });
});

server.listen(3000);
