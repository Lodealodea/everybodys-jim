import {Bang, Floater, Padder} from "./modules/addons.js";
import { Card } from "./modules/card.js";
import {elem, style} from "./modules/core.js";
import { DiceModal, RollDiceModal, SetDiceModal, VoteDiceModal } from "./modules/diceModals.js";
import { Modal, MsgsModal, RequestModal } from "./modules/modals.js";
import { personality } from "./modules/personality.js";
import {storyteller} from "./modules/storyteller.js";
import { summary } from "./modules/summary.js";

export function page(parent, socket)
{   
    let code = window.location.href.split('/')[3];

    document.body.style.userSelect = "none";

    let html = elem(parent);
    console.log(html);

    // let bla = new RollDiceModal(html, 15, 5, true);
    // bla.onRollBtnClick = ()=>{
    //     socket.emit("roll button clicked");
    // }
    // socket.on("roll button clicked", (d20arr, d10arr)=>{
    //     console.log("kkkk")
    //     bla.rollDice(d20arr, d10arr);
    // });

    //RETURN EVERYTHING AFTER THAT
    style(html, `
    font-family: Rubik;
    font-weight: Bold;
    text-align: center;
    `);
    let title = elem(html);
    style(title, `
    font-family: Secular One;
    font-weight: Bold;
    `);

    let t0 = elem(title);
    t0.innerText = "EVERYBODY'S";
    style(t0, `font-size: 44px;`);
    let t1 = elem(title);
    t1.innerText = "JIM";
    style(t1, `
        font-size: 180px;
        line-height: 70%;
        position: relative;
        z-index: -1;
    `);
    let p = Padder(html, 40);

    if (code == "") {
        socket.on("created room", (code) => {
            storyteller(html, code, socket);
        });

        socket.emit("create room");
    }
    else {
        socket.on("joined room", () => {
            personality(html, code, socket);
        });
        socket.on("failed to join room", () => {
            let err = elem(html);
            err.innerText = "Sorry, but this room does not exist :/";
            style(err, `font-size: 24px`);
        });

        socket.emit("join room", code);
    }
    // summary(html);
}