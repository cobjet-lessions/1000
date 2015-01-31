function createButtonPanelTemplate(buttonPanelData){
    var containerDiv = createElement('div','js-button-panel-number-container');

    function createButtonPanelElements(rowDiv,data){
        containerDiv.appendChild(rowDiv);
        for(var rowIndex = 0; rowIndex < data.length; rowIndex++){
            var element = createElement('button', 'js-input-key theme-button', data[rowIndex]);
            rowDiv.appendChild(element);
        }
    }

    for(var key in buttonPanelData){
        if(buttonPanelData.hasOwnProperty(key)){
            var rowDiv = createElement('div','js-button-panel-operator-row');
            if(key === 'numbers'){
                var buttonPanelNumbers = buttonPanelData['numbers'];
                for(var index = 0; index < buttonPanelNumbers.length; index++){
                    var element = createElement('button', 'js-input-key theme-button', buttonPanelNumbers[index]);
                    rowDiv.appendChild(element);
                }
                containerDiv.appendChild(rowDiv);
            } else if (key === 'operators') {
                createButtonPanelElements(rowDiv, buttonPanelData[key]);
            }else if(key === 'special'){
                var specialKeys = buttonPanelData[key];
                for(var i = 0; i < specialKeys.length; i++){
                    var element = createElement('button', 'js-' + specialKeys[i] + '-key theme-button', specialKeys[i]);
                    rowDiv.appendChild(element);
                }
                containerDiv.appendChild(rowDiv);
            }
        }
    }

    return containerDiv;
}

function ButtonPanelView(options){
    this.initialize(options);
}

ButtonPanelView.prototype.initialize = function (options) {
    this.render(options);
};

ButtonPanelView.prototype.render = function(options){
    var buttonPanelData = options.buttonPanelModel.attributes;
    var buttonPanelTemplate = createButtonPanelTemplate(buttonPanelData);
    options.el.appendChild(buttonPanelTemplate);
};

ButtonPanelView.prototype.addEventListener = function(eventType,handler, context){
    function onClickHandler(event) {
        handler.call(context, event || window.event);
    }

    if(typeof eventType === 'string'){

        if(eventType === 'numbersOperatorsClicked'){
            var elements = document.getElementsByClassName('js-input-key'); // TODO: Use element.querySelector
            for(var i = 0 ; i < elements.length; i++){
                elements[i].addEventListener('click', onClickHandler, false);
            }

        }else if(eventType === 'answerKeyClicked'){
            var element =  document.getElementsByClassName('js-ans-key')[0]; // TODO: Use element.querySelector
            element.addEventListener('click', onClickHandler, false);

        }else if(eventType === 'clearKeyClicked'){
            var element = document.getElementsByClassName('js-clear-key')[0];  // TODO: Use element.querySelector
            element.addEventListener('click', onClickHandler, false);

        }else if(eventType === 'backKeyClicked'){
            var element = document.getElementsByClassName('js-back-key')[0];  // TODO: Use element.querySelector
            element.addEventListener('click', onClickHandler, false);
        }
    }

};

