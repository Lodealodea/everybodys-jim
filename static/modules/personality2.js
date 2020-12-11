import { container } from "./addons.js";
import { Card } from "./card.js";
import { elem } from "./core.js";

export function personality2(parent, socket, info) {
    let html = elem(parent);

    let box = container(parent);

    let card = new Card(box, false, 1);
    card.name.innerText = info.name;
}