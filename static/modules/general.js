export function copy(text) {
    let temp = document.createElement("input");
    temp.type = "text";
    document.body.appendChild(temp);
    temp.value = text;
    temp.select();
    temp.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(temp);
}