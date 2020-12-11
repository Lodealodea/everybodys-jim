import {elem, style} from "./core.js";
import {container, padder, StyleBtn} from "./addons.js";
import { Card } from "./card.js";
import { copy } from "./general.js";
import { personality2 } from "./personality2.js";

export function personality(parent, code, socket) {
    let html = elem(parent);

    let box = container(html, "Customize your personality");
    
    let card = new Card(box, false, 0);

    let timeoutFunc = null;
    card.onUpdated = ()=>{
        clearTimeout(timeoutFunc);
        timeoutFunc = setTimeout(() => {

            let info = {};
            info["name"] = card.name.innerText;
            info["abilities"] = [];
            for (let i = 0; i < 2; i++) {
                info["abilities"].push(
                    card.abilities[i].textarea.value
                );
            }
            info["goals"] = [];
            for (let i = 0; i < 2; i++) {
                info["goals"].push(
                    card.goals[i].textarea.value
                );
            }
            socket.emit("update card", info);

        }, /*1000*/0);
    };

    socket.on("update card back", (info)=> {
        card.name.innerText = info["name"];
        for (let i = 0; i < 2; i++) {
            card.abilities[i].checkbox.checked =
                info["abilities"][i]["checked"];
            card.abilities[i].textarea.value =
                info["abilities"][i]["text"];
            card.abilities[i].textarea.readOnly = 
                info["abilities"][i]["checked"];
            card.abilities[i].textarea.style.opacity =
                info["abilities"][i]["checked"] ? 0.5 : 1; 
            card.abilities[i].updateTextboxHeight();
        }
        for (let i = 0; i < 2; i++) {
            card.goals[i].checkbox.checked =
                info["goals"][i]["checked"];
            card.goals[i].score.value =
                info["goals"][i]["score"];
            card.goals[i].textarea.value =
                info["goals"][i]["text"];

            card.goals[i].textarea.readOnly = 
                info["goals"][i]["checked"];
            card.goals[i].textarea.style.opacity =
                info["goals"][i]["checked"] ? 0.5 : 1; 
            card.goals[i].updateTextboxHeight();
        ""}
    });

    socket.on("personality2", ()=>{
        html.remove();
        personality2(parent, socket, {name: card.name.innerText});
    });

    return html;
}