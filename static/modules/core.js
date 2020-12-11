let idCount = 0;
export function elem(parent = null, type = "div", index = null) {
    let html = document.createElement(type);
    html.id = `id${idCount.toString()}`;
    idCount += 1;

    if (index != null)
        parent.insertBefore(html, parent.children[index]);
    else if (parent != null)
        parent.appendChild(html);

    return html;
}

// let sheet = document.createElement('style');
// document.appendChild(sheet);
let sheet = elem(document.body, 'style');
export function style(html, val, pClass = null) {
    if (pClass == null) {
        sheet.innerHTML +=
            `#${html.id} {${val}}`;
    } else {
        sheet.innerHTML +=
            `#${html.id}:${pClass} {${val}}`;
    }
}