'use strict';

function DisplayPanelView(options){
    this.initialize(options);
}

DisplayPanelView.prototype.initialize = function (options) {
    this.render(options);
};

DisplayPanelView.prototype.render = function render(options) {
    this.defaultDisplayValue = options.displayPanelModel.attributes.defaultValue;
    this.displayPanelBand = createElement('input','js-display-band theme-display-band',this.defaultDisplayValue);
    this.displayPanelBand.setAttribute('readonly', 'readonly');
    options.el.appendChild(this.displayPanelBand);
};

DisplayPanelView.prototype.setValue = function (value) {
    this.displayPanelBand.value = value;
};

DisplayPanelView.prototype.getExpression = function () {
    return this.displayPanelBand.value;
};