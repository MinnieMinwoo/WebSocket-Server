import express, { Response, Request } from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req:Request, res:Response) => res.render("home"));
app.get("/*", (req:Request, res:Response) => res.redirect("/"));
app.listen(3000);
