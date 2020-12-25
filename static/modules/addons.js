import {elem, style} from "./core.js";

let fa = elem(document.body, "link");
    fa.rel = "stylesheet";
    fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css";

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
        -webkit-tap-highlight-color: transparent;
        `, "active");

    this.html = btn;

    this.test = html;
}

export function StyleBtn2(parent, text = "", text2 = "") {
    let html = elem(parent);
    let btn = elem(html, "button");
    style(btn, `
        font-family: Rubik;
        font-weight: bold;
        background-color: #00e673;
        box-shadow: 0 5px #00cc66;
        font-size: 16px;
        outline: none;
        cursor: pointer;
    
        border-radius: 5px;
        border-width: 0px;
        margin: 0px 0px 5px 0px;
        padding: 2px 0px;
    
        position: relative;
        -webkit-tap-highlight-color: transparent;`);
    style(btn, `
        box-shadow: 0 0px;
        transform: translate(0, 5px);
        -webkit-tap-highlight-color: transparent;
        `, "active");

    let d0 = elem(btn);
    let d1 = elem(btn);
    d0.innerText = text;
    d1.innerText = text2;
    style(d1, `
        font-size: 14px;
    `);

    this.setText = (t0, t1)=>{
        d0.innerText = t0;
        d1.innerText = t1;
    };

    this.html = html;
    this.btn = btn;
}

export function StyleBtn3(parent, text = "", color, shadowColor) {
    let html = elem(parent);
    let btn = elem(html, "button");
    style(btn, `
        font-family: Rubik;
        font-weight: bold;
        background-color: ${color};
        box-shadow: 0 5px ${shadowColor};
        font-size: 16px;
        outline: none;
        cursor: pointer;
    
        border-radius: 5px;
        border-width: 0px;
        margin: 5px;
        padding: 2px 5px;
    
        width: 70px;

        position: relative;
        -webkit-tap-highlight-color: transparent;`);
    style(btn, `
        box-shadow: 0 0px;
        transform: translate(0, 5px);
        -webkit-tap-highlight-color: transparent;
        `, "active");

    btn.innerText = text;

    this.setText = (t0)=>{
        btn.innerText = t0;
    };

    this.html = html;
    this.btn = btn;
}

export function Padder(parent, px) {
    let html = elem(parent);
    html.style.paddingTop = px + "px";

    return {
        padding: (px = null) => {
            if(px != null) html.style.paddingTop = px + "px";
            else return html.style.paddingTop;
        }
    };
}

export function Container(parent, titleText = null) {
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

export function Bang(parent, x = "-4", y = "-2") {
    let html = elem(parent);
    style(html, `
        display: none;
        position: absolute;
        top: ${y}px;
        right: ${x}px;
        z-index: 3;
        font-size: 18px;
        border: none;
        outline: none;
        background-color: #ff4d4d;
        color: white;
        padding: 0px;
        width: 20px;
        height: 20px;
        border-radius: 100px;
    `);

    let icon = elem(html, "i");
    icon.className = "fas fa-exclamation";
    style(icon, `
        font-size: 14px;
        transform: translate(0px, -1.5px);
    `)
    
    return {
        html,
        setVisibility: (val)=>{
            if(val) {
                style(html, `display: block;`);
            }
            else {
                style(html, `display: none;`);
            }
        }
    };
}

export function Floater(parent) {
    let html = elem(parent);
    style(html, `
        position: fixed;
        bottom: 20px;
        right: 30px;
        z-index: 2;
        font-size: 18px;
        border: none;
        outline: none;
        background-color: #00e673;
        color: white;
        cursor: pointer;
        padding: 15px;
        border-radius: 100px;
        box-shadow: 3px 4px 5px rgba(0, 0, 0, 0.3);
    `);
    style(html, `
        background-color: #00cc66;
    `, "hover");

    let icon = elem(html, "i");
    icon.className = "fa fa-envelope";
    style(icon, `
        font-size: 24px;
        transform: translate(0px, 1.5px);
    `)

    let b = Bang(html);

    return {
        html,
        setBang: (val)=>{b.setVisibility(val);}
    }
}