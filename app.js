let express = require("express");
const { Socket } = require("socket.io");
let app = express();
let http = require("http").createServer(app);
var socketIO = require("socket.io")(http);

app.use(express.static("static"))

app.get("/:code", (req, res) => {
    res.sendFile(__dirname + "/static/index.html");
});

http.listen(process.env.port || 3000, () => {
    console.log("listening on *:3000");
});

socketIO.on("connection", (socket) => {

    socket.on("create room", () => {
        socketIO.to(socket.id).emit("created room",
            createRoom(socket.id));
        console.log(storytellers);
    });

    socket.on("join room", (code) => {
        if(Object.keys(storytellers).includes(code)) {
            storytellers[socket.id] = storytellers[code];
            socketIO.to(socket.id).emit("joined room");
        } else
            socketIO.to(socket.id).emit("failed to join room");
    });

    socket.on("update card", (info) => {
        socketIO.to(storytellers[socket.id]).emit("update card", info, socket.id);
    });

    socket.on("update card back", (info, address) => {
        socketIO.to(address).emit("update card back", info);
    });

    socket.on("personality2", ()=> {
        for(personality of keysByValue(storytellers, socket.id)) {
            socketIO.to(personality).emit("personality2");
        }
    });

    socket.on("disconnect", ()=>{
        if (Object.keys(storytellers).includes(socket.id)) {
            socketIO.to(storytellers[socket.id]).emit("player disconnected", socket.id);
            delete storytellers[socket.id];
        } else {
            // let code = Object.keys(storytellers).find((key)=> storytellers[key] === socket.id);
            let code = keyByValue(storytellers, socket.id);
            console.log(code);
            delete storytellers[code];
        }
    });
});


function keyByValue(object, value) {
    return Object.keys(object).find((key)=> storytellers[key] === value);
}
function keysByValue(object, value) {
    return Object.keys(object).filter((key)=> storytellers[key] === value);
}

let storytellers = {};

function createRoom(storyteller) {
    let code = "";

    do {
        for (let i = 0; i < 4; i++) {
            code += String.fromCharCode(Math.round(
                65 + Math.random() * 25));
        }
    } while (Object.keys(storytellers)
        .includes(code))

    storytellers[code] = storyteller;

    return code;
}