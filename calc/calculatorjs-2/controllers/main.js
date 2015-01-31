/**
 * Created by ypanyukov on 09.10.14.
 */

(function(){
    var numberButtons = document.querySelectorAll('#calculator .numbers .number'),
        operationButtons = document.querySelectorAll('#calculator .operations .operation'),
        outputElement = document.querySelector('#calculator .output input[type="text"]');


    var calculator = new Calculator({
        numbers: numberButtons,
        operations: operationButtons,
        output: outputElement
    });

})();