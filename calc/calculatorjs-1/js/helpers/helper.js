'use strict';

function createElement(tagName, className, text){
    var element = document.createElement(tagName);

    if (typeof className !== 'undefined') {
        element.className = className;
    }

    if (typeof text !== 'undefined') {
        element.appendChild(document.createTextNode(text));
    }
    return element;
}


function evaluateExpression(num1, operator, num2) {
    if (operator === '/') {
        return num1 / num2;
    }

    if (operator === '*') {
        return num1 * num2;
    }

    if (operator === '+') {
        return num1 + num2;
    }

    if (operator === '-') {
        return num1 - num2;
    }
}
