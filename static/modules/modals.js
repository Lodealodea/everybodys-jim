import { Padder, StyleBtn, StyleBtn2, StyleBtn3 } from "./addons.js";
import { elem, style } from "./core.js";

export function Modal(parent, title, closeable, killOnClose = true) {
    let html = elem(parent);
    style(html, `
        text-align: left;
        position: fixed;
        z-index: 100;
        padding-top: 100px;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(0, 0, 0, 0.4);
        overflow: auto;
    `);

    let content = elem(html);
    style(content, `
        border-radius: 10px;
        position: relative;
        background-color: #fefefe;
        margin: auto;
        width: 80%;
        text-align: center;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
        max-width: 400px;
    `);

    if (closeable) {
        let closeBtn = elem(content, "span");
        style(closeBtn, `
            position: absolute;
            top 0px;
            right: 8px;

            cursor: pointer;
            font-size: 28px;
            font-weight: bold;
            text-decoration: none;

        `);
        closeBtn.innerHTML = `&times`;

        let closeFunc = killOnClose ? 
            ()=>{html.remove();} : ()=>{html.style.display = "none"};

        closeBtn.onclick = ()=>{
            closeFunc();
        };

        window.onclick = (event)=>{
            if (event.target == html) {
                closeFunc();
            };
        };
    }

    let header = elem(content);
    style(header, `
        border-radius: 10px 10px 0px 0px;
        text-align: left;
        font-size: 28px;
        padding: 8px 16px;
        background-color: #14ffff;
    `);
    header.innerText = title;

    let body = elem(content);
        style(body, `
            border-radius: 0px 0px 10px 10px;
            // padding: 2px 16px 10px 10px;
            background-color: #e6ffff;
        `);

    Padder(html, 200);

    return {
        html,
        content,
        body,
        getTitle: ()=>{return header.innerText;},
        setTitle: (title)=>{header.innerText = title;},
        remove: ()=>{html.remove();},
        setVisibility: (val)=>{
            html.style.display = val ? "block" : "none";
        }
    }
}








export function RequestModal(parent, pName, 
    points, goal) {

    let title = pName != "" ?
        `Add points to ${pName}` :
        "Request points";
    
    let modal = Modal(parent, title, true);
    style(modal.body, `
        padding: 8px 8px;// 10px 7px;
    `);
    
    let request = elem(modal.body);
    style(request, `
        text-align = left;
        padding: 5px 0px 10px 0px;
    `);
    request.style.textAlign = "left";
    request.innerText = `+${points} points - ${goal}`;

    

    let textarea = elem(modal.body, "textarea");
    style(textarea, `
        min-width: calc(100% - 10px);
        line-height: 31px;
        font-family: rubik;
        font-weight: bold;
        font-size: 18px;

        border-width: 2px;
        border-radius: 3px;

        resize: none;
        overflow: hidden;
    `);
    textarea.rows = 5;
    textarea.placeholder = pName != "" ? 
        `How did ${pName} achieve this goal? (optional)` :
        "Describe how you achieved this goal"
    
    let sendBtn = new StyleBtn(modal.body, "Send");
    sendBtn.html.disabled = pName == "";
    sendBtn.test.style.paddingTop = "5px";

    textarea.oninput = ()=> {
        textarea.value = textarea.value.replaceAll("\n", "");
        sendBtn.html.disabled =
            pName == "" && textarea.value == "";
    };

    return {
        sendBtn,
        textarea,
        remove: ()=>{modal.remove();}
    };
}









function Msg(parent, name, points, goal, reason, address, socket, history, addscore) {
    let html = elem(parent);
    style(html, `
        // min-height: 100px;
        padding: 10px;
        margin: 0px 0px 10px 0px;
        background-color: #14e1ff;
        border-radius: 5px;
    `);

    let mainDiv = elem(html);
    let subDiv = elem(html);
    subDiv.style.display = "none";

    let txtDiv = elem(mainDiv);
    style(txtDiv, `
        display: table-cell;
        width: 100%;
    `);
    let nameDiv = elem(txtDiv);
    nameDiv.innerText = name;
    style(nameDiv, `
        text-align: left;
        padding-left: 15px;
        font-size: 24px;
    `);
    let reasonDiv = elem(txtDiv);
    reasonDiv.innerText = `${points} points - ${goal} - ${reason}`;
    reasonDiv.style.textAlign = "left";

    let btnDiv = elem(mainDiv);
    style(btnDiv, `
        display: table-cell;
    `);
    let acceptBtn = new StyleBtn3(btnDiv, "Accept", "#00e673", "#00cc66");
    acceptBtn.btn.onclick = ()=> {
        addscore(points);
        history.addAccount(points, goal, reason);
        socket.emit("score accepted", points, goal, reason, address);
        html.remove();
    };
    let denyBtn = new StyleBtn3(btnDiv, "Deny", "#ff0000", "#cc0000");
    denyBtn.btn.onclick = ()=> {subDiv.style.display = "block";};

    let textarea = elem(subDiv, "textarea");
    textarea.rows = 3;
    textarea.placeholder = "Reason for denial (optional)";
    style(textarea, `
        min-width: calc(100% - 10px);
        line-height: 31px;
        font-family: rubik;
        font-weight: bold;
        font-size: 18px;

        margin: 10px 0px 0px 0px;

        border-width: 2px;
        border-radius: 3px;

        resize: none;
        overflow: hidden;
    `);
    let subBtn = new StyleBtn3(subDiv, "Send denial", "#ff0000", "#cc0000");
    style(subBtn.btn, `
        width: 100px;
    `);
    subBtn.btn.onclick = ()=> {
        history.addAccount(points, goal, reason, textarea.value);
        socket.emit("score denied", points, goal, reason, textarea.value, address);
        html.remove();
    };
    
}

export function MsgsModal(parent, socket) {
    let modal = Modal(parent, "Messages", true, false);
    style(modal.body, `
        padding: 10px 10px 0px 10px;
        // margin: 0px 0px 10px 0px;
    `);
    modal.setVisibility(false);
    // let msg = Msg(modal.body, "Davis", 5,
    //     "Sleeping in the wild", "I slept under a tree", address, socket);

    new Padder(modal.content, 1);

    return {
        html: modal.html,
        setVisibility: modal.setVisibility,
        addMsg: (name, score, goal, reason, address, historyy, addscore)=>{
            Msg(modal.body, name, score, goal, reason, address, socket, historyy, addscore);
        }
    };
}





function Account(parent, score, goal, reason, denial) {
    let div = elem(parent);
    style(div, `
        background-color: ${denial == null ? "#14e1ff" : "red"};
        border-radius: 5px;
        padding: 10px;
        margin: 10px 10px 0px 10px;
    `);
    
    if(denial != null) {
        div.innerText = `${score} points - ${goal} - ${reason}`;
        if (denial != "") {
            let d = elem(div);
            style(d, `
                background-color: #ff6666;
                border-radius: 5px;
                padding: 3px;
                margin: 3px;
            `);
            d.innerText = denial;
        }
    }
    else {
        div.innerText = `${score} points - ${goal}`;
            let d = elem(div);
            style(d, `
                background-color: #66ebff;
                border-radius: 5px;
                padding: 3px;
                margin: 3px;
            `);
            if (reason != "")
                d.innerText = reason;
            else
                d.style.display = "none";
    }

}

export function HistoryModal(parent) {
    let modal = Modal(parent, "Goals achieved", true, false);
    modal.setVisibility(false);

    Padder(modal.content, 10);

    let accountsInfo = [];

    return {
        html: modal.html,
        addAccount: (score, goal, reason, denial = null)=>{
            Account(modal.body, score, goal, reason, denial);
            accountsInfo.push({score, goal, reason, denial});
        },
        setVisibility: (val)=>{
            modal.setVisibility(val);
        },
        accountsInfo,
        update: (infos)=>{
            for(let info of infos) {
                Account(modal.body, info.score, info.goal, info.reason, info.denial);
            }
        }
    }
}