import { Bang, Container, Padder, StyleBtn2 } from "./addons.js";
import { elem, style } from "./core.js";

function Attribute(parent,
    ability, state, storyteller) {
    this.onUpdated = null;

    let html = elem(parent);
    style(html, `position: relative;`);


    // checkbox / marker
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

    //score textarea
    if (!ability && state === 0) {
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
        score.innerText = "1";
        score.disabled = !storyteller;

        score.onkeypress = (e)=>{
            var k = e.key;
            if (!(k >= 0 && k <= 9))
                e.preventDefault();
        };
        score.onfocus = () => {score.value = "";};
        score.addEventListener("focusout", () => {
            if(!Number.isInteger(parseFloat(score.value)))
                score.value = "1";
            else if (parseInt(score.value) < 1)
                score.value = "1";
            else if (parseInt(score.value) > 10)
                score.value = "10";

            this.onUpdated();
        });
        this.score = score;
    }

    //Textarea
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

        // background: blue;
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
        
        textarea.oninput = ()=>
        {
            textarea.value = textarea.value.replaceAll("\n", "");
            this.onUpdated();
            this.updateTextboxHeight(); 
        };
    }
    else if (state == 1) {
        textarea.disabled = true;
        textarea.style.color = "black";
    }

    this.updateTextboxHeight = ()=>{
        if (textarea.scrollHeight > 80) {
            textarea.style.height = "0px";
            textarea.style.height = (textarea.scrollHeight - 20)+"px";
        }
    };

    this.textarea = textarea;

    //Score Button
    if (!ability && state === 1)
    {
        let scoreVal = 0;
        let scoreBtn = new StyleBtn2(html, `+${scoreVal}`, `pts`);
        style(scoreBtn.html, `
            position: absolute;
            top: 40px;
            left: -0px;
        `);
        style(scoreBtn.btn, `
            max-width: 36px;
            min-width: 36px;
        `);
        // transform: translate(0px, 1px);

        this.getScoreVal = ()=>{return scoreVal;};
        this.setScoreVal = (val)=>{
            scoreVal = val;
            scoreBtn.setText(`+${scoreVal}`, `pts`);
            // if (val > 10) {
            //     style(scoreBtn.)
            // }
        };

        this.onScoreBtnClick = null;

        scoreBtn.btn.onclick = ()=>{
            this.onScoreBtnClick(scoreVal, textarea.value);
        }

        this.score = scoreBtn
    }

    if (!ability && state === 2)
    {
        let scoreVal = 0;
        let scoreLabel = elem(html);
        let d1 = elem(scoreLabel);
        d1.innerText = scoreVal;
        let d2 = elem(scoreLabel);
        d2.innerText = "pts";
        style(scoreLabel, `
            position: absolute;
            top: 40px;
            left: -0px;
            max-width: 36px;
            min-width: 36px;
        `);
        this.setScoreVal = (val)=>{
            scoreVal = val;
            d1.innerText = val;
        };
    }
}






//------------------CARD-------------------


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

    let scoreVal = 0;
    let scoreLabel = elem(html);
    if(state === 1 || state === 2) {
        style(scoreLabel, `
            display: table-cell;
            position: relative;
            z-index: 0;
            width: 90px;
            min-width: 90px;
            padding: 0px 0px 0px 0px;

            font-size: 18px;

            border-radius: 5px 10px 0px 0px;

            background-color: #00ff80;
            vertical-align: text-top;
            // box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.19);
            box-shadow: -5px -6px 12px -6px rgba(1, 0, 0, 0.19);

            cursor: pointer;
        `);
        style(scoreLabel, `
            // box-shadow: -0px 7px 9px -2px rgba(1, 0, 0, 0.19);
            box-shadow: -0px 0px 0px -0px rgba(1, 0, 0, 0.19);
            transform: translate(0px, 1px);
        `, "active");
        scoreLabel.innerText = "Score: 0";

        this.bang = Bang(scoreLabel, "-7", "-7");
        // bang.setVisibility(true);

        this.getScore = ()=> {return scoreVal};
        this.addScore = (val)=> {
            scoreVal += parseInt(val);
            scoreLabel.innerHTML = `Score: ${scoreVal}`;
        }
        this.showBang = ()=> {
            scoreLabel.appendChild(this.bang.html);
            this.bang.setVisibility(true);
        }
        
        this.onScoreLabelClick = null;
        scoreLabel.onclick = ()=>{
            this.bang.setVisibility(false);
            this.onScoreLabelClick();
        }
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
    let abilities = [];
    for (let i = 0; i < 2; i++) {
        abilities.push(new Attribute(
            abilitiesCont,
            true, state, storyteller));
        let bla = new Attribute();
        abilities[i].onUpdated = () => {this.onUpdated();};
    }
    this.abilities = abilities;

    let goalsCont = elem(atts);
    style(goalsCont, `
        display: table-cell;`);
    let gTitle = elem(goalsCont);
    gTitle.innerText = "Goals";
    let goals = [];
    for (let i = 0; i < 2; i++) {
        goals.push(new Attribute(
            goalsCont,
            false, state, storyteller));
        goals[i].onUpdated = () => {this.onUpdated();};
    }
    this.goals = goals;

    if(state === 1) {
        abilitiesCont.style.width = "50%";
        goalsCont.style.width = "50%";

        this.onAnySbtnClick = null;

        for(let goal of goals) {
            goal.onScoreBtnClick = (score, reason)=>{
                this.onAnySbtnClick(score, reason);
            }
        }
    }

    this.update = (info)=>{
        name.innerText = info["name"];
        if(state === 2) {
            scoreLabel.innerHTML = `Score: ${info['allscore']}`;
        }
        for (let i = 0; i < 2; i++) {
            if (state === 0)
            {
                abilities[i].checkbox.checked =
                    info["abilities"][i]["checked"];
                abilities[i].textarea.readOnly = 
                    info["abilities"][i]["checked"];
                abilities[i].textarea.style.opacity =
                    info["abilities"][i]["checked"] ? 0.5 : 1; 
            }
            
            abilities[i].textarea.value =
                info["abilities"][i]["text"];
            abilities[i].updateTextboxHeight();
        }
        for (let i = 0; i < 2; i++) {
            if (state === 0)
            {
                goals[i].checkbox.checked =
                    info["goals"][i]["checked"];
                goals[i].textarea.readOnly = 
                    info["goals"][i]["checked"];
                goals[i].textarea.style.opacity =
                    info["goals"][i]["checked"] ? 0.5 : 1; 
                goals[i].score.value =
                    info["goals"][i]["score"];
            }
            else if (state === 1 || state === 2) {
                goals[i].setScoreVal(info["goals"][i]["score"]);
            }

            goals[0].textarea.style.opacity = 1;

            goals[i].textarea.value =
                info["goals"][i]["text"];
            goals[i].updateTextboxHeight();
        }
    }

    this.getInfo = ()=>{
        let info = {};
        info["name"] = name.innerText;
        if(state === 1)
            info["allscore"] = scoreVal;
        info["abilities"] = [];
        for (let i = 0; i < 2; i++) {
            info["abilities"].push({});
                if(state === 0)
                    info["abilities"][i]["checked"] =
                        abilities[i].checkbox.checked;
                info["abilities"][i]["text"] =
                    abilities[i].textarea.value;
        }
        info["goals"] = [];
        for (let i = 0; i < 2; i++) {
            info["goals"].push({});
                if(state === 0) {
                    info["goals"][i]["checked"] =
                        goals[i].checkbox.checked;
                    info["goals"][i]["score"] =
                        goals[i].score.value;
                }
                else if (state === 1) {
                    info["goals"][i]["score"] =
                        goals[i].getScoreVal();
                }
                info["goals"][i]["text"] =
                    goals[i].textarea.value;
        }
        
        return info;
    }

    Padder(this.wrapper, 5);
}