'use strict';

function DisplayPanel(){
}

DisplayPanel.prototype.initialize = function (options){
    this.createChildren(options);
};

DisplayPanel.prototype.createChildren = function (options) {
    this.displayPanelModel = new DisplayPanelModel({
        'defaultValue' : 0
    });
    options.displayPanelModel = this.displayPanelModel;
    this.displayPanelView = new DisplayPanelView(options);
};

DisplayPanel.prototype.setValue = function (value) {
    this.displayPanelView.setValue(value);
};