/**
 * 
 */

document.onkeydown = keydown;
document.onkeyup = keyup;

var shiftKeyDown = false;
var enterKeyDown = false;
function keydown() {
	if (event.shiftKey == true || event.ctrlKey == true) {
		shiftKeyDown = true;
	}
	if(event.keyCode == 13){
		enterKeyDown = true;
	}
	if(shiftKeyDown && enterKeyDown){
		var doc = document.activeElement;
		//console.log("同時説");
		//console.log(doc);
		doc.blur();
	}
}

function keyup() {
	if (event.shiftKey == true || event.ctrlKey == true) {
		shiftKeyDown = false;
	}
	if(event.keyCode == 13){
		enterKeyDown = false;
	}
}