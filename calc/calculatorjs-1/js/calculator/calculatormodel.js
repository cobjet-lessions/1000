function CalculatorModel(options) {
    this.initialize(options);
}


CalculatorModel.prototype.initialize = function (options) {
    this.attributes = {};
    this.attributes.type = options.calculatorType;
    this.attributes.value = '0';        // can come in options
};

CalculatorModel.prototype.resetValue = function(){
    this.attributes.value = '0';
};