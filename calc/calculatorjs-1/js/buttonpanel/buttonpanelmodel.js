function ButtonPanelModel (options){
    this.initialize(options);
}

ButtonPanelModel.prototype.initialize = function (options){
    // create button data in separate file and pass that data in options

    this.attributes = options.buttonData;
};