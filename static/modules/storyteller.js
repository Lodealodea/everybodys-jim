import {elem, style} from "./core.js";
import {container, padder, StyleBtn} from "./addons.js";
import { Card } from "./card.js";
import { copy } from "./general.js";
import { storyteller2 } from "./storyteller2.js"; 


export function storyteller(parent, code, socket) {
    let html = elem(parent);

    let button = new StyleBtn(html, "Copy room link");
    button.html.onclick = () => {
        copy(window.location.href + code);
    };

    padder(html, 20);

    let tip = elem(html, "p");
    tip.innerText = "Share the room link to invite players";
    style(tip, `font-size: 24px`);

    let box = container(html, "Personalities");
    box.style.visibility = "hidden";
    
    padder(html, 20);

    let startBtn = new StyleBtn(html, "Start game");
    startBtn.html.style.visibility = "hidden";



    let cards = {};


    let updateStartBtn = ()=> {
        startBtn.html.disabled = (()=> {
            for(let card of Object.values(cards))
                for(let j = 0; j < 2; j++)
                    if (!card.abilities[j].checkbox.checked ||
                        !card.goals[j].checkbox.checked)
                        return false; //CHANGE TO TRUE
            return false;
        })();
    }

    let removeCard = (sender)=> {
        cards[sender].wrapper.remove();
        delete cards[sender];
    };

    let setOnUpdated = (sender)=>{
        let timeoutFunc = null;
        cards[sender].onUpdated = ()=>{
            clearTimeout(timeoutFunc);
            timeoutFunc = setTimeout(()=>{
                let info = {};
                info["name"] = cards[sender].name.innerText;
                info["abilities"] = [];
                for (let i = 0; i < 2; i++) {
                    info["abilities"].push({});
                    info["abilities"][i]["checked"] =
                        cards[sender].abilities[i].checkbox.checked;
                    info["abilities"][i]["text"] =
                        cards[sender].abilities[i].textarea.value;
                }
                info["goals"] = [];
                for (let i = 0; i < 2; i++) {
                    info["goals"].push({});
                    info["goals"][i]["checked"] =
                        cards[sender].goals[i].checkbox.checked;
                    info["goals"][i]["score"] =
                        cards[sender].goals[i].score.value;
                    info["goals"][i]["text"] =
                        cards[sender].goals[i].textarea.value;
                }

                socket.emit("update card back", info, sender);
            }, /*1000*/0);

            updateStartBtn();
        }
    };

    socket.on("update card", (info, sender)=>{
        if (!Object.keys(cards).includes(sender)) {
            cards[sender] = new Card(box, true);
            setOnUpdated(sender);
        } 
        if (info["name"] != "") {
            cards[sender].name.innerText = info["name"];
            for (let i = 0; i < 2; i++) {
                cards[sender].abilities[i].textarea.value =
                    info["abilities"][i];
                cards[sender].abilities[i].updateTextboxHeight();
            }
            for (let i = 0; i < 2; i++) {
                cards[sender].goals[i].textarea.value =
                    info["goals"][i];
                cards[sender].goals[i].updateTextboxHeight();
            }
        }
        else {
            removeCard(sender);
        }

        if (Object.keys(cards).length === 0) {
            tip.style.visibility = "visible";
            tip.style.position = "static";
            box.style.visibility = "hidden";
            startBtn.html.style.visibility = "hidden";
        } else {
            tip.style.visibility = "hidden";
            tip.style.position = "absolute";
            box.style.visibility = "visible";
            startBtn.html.style.visibility = "visible";
        }
    });

    socket.on("player disconnected", (sender)=>{
        removeCard(sender);
    });


    startBtn.html.onclick = ()=>{
        html.remove();
        socket.emit("personality2");
        storyteller2(parent, socket);
    };
}