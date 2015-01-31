function CalculatorView(options) {
    this.initialize(options)
}

CalculatorView.prototype.initialize = function (options){
    this.render(options);
};

// create divisions for display panel and button panel
CalculatorView.prototype.render = function (options) {
    var calculatorContainer = document.getElementsByClassName(options.el)[0]
    var displayPanelContainerClass = options.displayPanelClass
    var displayPanelContainer = createElement('div',displayPanelContainerClass);
    calculatorContainer.appendChild(displayPanelContainer);

    var buttonPanelContainerClass = options.buttonPanelClass;
    var buttonPanelContainer = createElement('div', buttonPanelContainerClass);
    calculatorContainer.appendChild(buttonPanelContainer);
};
