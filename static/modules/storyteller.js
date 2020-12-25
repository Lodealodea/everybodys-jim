import {elem, style} from "./core.js";
import {Container, Padder, StyleBtn} from "./addons.js";
import { Card } from "./card.js";
import { copy } from "./general.js";
import { storyteller2 } from "./storyteller2.js"; 


export function storyteller(parent, code, socket) {
    let html = elem(parent);

    let button = new StyleBtn(html, "Copy room link");
    button.html.onclick = () => {
        copy(window.location.href + code);
    };

    Padder(html, 20);

    let tip = elem(html, "p");
    tip.innerText = "Share the room link to invite players";
    style(tip, `font-size: 24px`);

    let box = Container(html, "Personalities");
    box.style.visibility = "hidden";
    
    Padder(html, 20);

    let startBtn = new StyleBtn(html, "Start game");
    startBtn.html.style.visibility = "hidden";
    startBtn.html.disabled = false; //CHANGE TO TRUE


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
                socket.emit("update card back", cards[sender].getInfo(), sender);
            }, /*1000*/0);

            updateStartBtn();
        }
    };

    socket.on("update card", (info, sender)=>{
        if (!Object.keys(cards).includes(sender)) {
            cards[sender] = new Card(box, true, 0);
            setOnUpdated(sender);
        } 
        if (info["name"] != "") {
            cards[sender].update(info);
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
        storyteller2(parent, socket, (()=>{
            let rtn = [];
            for(let [key, card] of Object.entries(cards))
                rtn.push({key, inner: card.getInfo()});
            return rtn;
        })(), code);
    };
}