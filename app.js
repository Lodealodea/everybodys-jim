let express = require("express");
const { Socket } = require("socket.io");
let app = express();
let http = require("http").createServer(app);
var socketIO = require("socket.io")(http);

app.use(express.static("static"))

app.get("/:code", (req, res) => {
    res.sendFile(__dirname + "/static/index.html");
});

http.listen(process.env.PORT || 3000, () => {
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

    socket.on("score request", (name, score, goal, reason)=>{
        socketIO.to(storytellers[socket.id]).emit("score request", name, score, goal, reason, socket.id);//, name, score, goal, reason, socket.id);
    });

    socket.on("score accepted", (points, goal, reason, address)=>{
        socketIO.to(address).emit("score accepted", points, goal, reason);
    });

    socket.on("score denied", (score, goal, reason, denial, address)=>{
        socketIO.to(address).emit("score denied", score, goal, reason, denial);
    });

    socket.on("vote modal", (d20, d10, domiAddress, perCount) => {
        for(personality of keysByValue(storytellers, socket.id)) {
            socketIO.to(personality).emit("vote modal", d10, d20, personality === domiAddress);
        }
        votes[socket.id] = 0;
        allvotes[socket.id] = perCount - 1;
        // console.log(`votes: ${votes[sock]}`);
    });

    socket.on("voted", (inFavor)=>{
        allvotes[storytellers[socket.id]] -= 1;
        if(!inFavor) {
            votes[storytellers[socket.id]] += 1;
            let v = votes[storytellers[socket.id]];
            for(personality of keysByValue(storytellers, storytellers[socket.id])) {
                console.log(`sent new score to ${personality}`);
                socketIO.to(personality).emit("vote updated", v);
            }
            socketIO.to(storytellers[socket.id]).emit("vote updated", v);
        }
        if(allvotes[storytellers[socket.id]] == 0) {
            console.log("-------all voted-------");
            socketIO.to(storytellers[socket.id]).emit("vote over", votes[storytellers[socket.id]]);
        }
    });

    socket.on("time over", ()=>{
        socketIO.to(socket.id).emit("vote over", votes[socket.id]);
    });

    socket.on("dice roll", (d20, d10, domiAddress)=>{
        for(personality of keysByValue(storytellers, socket.id)) {
            socketIO.to(personality).emit("dice roll", d20, d10, personality === domiAddress);
        }
    });

    socket.on("roll button clicked", ()=>{
        console.log("func called");

        let d20arr = new Array(20);
        d20arr[0] = Math.ceil(Math.random() * 20);
        for(let i = 1; i < d20arr.length; i++) {
            do {
                d20arr[i] = Math.ceil(Math.random() * 20);
            } while(d20arr[i] == d20arr[i - 1]);
        }
        let d10arr = new Array(23);
        d10arr[0] = Math.ceil(Math.random() * 10);
        for(let i = 1; i < d10arr.length; i++) {
            do {
                d10arr[i] = Math.ceil(Math.random() * 10);
            } while(d10arr[i] == d10arr[i - 1]);
        }

        console.log("arrs set");

        for(personality of keysByValue(storytellers, storytellers[socket.id])) {
            socketIO.to(personality).emit("roll button clicked", d20arr, d10arr);
        }
        socketIO.to(storytellers[socket.id]).emit("roll button clicked", d20arr, d10arr);

        // //DELETE IMPORTENT TO DELETE
        // socketIO.to(socket.id).emit("roll button clicked", d20arr, d10arr);
        // console.log("response emitted");
    });

    socket.on("continue button clicked", ()=>{
        for(personality of keysByValue(storytellers, socket.id)) {
            socketIO.to(personality).emit("continue button clicked");
        }
    });

    socket.on("summary", (cardsInfo, winnerKeys)=>{
        for(personality of keysByValue(storytellers, socket.id)) {
            socketIO.to(personality).emit("summary", cardsInfo, winnerKeys);
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

let allvotes = {};
let votes = {};
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
    votes[storyteller] = 0;
    allvotes[storyteller] = 0;

    return code;
}
