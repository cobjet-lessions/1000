function guessColor(actualResult, userGuess){
  if(actualResult === userGuess){
    return 'green'
  }
  else {
    return 'red'
  }
}

$('#calculator').on('submit', function (e){
  e.preventDefault();

  var firstNumber = $('#first-number').val();
  var secondNumber = $('#second-number').val();

  var $errorDiv = $("div.error");
  var $resultEl = $("#result");
  var $guess = $("#user-guess");

  $errorDiv.html("");
  $resultEl.html("");
  if(firstNumber !== '' && secondNumber !== ''){
    firstNumber = parseInt(firstNumber);
    secondNumber = parseInt(secondNumber);
    var sum = firstNumber + secondNumber;

    $resultEl.html("Result: " + sum).css({
      "background-color": guessColor(sum, parseInt($("#user-guess").val()))
    });
  }
  else {
    $errorDiv.html("Please provide both numbers");
  }

});


