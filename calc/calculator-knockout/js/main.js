var CalculatorModel = function () {
  var self = this;

  // array of possible commands
  self.commands = [{
      command: ' + ',
      text: ' + '
    }, {
      command: ' - ',
      text: ' - '
    }, {
      command: ' * ',
      text: ' x '
    }, {
      command: ' / ',
      text: ' ÷ '
    },
    //        {command: 'sin', action: 'Math.sin(__param__)'},
    //        {command: 'cos', action: 'Math.cos(__param__)'},
    //        {command: 'tan', action: 'Math.tan(__param__)'},
    //        {command: 'ln', action: 'Math.log(__param__)'},
    //        {command: 'log', action: 'Math.log(__param__) / Math.log(10)'},
  ];

  // array of possible numbers
  // weird ordering to make layout better visually
  self.numbers = [{
    val: 7
  }, {
    val: 8
  }, {
    val: 9
  }, {
    val: 4
  }, {
    val: 5
  }, {
    val: 6
  }, {
    val: 1
  }, {
    val: 2
  }, {
    val: 3
  }, {
    val: 0
  }, ];

  // result command line
  self.commandline = ko.observable(0);

  // last used command
  self.lastCommand = ko.observable('');

  // do we need cleanup boolean
  self.needCleanup = ko.observable(false);

  // add a number function    
  self.addNumber = function (e) {
    if (self.needCleanup()) {
      self.commandline('');
      self.needCleanup(false);
    }

    // we don't need to add leading zeros
    if (this.val == 0 && self.commandline() == '') {
      return;
    }
    self.commandline(self.commandline() + this.val);
  };

  // add a command function
  self.addCommand = function (e) {
    if (e.action && self.commandline()) { // in case of commands which don't require a second value - we have to calculate a value
      var newCommand = e.action.replace('__param__', self.commandline());
      self.commandline(eval(newCommand));
      self.needCleanup(true);
    }

    if (self.lastCommand() == '') { // put a command into command line
      if (!e.action) {
        self.commandline(self.commandline() + e.command);
      }
      self.lastCommand(e.command);
    }
  };

  // toggle between negative and positive numbers
  self.doToggle = function (e) {
    self.commandline(self.commandline() * -1);
  };

  // calculation function
  self.doCalculate = function (e) {
    self.commandline(eval(self.commandline()));

    if (self.lastCommand() != '') {
      self.lastCommand('');
    }
    self.needCleanup(true);

    console.log(self.commandline());
  };

  // clear the command line
  self.doClear = function (e) {
    document.getElementById('commandLine').innerHTML = '0';
    self.needCleanup(true);
  };

  // disable buttons if we haven't added any numbers yet
  self.hasNumbers = ko.computed(function () {
    return self.commandline() == '';
  }, self);
};

ko.applyBindings(new CalculatorModel());