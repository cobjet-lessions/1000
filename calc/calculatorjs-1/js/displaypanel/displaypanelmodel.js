function DisplayPanelModel(options){
    this.initialize(options);
}

DisplayPanelModel.prototype.initialize = function(options) {
  this.attributes = {};
  this.attributes.defaultValue = options.defaultValue;
};