import { Container } from "./addons.js";
import { Card } from "./card.js";
import { elem } from "./core.js";
import { RollDiceModal, VoteDiceModal } from "./diceModals.js";
import { HistoryModal, RequestModal } from "./modals.js";
import { summary } from "./summary.js";

export function personality2(parent, socket, info) {
    document.body.scrollTop = 0;

    let html = elem(parent);

    let box = Container(html);

    let card = new Card(box, false, 1);
    card.update(info);
    card.onAnySbtnClick = (score, goal)=> {
        let modal = RequestModal(html, "", score, goal);
        modal.sendBtn.html.onclick = ()=>{
            socket.emit("score request", card.name.innerText, score, goal, modal.textarea.value); 
            modal.remove();
        };
    };

    let history = HistoryModal(html);

    socket.on("score accepted", (points, goal, reason)=>{
        card.addScore(points);
        if(history.html.style.display == "none")
            card.showBang();
        history.addAccount(points, goal, reason);
    });

    socket.on("score denied", (points, goal, reason, denial)=>{
        if(history.html.style.display == "none")
            card.showBang();
        history.addAccount(points, goal, reason, denial);
    });

    socket.on("scored", (score, goal, reason)=>{
        if(history.html.style.display == "none")
            card.showBang();
        history.addAccount(points, goal, reason);
    });

    card.onScoreLabelClick = ()=>{
        history.setVisibility(true);
    };

    let voteDiceModal = new VoteDiceModal(html);
    let rollDiceModal = new RollDiceModal(html);

    socket.on("vote modal", (d10, d20, isDomi)=>{
        //let voteDiceModal = new VoteDiceModal(html, d20, d10, isDomi);
        voteDiceModal.run(d20, d10, isDomi);
        voteDiceModal.onBooClick = ()=>{
            socket.emit("voted", false);
            
        };
        voteDiceModal.onYeeClick = ()=>{
            socket.emit("voted", true);
        };

        // socket.on("vote updated", (votes)=>{
        //     console.log("vote updated");
        //     voteDiceModal.updateVotes(votes);
        // });


        // socket.on("dice roll", (d20, d10, isDomi)=>{
        //     console.log("remove vote modal");
        //     voteDiceModal.remove();
    
        //     // let rollDiceModal = new RollDiceModal(html, d20, d10, isDomi);
        //     rollDiceModal.run(d20, d10);
        //     rollDiceModal.onRollBtnClick = ()=>{
        //         socket.emit("roll button clicked");
        //     };
    
        //     socket.on("roll button clicked", (d20arr, d10arr)=>{
        //         console.log("this is not called twice, right?");
        //         rollDiceModal.rollDice(d20arr, d10arr);
        //     });

        //     socket.on("continue button clicked", ()=>{
        //         rollDiceModal.remove();
        //     });
        // });
    });

    socket.on("vote updated", (votes)=>{
        console.log("vote updated");
        voteDiceModal.updateVotes(votes);
    });

    socket.on("dice roll", (d20, d10, isDomi)=>{
        console.log("remove vote modal");
        voteDiceModal.remove();

        // let rollDiceModal = new RollDiceModal(html, d20, d10, isDomi);
        rollDiceModal.run(d20, d10, isDomi);
        rollDiceModal.onRollBtnClick = ()=>{
            socket.emit("roll button clicked");
        };
    });

    socket.on("roll button clicked", (d20arr, d10arr)=>{
        console.log("this is not called twice, right?");
        rollDiceModal.rollDice(d20arr, d10arr);
    });

    socket.on("continue button clicked", ()=>{
        rollDiceModal.remove();
    });

    socket.on("summary", (cardsInfo, winnerKeys)=>{
        html.remove();
        summary(parent, cardsInfo, winnerKeys);
    });
}