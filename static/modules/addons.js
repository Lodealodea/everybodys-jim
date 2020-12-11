import {elem, style} from "./core.js";

export function StyleBtn(parent, text = "") {
    let html = elem(parent);
    let btn = elem(html, "button");
    btn.innerText = text;
    style(btn, `
        font-family: Rubik;
        font-weight: bold;
        background-color: #00ff80;
        box-shadow: 0 5px #00e673;
        font-size: 24px;
        outline: none;
        cursor: pointer;
    
        border-radius: 10px;
        border-width: 0px;
        margin: 0px 0px 5px 0px;
        padding: 15px 30px;
    
        position: relative;
        -webkit-tap-highlight-color: transparent;`);

    style(btn, `
        box-shadow: 0 0px;
        transform: translate(0, 5px);
        -webkit-tap-highlight-color: transparent;`, "active");

    this.html = btn;
}

export function padder(parent, px) {
    let html = elem(parent);
    html.style.paddingTop = px + "px";

    return {
        padding: (px = null) => {
            if(px != null) html.style.paddingTop = px + "px";
            else return html.style.paddingTop;
        }
    };
}

export function container(parent, titleText = null) {
    let html = elem(parent);
    style(html, `
        background-color: #14c4ff;
        
        padding: 5px 5px 0px 5px;
        margin: auto;
        
        max-width: 400px;
        border-radius: 15px;`);
    if (titleText != null) {
        style(html, `margin: auto;`);
        let title = elem(html);
        title.innerText = titleText;
        style(title, `
            font-size: 20px;
            margin: 0px 5px 5px 10px;
            text-align: left;`);
    }
    return html;
}
