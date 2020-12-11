import { container, padder } from "./addons.js";
import { elem, style } from "./core.js";

function Attribute(parent,
    ability, state, storyteller) {
    this.onUpdated = null;

    let html = elem(parent);
    style(html, `position: relative`);

    if (state == 0) {
        let checkbox = elem(html, "input");
        checkbox.type = "checkbox";
        style(checkbox, `
            position: absolute;
            top: 14px;
            left: 8px;
            transform: scale(2);
        `);

        checkbox.oninput = ()=>this.onUpdated();

        checkbox.disabled = !storyteller;

        this.checkbox = checkbox;
    }
    else {
        let marker = elem(html);
        style(marker, `
            position: absolute;
            top: 8px;
            left: 14px;

            font-size: 24px;
        `);

        marker.innerText = "•";
    }

    if (!ability) {
        let score = elem(html, "textarea");
        style(score, `
            position: absolute;
            top: 46px;
            left: 2.75px;

            width: 23px;
            height: 24px;
            font-family: rubik;
            font-weight: bold;
            font-size: 20px;

            border-radius: 3px;
            border-width: 2px;

            background-color:  #80ffbf;

            text-align: center;

            resize: none;
            overflow: hidden;
        `);
        score.maxLength = 2;
        score.innerText = "0";
        score.disabled = !storyteller;

        // score.oninput = ()=>this.onUpdated();
        score.onfocus = () => {score.value = "";};
        score.addEventListener("focusout", () => {
            if(!Number.isInteger(parseFloat(score.value)))
                score.value = "0";
            else if (parseInt(score.value) > 10)
                score.value = "10";

            this.onUpdated();
        });

        this.score = score;
    }

    let textarea = elem(html, "textarea");
    style(textarea, `
        width: calc(100% - 60px);
        background-size: 100% 100%, 100% 100%, 100% 31px;
        background-color: transparent;
        border-width: 0px;
        
        line-height: 31px;
        font-family: rubik;
        font-weight: bold;
        min-height: 70px;
        height: 70;
        font-size: 18px;
        margin-left: 28px;
        padding: 8px;

        resize: none;
        overflow: hidden;
    `);
    
    if (state == 0) {
        style(textarea, `
            border-width: 0px 0px 3px 0px;
            border-color: #00e673;
        `);
        style(textarea, `
            outline: none;
            border-color: mediumblue;
            box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.19);
        `, "focus");
        
        this.updateTextboxHeight = ()=>{
            if (textarea.scrollHeight > 80) {
                textarea.style.height = "0px";
                textarea.style.height = (textarea.scrollHeight - 20)+"px";
            }
        };

        textarea.oninput = ()=>
        {
            this.onUpdated();
            this.updateTextboxHeight(); 
        };
    }
    else if (state == 1) {
        textarea.disabled = true;
    }

    this.textarea = textarea;
}

export function Card(parent, storyteller, state) {
    this.onUpdated = null;
    this.wrapper = elem(parent);

    let html = elem(this.wrapper);
    style(html, `
        background-color: #4dffa6;
        border-radius: 10px;`);

    let name = elem(html);
    name.oninput = ()=>this.onUpdated();
    if (storyteller || state == 1) {
        style(name, `
            text-align: left;
            font-size: 20px;
            padding: 5px 10px 5px 5px;

            display: table-cell;
            width: 80%;
            `);
    }
    else {
        name.contentEditable = true;
        name.dataset.text = "Enter your name";
        style(name, `
            text-align: left;
            font-size: 20px;
            // margin: 5px 100px 5px 5px;
            padding: 5px 10px 5px 5px;

            cursor: text;
        `);
        style(name, `
            outline: none;
            // border-color: mediumblue;
            box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.19);
        `, "focus");
        style(name, `
        color:  #00cc66;
            content:attr(data-text);`
        , "empty:before");
    }
    this.name = name;

    if(state == 1) {
        let scoreLabel = elem(html);
        style(scoreLabel, `
            display: table-cell;
            width: 90px;
            min-width: 90px;
            padding: 0px 0px 0px 0px;

            font-size: 18px;

            border-radius: 5px 10px 0px 0px;

            background-color: #00ff80;
            vertical-align: text-top;
            // box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.19);
            box-shadow: -3px 2px 12px -2px rgba(1, 0, 0, 0.19);
        `);
        style(scoreLabel, `
            // box-shadow: -0px 7px 9px -2px rgba(1, 0, 0, 0.19);
            box-shadow: -0px 0px 0px -0px rgba(1, 0, 0, 0.19);
            transform: translate(0px, 1px)
        `, "active");
        scoreLabel.innerText = "Score: 10";
    }

    let atts = elem(html);
    style(atts, `
        padding: 5px 0px 5px 0px;
        background-color: #00ff80;
        border-radius: 0px 0px 10px 10px;`);
    let abilitiesCont = elem(atts);
    style(abilitiesCont, `
        display: table-cell;`);
    let aTitle = elem(abilitiesCont);
    aTitle.innerText = "Abilities";
    this.abilities = [];
    for (let i = 0; i < 2; i++) {
        this.abilities.push(new Attribute(
            abilitiesCont,
            true, 0, storyteller));
        let bla = new Attribute();
        this.abilities[i].onUpdated = () => {this.onUpdated();};
    }

    let goalsCont = elem(atts);
    style(goalsCont, `
        display: table-cell;`);
    let gTitle = elem(goalsCont);
    gTitle.innerText = "Goals";
    this.goals = [];
    for (let i = 0; i < 2; i++) {
        this.goals.push(new Attribute(
            goalsCont,
            false, 0, storyteller));
        this.goals[i].onUpdated = () => {this.onUpdated();};
    }

    padder(this.wrapper, 5);
}