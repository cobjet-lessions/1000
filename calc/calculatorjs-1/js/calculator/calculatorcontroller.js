function CalculatorController() {
}
CalculatorController.prototype.initialize = function (options) {

    this.calculatorView = new CalculatorView({
                         el : options.calculatorContainerClass,
        'displayPanelClass' : 'js-display-panel',
        'buttonPanelClass'  : 'js-button-panel'
    });

    this.calculatorModel = new CalculatorModel({
        'calculatorType' : 'basic'
    });

    this.initializePanels();
    this.addEventListener();
};

CalculatorController.prototype.initializePanels = function() {
    this.displayPanel = new DisplayPanel();
    this.displayPanel.initialize({
        el: document.getElementsByClassName('js-display-panel')[0]
    });
    this.displayPanel.setValue(0);

    this.buttonPanel = new ButtonPanelController();
    this.buttonPanel.initialize({
        el: document.getElementsByClassName('js-button-panel')[0],
        buttonData : getButtonData()
    });
};

CalculatorController.prototype.addEventListener = function(){
    this.buttonPanel.addEventListener('numbersOperatorsClicked', this.setValue, this);
    this.buttonPanel.addEventListener('answerKeyClicked', this.calculate, this);
    this.buttonPanel.addEventListener('clearKeyClicked', this.resetDisplay, this);
    this.buttonPanel.addEventListener('backKeyClicked', this.editValue, this);
};

CalculatorController.prototype.resetDisplay= function () {
	this.calculatorModel.resetValue();
	this.displayPanel.setValue(this.calculatorModel.attributes.value);
};

CalculatorController.prototype.calculate= function () {
    var value = this.calculatorModel.attributes.value;
	if(value){
		var dataToEvaluate = value;
		var operatorPrecedenceArray = ['/', '*', '+', '-'];
		var expression = dataToEvaluate.split(' ');
		var i = 0;
		while (i <= operatorPrecedenceArray.length) {
			for (var index = 0 ; index <= expression.length; ++index){
				var operator = operatorPrecedenceArray[i];
				var operatorIndex = expression.indexOf(operator);
				if(operatorIndex !== -1){
					var num1 = parseFloat(expression[operatorIndex-1], 10);
					var num2 = parseFloat(expression[operatorIndex+1], 10);
					var ans = evaluateExpression(num1, expression[operatorIndex], num2);
					var isSingleOccurrence = operatorIndex === expression.lastIndexOf(operator);
					expression.splice(operatorIndex - 1, 3, ans);
					if (isSingleOccurrence) {
						++i;
						break;
					}
				}else{
					++i;
					break;
				}
			}
		}
		this.calculatorModel.resetValue();
		this.evaluatedValue = isFinite(expression[0]) ? parseFloat(expression[0]) : 'Error !';
		this.displayPanel.setValue(this.evaluatedValue);
	}else{
		this.displayPanel.setValue(this.evaluatedValue);
	}
};


CalculatorController.prototype.setValue = function (event) {
    var keyClickedValue = event.currentTarget.innerText;
    var value = this.calculatorModel.attributes.value;
    if(!value){
        this.calculatorModel.attributes.value = keyClickedValue;
    }else{
        if(isFinite(keyClickedValue)){
            if (value === '0' || value === 'Error !') {
                this.calculatorModel.attributes.value = keyClickedValue;
            } else {
                this.calculatorModel.attributes.value += keyClickedValue;
            }
        }else{
            if (keyClickedValue !== '.') {
                if(keyClickedValue === '-' && value.lastIndexOf(' ') === value.length-1){
                    this.calculatorModel.attributes.value += keyClickedValue;
            	}else {
                    var v = value[value.length - 2];
                    if(v !== undefined){
                        if(isFinite(v)){
                            this.calculatorModel.attributes.value += " " + keyClickedValue + " ";
                        }
                    }else{
                        this.calculatorModel.attributes.value += " " + keyClickedValue + " ";
                    }
            	}
            } else {
                this.calculatorModel.attributes.value += keyClickedValue;
            }
        }
    }
    this.displayPanel.setValue(this.calculatorModel.attributes.value);
};

CalculatorController.prototype.editValue = function (event) {
    var value = this.calculatorModel.attributes.value;
    if(value){
        this.calculatorModel.attributes.value = value.substring(0, value.length - 1);
    }else{
        value = 0;
    }
    this.displayPanel.setValue(value);
};