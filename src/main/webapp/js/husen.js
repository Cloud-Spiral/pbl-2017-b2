/**
 * husen you no JavaScript
 */
var isMouseDown = false;
var offsetX, offsetY;
var cont;
var husenCount = 1;

function buttonCounter(name,txt){
	document.getElementsByName(name)[0].value = txt;
}

function colorCounter(count,color){
	var handle = "handle" + String(count);
	var container = "container" + String(count);
	var name = "txt" + String(count);
	document.getElementById(handle).style.backgroundColor = getHandleColor(color);
	document.getElementById(container).style.backgroundColor = getBackColor(color);
	document.getElementById(container).style.border = getBackColor(color);
	document.getElementsByName(name)[0].style.backgroundColor = getBackColor(color);
}

function deleteHusen(count){
	var container = "container" + String(count);
	document.getElementById(container).remove();
}

function getHandleColor(count){
	var colorStr;
	if(count % 6 === 0){
		return "#FFB900";
	}else if(count % 6 === 1){
		return "#BEBEBE";
	}else if(count % 6 === 2){
		return "#D900A9";
	}else if(count % 6 === 3){
		return "#5C239B";
	}else if(count % 6 === 4){
		return "#0078D7";
	}
	return "#108904";
}

function getBackColor(count){
	var colorStr;
	if(count % 6 === 0){
		return "#FFFF88";
	}else if(count % 6 === 1){
		return "#EFEFEF";
	}else if(count % 6 === 2){
		return "#FFBBFF";
	}else if(count % 6 === 3){
		return "#CFCBFF";
	}else if(count % 6 === 4){
		return "#CCEEFF";
	}
	return "#AEFFAE";
}

function draggable(handle, container) {
	container.style.position = "absolute";

	handle.onmousedown = function(event) {
		event.preventDefault();
		var rect = container.getBoundingClientRect();
		offsetX = event.screenX - rect.left;
		offsetY = event.screenY - rect.top;
		cont = container;
		isMouseDown = true;
	}

	document.onmouseup = function() {
		isMouseDown = false;
	}
	document.onmousemove = function(event) {
		if (isMouseDown == true) {
			cont.style.left = event.screenX - offsetX + "px";
			cont.style.top = event.screenY - offsetY + "px";
		}
	}
}

function Card() {
	var uniHusenCount = husenCount++;
	var goodCount=0;
	var badCount=0;
	var colorCount=0;
	this.container = document.createElement('div');
	this.container.id = "container"+String(uniHusenCount);
	this.container.style="width:300px;background-color:"+ getBackColor(colorCount) +";" +
			"border:"+ getHandleColor(colorCount) +";box-shadow:4px 4px 8px #BBB;" +
					"left:100px;top:130px";
	
	this.handle = document.createElement('div');
	this.handle.id = "handle"+String(uniHusenCount);
	this.handle.style.width = "100%";
	this.handle.style.height = "25px";
	this.handle.style.margin = "0px";
	this.handle.style.backgroundColor = getHandleColor(colorCount);

	this.txtarea = document.createElement('textarea');
	this.txtarea.name = "txt"+String(uniHusenCount);
	this.txtarea.style = "width:98%;height:200px;" +
			"background-color:"+getBackColor(colorCount)+";" +
			"display:block;resize:vertical;" +
			"border:0px;" +
			"font-size:20px;font-family:Arial";

	var height = this.txtarea.style.height;

	this.buttonContainer = document.createElement('div');
	this.buttonContainer.style = "width:100%;height:20px;display:block";
	
	this.buttonGood = document.createElement('input');
	this.buttonGood.type = "button";
	this.buttonGood.name = "button" + String(uniHusenCount*4-3);
	this.buttonGood.value = "Good:"+String(goodCount);
	this.buttonGood.style = "width:25%;height:20px;vertical-align:top";
	this.buttonGood.onclick = function(){
		buttonCounter(this.name,"Good:"+String(++goodCount))
	};

	this.buttonBad = document.createElement('input');
	this.buttonBad.type = "button";
	this.buttonBad.name = "button" + String(uniHusenCount*4-2);
	this.buttonBad.value = "Bad:"+String(badCount);
	this.buttonBad.style = "width:25%;height:20px;vertical-align:top";
	this.buttonBad.onclick = function(){
		buttonCounter(this.name,"Bad:"+String(++badCount))
	};
	
	this.buttonColor = document.createElement('input');
	this.buttonColor.type = "button";
	this.buttonColor.name = "button" + String(uniHusenCount*4-1);
	this.buttonColor.value = "Color";
	this.buttonColor.style = "width:25%;height:20px;vertical-align:top";
	this.buttonColor.onclick = function(){colorCounter(uniHusenCount,++colorCount)};
	
	this.buttonRemove = document.createElement('input');
	this.buttonRemove.type = "button";
	this.buttonRemove.name = "button" + String(uniHusenCount*4);
	this.buttonRemove.value = "Delete";
	this.buttonRemove.style = "width:25%;height:20px;vertical-align:top";
	this.buttonRemove.onclick = function(){deleteHusen(uniHusenCount)};

	//zyunban you kousatu
	this.container.appendChild(this.handle);
	this.container.appendChild(this.txtarea);
	this.buttonContainer.appendChild(this.buttonRemove);
	this.buttonContainer.appendChild(this.buttonColor);
	this.buttonContainer.appendChild(this.buttonGood);
	this.buttonContainer.appendChild(this.buttonBad);
	this.container.appendChild(this.buttonContainer);
	
	document.body.appendChild(this.container);
	draggable(this.handle, this.container);

	$.ajax({
		type : 'POST',
		url : endpoint + '/husens',
		data : {
			cid : uniHusenCount,
			text : 'test',//String(this.txtarea.value)
			xPosition : String(this.container.style.left),
			yPosition : String(this.container.style.top),
			height : String(this.txtarea.style.height),
			good : 0,
			bad : 0,
			color : 0,
			canEdit : 0
		},
		success: function(json){
			console.log(json);
			console.log('a');
		},
		error: function(json){
			console.log(json);
			console.log('b');
		}
	});
	return this.container;
}
