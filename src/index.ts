import {fromEvent}  from "rxjs";
import {filter} from 'rxjs/operators';
//import {prepend} from "ramda";
const R = require('ramda');
import {run} from './interpreter';
import {getValue} from './interpreter';

const acorn = require("acorn");

let input = document.querySelector('#input');
let array: string[] = [];
let totCount = 0;

const keyUps = fromEvent(input, 'keyup');
const keyDowns = fromEvent(input, 'keydown');
const keyPresses = keyUps.pipe(
    filter((e: KeyboardEvent) => e.keyCode === 13)
);

keyUps.pipe(
    filter((e: KeyboardEvent) => e.keyCode === 38)
    )
    .subscribe(function() {
    if (totCount >= 0 && totCount < array.length) {
        let val1 = array[totCount];
        totCount = totCount +1;
        document.querySelector('input').value = val1;
    }
})

keyDowns.pipe(
    filter((e: KeyboardEvent) => e.keyCode === 40)
    )
    .subscribe(function() {
        if (totCount <= array.length && totCount > 0) {
            totCount = totCount - 1; 
            let val1 = array[totCount];
            document.querySelector('input').value = val1;
        }
    })

keyPresses.subscribe(function (ev) {
    let value = (<HTMLInputElement>event.target).value;
    let eValue = "";
    if (value) {
    if (!/(var|let|const)/.test(value)) {
        eValue = `print(${value})`;
    }
    }
    try {
        const body = acorn.parse(eValue || value, { ecmaVersion: 2020 }).body;
        const jsInterpreter = run(body);
        let answer = getValue();
        const finalResult = answer ? value + " = " + answer : value;
        let textNode =  document.createTextNode(finalResult);
        let node = document.createElement("li");
        node.appendChild(textNode);
        document.getElementById("output").appendChild(node);
        array.unshift(value);
        totCount=0;
    }
    catch {
        console.log("error");
    }
    document.querySelector('input').value = " ";
})