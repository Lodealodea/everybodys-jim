import { Padder, StyleBtn, StyleBtn3 } from "./addons.js";
import { elem, style } from "./core.js";
import { Modal, MsgsModal } from "./modals.js";

export function DiceModal(parent, title) {
    let modal = Modal(parent, title, false, false);
    modal.setVisibility(false);

    // let topDiv = elem(modal.body);
    let d20Div = elem(modal.body);
    let d20Img = elem(d20Div, "img");
    let d10Div = elem(modal.body);
    let d10Img = elem(d10Div, "img");
    let btmDiv = elem(modal.body);

    // style(topDiv, `display: table-row;`);
    // style(btmDiv, `display: table-row;`);

    style(d20Div, `display: table-cell;`);
    style(d10Div, `display: table-cell;`);

    d20Img.src = "../images/d20.png";
    style(d20Img, `width: 100%;`);
    d10Img.src = "../images/d10.png";
    style(d10Img, ` width: 100%;`);

    Padder(modal.content, 10);

    this.d20Div = d20Div;
    this.d10Div = d10Div;
    this.btmDiv = btmDiv;
    this.remove = ()=>{modal.setVisibility(false)};
    this.setVisibility = (val)=> {modal.setVisibility(val);};
}



function NiceTbx(parent, placeholder, max) {
    this.onUpdated = null;
    
    let html = elem(parent, "textarea");

    style(html, `
        width: 70px;
        margin: 5px;
        padding: 5px;
        resize: none;
        font-family: Rubik;
        font-weight: Bold;
        font-size: 24px;
        border-radius: 5px;
        border-width: 2px;
        text-align: center;
    `);
    html.rows = 1;
    html.maxLength = max/10 + 1;
    html.placeholder = placeholder;
    html.onkeypress = (e)=>{
        var k = e.key;
        if (!(k >= 0 && k <= 9))
            e.preventDefault();
    };
    html.onchange = ()=>{if(html.value>max) html.value = max;};
    html.oninput = ()=>{this.onUpdated();};

    this.getValue = ()=>{return html.value;};
    this.setValue = (val)=>{html.value = val;}
}

export function SetDiceModal(parent, max) {
    this.onHandDice = null;

    let modal = new DiceModal(parent, "Set dice values");

    let d20Tbx = new NiceTbx(modal.d20Div, `0 ÷ ${max}`, max);
    let d10Tbx = new NiceTbx(modal.d10Div, "0 ÷ 10", 10);
    Padder(modal.btmDiv, 20);
    let handDiceBtn = new StyleBtn(modal.btmDiv, "Hand Dice");
    handDiceBtn.html.disabled = true;

    let activateBtn = ()=>{
        handDiceBtn.html.disabled =
            d20Tbx.getValue() == "" ||
            d10Tbx.getValue() == "";
    }
    d20Tbx.onUpdated = ()=>{activateBtn()};
    d10Tbx.onUpdated = ()=>{activateBtn()};

    handDiceBtn.html.onclick = ()=>{
        modal.remove();
        this.onHandDice(d20Tbx.getValue(), d10Tbx.getValue());
    };

    this.run = ()=> {
        d20Tbx.setValue("");
        d10Tbx.setValue("");
        modal.setVisibility(true);
    };
}

export function VoteDiceModal(parent) {
    let modal = new DiceModal(parent, "Vote for the action");

    let d20Spn = elem(modal.d20Div);
    let d20Spn0 = elem(d20Spn);
    let d20Spn1 = elem(d20Spn);
    let d20Spn2 = elem(d20Spn);
    let yeeBtn = new StyleBtn3(modal.d20Div, "place", "#00e673", "#00cc66");
    let d10Spn = elem(modal.d10Div);
    let booBtn = new StyleBtn3(modal.d20Div, "holder", "#ff0000", "#cc0000");
    let cntDwn = elem(modal.d10Div);

    style(modal.btmDiv, `background: magenta`);

    d20Spn2.innerText = ` <`;

    style(modal.d20Div, `
        text-align: center;
        horizontal-align: center;
    `);

    style(d20Spn, `
        font-size: 28px;
        height: 50px;
        vertical-align: middle;
        // background: magenta;
    `);
    style(d20Spn0, `
        display: inline;
    `);
    style(d20Spn1, `
    display: inline;
        border-style: solid;
        border-width: 0px 0px 3px 0px;
    `);
    style(d20Spn2, `
        display: inline;
    `);

    style(d10Spn, `
        font-size: 28px;
        height: 35px;
        vertical-align: middle;
        // background: cyan;
    `);

    
    booBtn.btn.innerHTML = `<i class="far fa-thumbs-down fa-3x like"></i>`;
    yeeBtn.btn.innerHTML = `<i class="far fa-thumbs-up fa-3x like"></i>`;
    
    booBtn.btn.style.padding = "5px 0px 3px 0px";
    yeeBtn.btn.style.padding = "5px 0px 3px 0px";
    booBtn.html.style.display = "inline-block";
    yeeBtn.html.style.display = "inline-block";

    this.onBooClick = null;
    booBtn.btn.onclick = ()=>{
        this.onBooClick();
        style(booBtn.btn, `
            box-shadow: 0 0px;
            transform: translate(0, 5px);
            -webkit-tap-highlight-color: transparent;
        `);
        booBtn.btn.disabled = true;
        yeeBtn.btn.disabled = true;
    };
    this.onYeeClick = null;
    yeeBtn.btn.onclick = ()=>{
        this.onYeeClick();
        style(yeeBtn.btn, `
            box-shadow: 0 0px;
            transform: translate(0, 5px);
            -webkit-tap-highlight-color: transparent;
        `);
        booBtn.btn.disabled = true;
        yeeBtn.btn.disabled = true;
    };
    this.updateVotes = (val)=>{
        d20Spn1.innerText = val;
    }

    cntDwn.innerText = "60s left to vote";
    style(cntDwn, `
        margin-top: 55px;
        margin-right: 10px;
        font-size: 22px;
        text-align: right;
    `);

    this.timeOver = ()=>{};
    let anotherFunc = (timeLeft)=>{

        cntDwn.innerText =
            `${timeLeft}s left to vote`;
        if (timeLeft > 0)
            setTimeout(()=>{this.countDown(timeLeft - 1)}, 1000);
        else
        {
            this.timeOver();
        }
    };
    this.countDown = anotherFunc();
    this.remove = ()=>{
        this.countDown = ()=>{};
        modal.remove();
    }

    this.run = (d20, d10, cantvote)=>{
        style(booBtn.btn, `
            box-shadow: 0 5px #cc0000;
            transform: translate(0, 0px);
            -webkit-tap-highlight-color: transparent;`
        );
        style(yeeBtn.btn, `
            box-shadow: 0 5px #00cc66;
            transform: translate(0, 0px);
            -webkit-tap-highlight-color: transparent;`
        );
        booBtn.btn.disabled = cantvote;
        yeeBtn.btn.disabled = cantvote;
        d20Spn0.innerText = `${d20} × `;
        d20Spn1.innerText = `0`;
        d10Spn.innerText = `${d10} <`;
        modal.setVisibility(true);
        this.countDown = anotherFunc;
        this.countDown(60);
    };
}

export function RollDiceModal(parent, st = null) {
    let modal = new DiceModal(parent, "Roll the dice");

    let d20Txt = elem(modal.d20Div);
    let d10Txt = elem(modal.d10Div);
    let d20Num = elem(modal.d20Div);
    let d10Num = elem(modal.d10Div);

    let outcome = elem(modal.btmDiv);

    Padder(modal.btmDiv, 10);
    let rollBtn = new StyleBtn(modal.btmDiv, "Roll dice");

    
    style(d20Txt, `
        font-size: 28px;
        height: 35px;
        vertical-align: middle;
    `);

    style(d10Txt, `
        font-size: 28px;
        height: 35px;
        vertical-align: middle;
    `);

    style(modal.d20Div, `
        position: relative;
    `);

    // d20Num.innerText = "";
    style(d20Num, `
        position: absolute;
        top: 53px;
        width: 100%;
        font-weight: 1200;
        text-align: center;
        -webkit-text-stroke: 0.00005px white; 
        font-size: 60px;
    `);
    // d10Num.innerText = "";
    style(d10Num, `
        position: absolute;
        top: 103px;
        width: 50%;
        font-weight: 1200;
        text-align: center;
        -webkit-text-stroke: 0.00005px white; 
        font-size: 60px;
    `);

    style(outcome, `
        font-size: 36px;
    `);

    this.onRollBtnClick = null;
    rollBtn.html.onclick = ()=>{
        this.onRollBtnClick();
    };

    let D20 = 0;
    let D10 = 0;
    this.rollDice = (d20arr, d10arr)=>{
        rollBtn.html.disabled = true;
        let roll = (val)=>{
            d20Num.innerText = d20arr[val];
            d10Num.innerText = d10arr[val];
            if(val > 0) setTimeout(
                ()=>{roll(val - 1)},
                    800/(val + 1));
            else
            {
                let blip = d20arr[0] > D20 && d10arr[0] > D10;
                outcome.innerText = blip ?
                    "Success!" : "Failure";
                outcome.style.color = blip ?
                    "lime" : "red";
                if(st != null)
                    st.onFinished(blip);
            }
        };
        this.rollBtnHtml = rollBtn.html;
        this.remove = ()=>{
            modal.remove();
        }

        roll(d20arr.length - 1);
    };

    this.run = (d20, d10, isDomi)=> {
        D20 = d20;
        D10 = d10;
        outcome.innerText = "";
        d20Num.innerText = "";
        d10Num.innerText = "";
        rollBtn.html.disabled = !isDomi;
        d20Txt.innerText = `${d20} <`;
        d10Txt.innerText = `${d10} <`;
        modal.setVisibility(true);
    };
}