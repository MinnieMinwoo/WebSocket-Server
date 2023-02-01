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

wss.on("connection", (backSocket: WebSocket) => {
    console.log("Connected to Browser ^^");
    backSocket.send("hello!");
});

server.listen(3000);
