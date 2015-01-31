function ButtonPanelController (){
}

ButtonPanelController.prototype.initialize = function(options){
    this.createChildren(options);
};

ButtonPanelController.prototype.createChildren= function (options) {
    this.buttonPanelModel = new ButtonPanelModel(options);
    options.buttonPanelModel = this.buttonPanelModel;

    this.buttonPanelView = new ButtonPanelView(options);
};

ButtonPanelController.prototype.addEventListener = function (eventType, handler, context) {
    this.buttonPanelView.addEventListener(eventType, handler, context);
};