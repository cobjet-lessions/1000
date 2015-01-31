/*
 *
 *	Simple Calculator JS
 *	
 *	Aaron Moradi - 10 / 2014
 *	aaronmoradi.com
 *
 */

var buttons = document.getElementsByTagName('button'); // calculator buttons

function calcClick()
{

	var	currentValue		= this.value, 				// clicked button's value
	    	totalScreen		= document.getElementById('total'), 	// total screen
		totScrVal		= totalScreen.value, 			// total screen value (string)
		totScrArray		= totScrVal.split(""); 

	/*----------------*/
	/*- Click Equals -*/ 
	/*----------------*/
	if (currentValue == "=")
	{
		// total screen populated
		if(totScrVal != "")
		{
			// replace E with (2.7) 
			if( (totScrVal.indexOf('E') >= 0))
			{
				totScrVal = totScrVal.replace(/E/gi,'(E)');
			}
			// replace PI with (PI)
			if( (totScrVal.indexOf('PI') >= 0))
			{
				totScrVal = totScrVal.replace(/PI/gi,'(PI)');
			} 
			// if has ^ sign replace with sqrt
			if( (totScrVal.indexOf('\u221A') >= 0) && (totScrVal.length > 3) && ((totScrVal.charAt((totScrVal.length)-1)) == ')' ) )
			{
				totScrVal = totScrVal.replace(/\u221A/g,'sqrt');
			}
			// compute total screen
			totalScreen.value = math.eval(totScrVal); 			
		}
		// total screen empty
		else 
		{
			totalScreen.value = "";
		}	
	} // end click equals

	/*----------------*/
	/*- Click Delete -*/ 
	/*----------------*/
	else if (currentValue == "delete")
	{
		var totScrArr 			= totalScreen.value,
			totScrArr 		= totScrArr.split(""),
			last 			= totScrArr.splice(-1, 1),
			totScrArr 		= totScrArr.join("");
			totalScreen.value 	= totScrArr;
	}

	/*---------------*/
	/*- Click Clear -*/ 
	/*---------------*/
	else if (currentValue == "clear")
	{
		totalScreen.value = "";
	}

	/*--------------------------*/
	/*- Click !=, !clear, !del -*/ 
	/*--------------------------*/
	else 
	{		
		if (totScrVal) // is total screen is already populated 
		{
		totalScreen.value = totalScreen.value + currentValue;
		}
		else
		{
		totalScreen.value = currentValue;
		}
	}
} // end calcClick()

/*---------------------------------*/
/*- Add Event Listener to Buttons -*/ 
/*---------------------------------*/
if (addEventListener) // non-IE, IE 9+ 
{
	for (var i=0; i < buttons.length; i++) 
	{
  		buttons[i].addEventListener('click', calcClick, false);
	}	
} 
else if (buttons.attachEvent) // IE 8 and earlier 
{
	for (var i=0; i < buttons.length; i++) 
	{
  		buttons[i].attachEvent('onclick', calcClick);
  	}
}
