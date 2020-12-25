import { Container, Padder, StyleBtn } from "./addons.js";
import { Card } from "./card.js";
import { elem } from "./core.js";
import { HistoryModal } from "./modals.js";
import { storyteller } from "./storyteller.js"; 

export function summary(parent, cardsInfo, winnerKeys, isSt = false, code = "") {
    document.body.scrollTop = 0;

    let html = elem(parent);
    let winBox = new Container(html, "Winner");
    Padder(html, 20);
    let restBox = new Container(html, "presonalities");
    Padder(html, 20);

    let cards = {}
    for (let i = 0; i < cardsInfo.length; i++) {
        let card = new Card(restBox, true, 2);
        let history = HistoryModal(html);
        card.update(cardsInfo[i].inner);
        history.update(cardsInfo[i].history);
        card.onScoreLabelClick = ()=>{
            history.setVisibility(true);
        };

        cards[cardsInfo[i].key] = card;
    }

    for (let i = 0; i < cardsInfo.length; i++) {
        console.log(cardsInfo[i].key);
        if(winnerKeys.includes(cardsInfo[i].key))
            winBox.appendChild(cards[cardsInfo[i].key].wrapper);
    }

    if(isSt) {
        let newGameBtn = new StyleBtn(html, "New game");

        newGameBtn.html.onclick = ()=>{
            html.remove();
            storyteller(parent, code, socket);
        };
    }
}