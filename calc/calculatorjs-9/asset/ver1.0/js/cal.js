/*RFish 2014*/

var keys = document.querySelectorAll('#calculator span');
var operator = ['+','-',"*","/"];
var dotflag = false;

for(var i = 0; i < keys.length; i++) {
    keys[i].onclick =  function(e)  {
        var screen = document.querySelector('.screen');
        var screenVal = screen.innerHTML;
        var pressVal = this.innerHTML;
        var lastVal = screenVal[screenVal.length -1 ];
        
        console.log('screen--' + screen);
        console.log(lastVal);   
        //console.log('val--' + screenVal);
        console.log('pressVal--' + pressVal);
        
        
        //press Clear
        if(pressVal == 'C') {
			screen.innerHTML = '0';
			dotflag = false;
            
        // press eval
        } else if (pressVal == '=') {
            
            if (operator.indexOf(lastVal) > -1 || pressVal == '.') {
                screen.innerHTML = screen.innerHTML.replace(/.$/, '');
            } else {
                screen.innerHTML = eval(screenVal);
            }
            
        //press operator
        } else if (operator.indexOf(pressVal) > -1 ) {
            
            if(operator.indexOf(lastVal) == -1 ) {//before press NUM
                screen.innerHTML += pressVal;
            } else if (operator.indexOf(lastVal) > -1) { //before press operator
                screen.innerHTML = screen.innerHTML.replace(/.$/,pressVal);
            } else { //error
            }
            dotflag = false;
            
        // press dot
        } else if (pressVal == '.') {
            if( !dotflag ){
                dotflag = true;
                screen.innerHTML += pressVal;
            }   
            
        // press NUM
        } else {
            if (screenVal == '0') {
                screen.innerHTML = pressVal;
            } else {
                screen.innerHTML += pressVal;
            }
        }
    
        // prevent page jumps
		e.preventDefault();
    }
}