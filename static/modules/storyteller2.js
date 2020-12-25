import { Container, Floater, Padder, StyleBtn } from "./addons.js";
import { Card } from "./card.js";
import {elem, style} from "./core.js";
import { RollDiceModal, SetDiceModal, VoteDiceModal } from "./diceModals.js";
import { HistoryModal, MsgsModal, RequestModal } from "./modals.js";
import { summary } from "./summary.js";

export function storyteller2(parent, socket, infos, code) {
    document.body.scrollTop = 0;

    let html = elem(parent);

    let domiBox = Container(html, "Dominent Personality");
    Padder(html, 20);
    let diceBtn = new StyleBtn(html, "Set dice");
    Padder(html, 20);
    let restBox = Container(html, "Personalities");
    Padder(html, 20);
    let endBtn = new StyleBtn(html, "End game");
    let msgBox = Floater(html);

    let cardsIndex = [];
    let cards = {};
    let histories = {};
    for (let info of infos) {
        let card = new Card(restBox, true, 1);
        let history = HistoryModal(html);
        card.onScoreLabelClick = ()=>{
            history.setVisibility(true);
        };
        card.update(info.inner);
        card.onAnySbtnClick = (score, goal)=>{
            let modal = RequestModal(html, info.inner.name, score, goal);
            modal.sendBtn.html.onclick = ()=>{;
                card.addScore(score);
                history.addAccount(score, goal, modal.textarea.value);
                socket.emit("score accepted", score, goal, modal.textarea.value, info.key); 
                modal.remove();
            };
            //emit("scored", score, reason, info.key);
        };
        cards[info.key] = card;
        cardsIndex.push(info.key);
        histories[info.key] = history;

    }
    // let bla = elem(restBox);
    domiBox.appendChild(cards[cardsIndex[0]].wrapper);

    let requests = [];
    let msgsModal = MsgsModal(html, socket);

    socket.on("score request", (name, score, goal, reason, sender)=>{
        msgsModal.addMsg(name, score, goal, reason, sender, histories[sender], (val)=>{cards[cardsIndex].addScore(val);});
        if(msgsModal.html.style.display == "none")
            msgBox.setBang(true);
    });

    msgBox.html.onclick = ()=>{
        msgBox.setBang(false);
        msgsModal.setVisibility(true);
    };


    let domi = 0;
    let updateDomi = ()=>{
        domi = domi + 1 < cardsIndex.length ?
            domi + 1 : 0;
        domiBox.appendChild(restBox.children[1]);
        restBox.appendChild(domiBox.children[1]);
    };

    let setDiceModal = new SetDiceModal(html, Math.round(20/cardsIndex.length));
    let voteDiceModal = new VoteDiceModal(html);
    let that = {onFinished: null};
    let rollDiceModal = new RollDiceModal(html, that);

    let D20 = 0;
    let D10 = 0;

    diceBtn.html.onclick = ()=>{
        console.log("diceBtn clicked");
        //let setDiceModal = new SetDiceModal(html);
        setDiceModal.run();

        setDiceModal.onHandDice = (d20, d10)=>{
            D20 = d20;
            D10 = d10;
            console.log(`domi: ${domi}`);
            socket.emit("vote modal", d20, d10, cardsIndex[domi], cardsIndex.length);

            //let voteDiceModal = new VoteDiceModal(html, d20, d10, true);
            voteDiceModal.run(d20, d10, true);
            voteDiceModal.timeOver = ()=>{
                socket.emit("time over");
            }
        };
    };

    socket.on("vote updated", (votes)=>{
        voteDiceModal.updateVotes(votes);
    });

    let turnNum = 0;
    socket.on("vote over", (votes)=>{
        console.log("remove vote modal");
        voteDiceModal.remove();
        console.log(`IMPORTANT votes: ${votes}`);
        socket.emit("dice roll", D20*votes, D10, cardsIndex[domi]);

        rollDiceModal.run(D20*votes, D10, false);
        that.onFinished = (isSuccess)=>{
            console.log("on finished");
            rollDiceModal.rollBtnHtml.innerText = "Continue";
            rollDiceModal.rollBtnHtml.disabled = false;
            rollDiceModal.rollBtnHtml.onclick = () => {
                socket.emit("continue button clicked");
                turnNum += 1;
                if (turnNum >= 3 || !isSuccess) {
                    updateDomi();
                    turnNum = 0;
                }
                rollDiceModal.remove();
            }
        };

        // socket.on("roll button clicked", (d20arr, d10arr)=>{
        //     rollDiceModal.rollDice(d20arr, d10arr);
        // });
    });

    socket.on("roll button clicked", (d20arr, d10arr)=>{
        rollDiceModal.rollDice(d20arr, d10arr);
    });


    endBtn.html.onclick = ()=>{
        let winnerKeys = [];
        let winnerScore = 0;
        for(let i = 0; i < cardsIndex.length; i++) {
            let newScore = cards[cardsIndex[i]].getScore();
            if(newScore > winnerScore)
            {
                winnerScore = newScore;
                winnerKeys = [];
                winnerKeys.push(cardsIndex[i]);
            }
            else if (newScore === winnerScore) {
                winnerKeys.push(cardsIndex[i]);
            }
        }

        let cardsInfo = [];

        for(let [key, card] of Object.entries(cards))
            cardsInfo.push({
                key,
                inner: card.getInfo(),
                history: histories[key].accountsInfo
            });
        
        html.remove();
        summary(parent, cardsInfo, winnerKeys, true, code);
        socket.emit("summary", cardsInfo, winnerKeys);
    };
}