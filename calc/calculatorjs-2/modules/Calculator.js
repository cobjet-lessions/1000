/**
 * Created by ypanyukov on 09.10.14.
 */

/**
 * Some functions to improve readability code
 */
(function () {
    HTMLElement.prototype.addEvent = function (type, handler) {
        if (this.addEventListener)
            this.addEventListener(type, handler, false);
        else if (this.attachEvent)
            this.attachEvent("on" + type, handler);
    };

    NodeList.prototype.toArray = function () {
        return [].map.call(this, function (element) {
            return element;
        });
    };

    window._isUndefined = function (value) {
        return typeof value == 'undefined';
    };

    window._isDefined = function (value) {
        return typeof value !== 'undefined';
    };

})();
/**
 * Some functions to improve readability code
 */

var Calculator = function (elemenets) {
    if (!Pubsub || !elemenets.numbers || !elemenets.operations || !elemenets.output)
        return;

    var numberElements = elemenets.numbers.toArray(),
        operationElements = elemenets.operations.toArray();

    var finalValue = 0,
        inputNumber = 0,
        processString = '',
        lastOperation = false,
        lastNumber = 0;

    var events = {
        operation: 'operation',
        final: 'final',
        process: 'process'
    };

    Pubsub.subscribe(events.process, function (data) {
        if (_isDefined(data.value))
            processString += data.value;
        else
            processString = '';

        elemenets.output.value = Number(processString);
    });

    Pubsub.subscribe(events.final, function (data) {
        if (_isDefined(data))
            elemenets.output.value = data.value;

        processString = '';
        lastNumber = finalValue;
    });

    Pubsub.subscribe(events.operation, function (data) {
        if (processString) {
            switch (lastOperation) {
                case 'addition':
                    finalValue = lastNumber + data.value;
                    break;
                case 'substraction':
                    finalValue = lastNumber - data.value;
                    break;
                case 'multiplication':
                    finalValue = lastNumber * data.value;
                    break;
                default:
                    finalValue = data.value;
            }
        }

        if (_isDefined(data)) {
            lastOperation = data.operation;
            lastNumber = data.value;
        }

        Pubsub.publish(events.final, {
            value: finalValue
        });
    });

    numberElements.forEach(function (element) {
        if (_isUndefined(element.getAttribute('data-number')))
            return;

        var number = element.getAttribute('data-number');

        element.addEvent('click', function (e) {
            e.preventDefault();

            Pubsub.publish(events.process, {
                value: number
            });
        });
    });

    operationElements.forEach(function (element) {
        if (_isUndefined(element.getAttribute('data-operation')))
            return;

        var operation = element.getAttribute('data-operation');

        element.addEvent('click', function (e) {
            e.preventDefault();

            inputNumber = Number(elemenets.output.value);

            Pubsub.publish(events.operation, {
                value: inputNumber,
                operation: operation
            });
        });
    });

    Pubsub.publish(events.process);
};