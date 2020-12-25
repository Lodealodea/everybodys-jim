import {elem, style} from "./core.js";
import {Container, Padder, StyleBtn} from "./addons.js";
import { Card } from "./card.js";
import { copy } from "./general.js";
import { personality2 } from "./personality2.js";

export function personality(parent, code, socket) {
    let html = elem(parent);

    let box = Container(html, "Customize your personality");
    
    let card = new Card(box, false, 0);

    let timeoutFunc = null;
    card.onUpdated = ()=>{
        clearTimeout(timeoutFunc);
        timeoutFunc = setTimeout(() => {

            socket.emit("update card", card.getInfo());

        }, /*1000*/0);
    };

    socket.on("update card back", (info)=> {
        card.update(info);
    });

    socket.on("personality2", ()=>{
        html.remove();
        personality2(parent, socket, card.getInfo());
    });

    return html;
}