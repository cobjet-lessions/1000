function delayLog(message, delay, callback){
	setTimeout(function(){
		console.log(message);
		callback(null);
	}, delay);
}

console.log("Before the call");

delayLog("Hello Delay!", 10, function(err){

	console.log("After the message.");
});

console.log("When does this occur. ");
