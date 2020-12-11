import { container, padder, StyleBtn } from "./addons.js";
import {elem, style} from "./core.js";

export function storyteller2(parent, socket) {
    let html = elem(parent);

    let domiBox = new container(html, "Dominent Personality");

    padder(html, 20);

    let diceBtn = new StyleBtn(html, "Set dice");

    padder(html, 20);

    let restBox = new container(html, "Personalities");

    padder(html, 20);

    let endBtn = new StyleBtn(html, "End game");
}