/**
 * husen you no JavaScript
 */
var isMouseDown = false;
var offsetX, offsetY;
var cont;
var husenCount = 1;
var endpoint = "http://localhost:8080/lama/api"
	
window.onload = loadHusens();

function loadHusens(){
	$.ajax({
		type: 'GET',
		url: '/lama/api/husens',
		success: function(json) {
			for(i=0;i<json.husens.length;i++){
				new makeCard(json.husens[i].hid,
						json.husens[i].text,
						json.husens[i].xPosition,
						json.husens[i].yPosition,
						json.husens[i].height,
						json.husens[i].good,
						json.husens[i].bad,
						json.husens[i].color,
						json.husens[i].canEditPerson
						);
				//console.log(json.husens[i].hid);
			}
		}
	});
}

function goodButtonCounter(name,count){
	$.ajax({
		type : 'PUT',
		url : endpoint+'/husens',
		data: {
			hid: count,
			good: true
		},
		success : function(good) {
			console.log('good-a');
			document.getElementsByName(name)[0].value = "Good:"+good;
		},
		error: function(good) {
			console.log('good-b');
		}
	});
}

function badButtonCounter(name,count){
	$.ajax({
		type : 'PUT',
		url : endpoint+'/husens',
		data: {
			hid: count,
			bad: true
		},
		success : function(bad) {
			console.log('bad-a');
			document.getElementsByName(name)[0].value = "Bad:"+bad;
		},
		error: function(bad) {
			console.log('bad-b');
		}
	});
}


function colorCounter(count,color){
	var handle = "handle" + String(count);
	var container = "container" + String(count);
	var name = "txt" + String(count);
	document.getElementById(handle).style.backgroundColor = getHandleColor(color);
	document.getElementById(container).style.backgroundColor = getBackColor(color);
	document.getElementById(container).style.border = getBackColor(color);
	document.getElementsByName(name)[0].style.backgroundColor = getBackColor(color);
	$.ajax({
		type : 'PUT',
		url : endpoint+'/husens',
		data: {
			hid: count,
			color: color
		},
		success : function(data) {
			console.log('put-a');
			//ws.send("post-task:"+tid);
		},
		error: function(data) {
			console.log('put-b');
			//ws.send("post-task:"+tid);
		}
	});
}

function deleteHusen(count){
	var container = "container" + String(count);
	document.getElementById(container).remove();
	$.ajax({
		type : 'DELETE',
		url : endpoint+'/husens/'+count,
		success : function(data) {
			console.log('delete-a');
			//ws.send("post-task:"+tid);
		},
		error: function(data) {
			console.log('delete-b');
			//ws.send("post-task:"+tid);
		}
	});
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
	

	this.buttonBad = document.createElement('input');
	this.buttonBad.type = "button";
	this.buttonBad.name = "button" + String(uniHusenCount*4-2);
	this.buttonBad.value = "Bad:"+String(badCount);
	this.buttonBad.style = "width:25%;height:20px;vertical-align:top";

	
	this.buttonColor = document.createElement('input');
	this.buttonColor.type = "button";
	this.buttonColor.name = "button" + String(uniHusenCount*4-1);
	this.buttonColor.value = "Color";
	this.buttonColor.style = "width:25%;height:20px;vertical-align:top";
	
	
	this.buttonRemove = document.createElement('input');
	this.buttonRemove.type = "button";
	this.buttonRemove.name = "button" + String(uniHusenCount*4);
	this.buttonRemove.value = "Delete";
	this.buttonRemove.style = "width:25%;height:20px;vertical-align:top";


	this.container.appendChild(this.handle);
	this.container.appendChild(this.txtarea);
	this.buttonContainer.appendChild(this.buttonRemove);
	this.buttonContainer.appendChild(this.buttonColor);
	this.buttonContainer.appendChild(this.buttonGood);
	this.buttonContainer.appendChild(this.buttonBad);
	this.container.appendChild(this.buttonContainer);
	
	document.body.appendChild(this.container);
	draggable(this.handle, this.container);
	var x = this;
	$.ajax({
		type : 'POST',
		url : endpoint + '/husens',
		data : {
			text : String(this.txtarea.value),
			xPosition : String(this.container.style.left),
			yPosition : String(this.container.style.top),
			height : String(this.txtarea.style.height),
			good : 0,
			bad : 0,
			color : 0,
			canEdit : true
		},
		success: function(json){
			//console.log(json);
			uniHusenCount = json.hid;
			x.container.id = "container"+String(uniHusenCount);
			x.handle.id = "handle"+String(uniHusenCount);
			x.txtarea.name = "txt"+String(uniHusenCount);
			x.buttonGood.name = "button" + String(uniHusenCount*4-3);
			x.buttonBad.name = "button" + String(uniHusenCount*4-2);
			x.buttonColor.name = "button" + String(uniHusenCount*4-1);
			x.buttonRemove.name = "button" + String(uniHusenCount*4);	
			x.buttonColor.onclick = function(){colorCounter(uniHusenCount,++colorCount)};
			x.buttonRemove.onclick = function(){deleteHusen(uniHusenCount)};
			x.buttonGood.onclick = function(){goodButtonCounter(this.name,uniHusenCount)};
			x.buttonBad.onclick = function(){badButtonCounter(this.name,uniHusenCount)};
		},
		error: function(json){
			//console.log(json);
		}
	});
	return this.container;
}

function makeCard(hid,text,xPosition,yPosition,height,good,bad,color,canEditPerson){
	var uniHusenCount = hid;
	var goodCount=good;
	var badCount=bad;
	var colorCount=color;
	this.container = document.createElement('div');
	this.container.id = "container"+String(uniHusenCount);
	this.container.style="width:300px;background-color:"+ getBackColor(colorCount) +";" +
			"border:"+ getHandleColor(colorCount) +";box-shadow:4px 4px 8px #BBB;" +
					"left:"+xPosition+";top:"+yPosition;
	
	this.handle = document.createElement('div');
	this.handle.id = "handle"+String(uniHusenCount);
	this.handle.style.width = "100%";
	this.handle.style.height = "25px";
	this.handle.style.margin = "0px";
	this.handle.style.backgroundColor = getHandleColor(colorCount);

	this.txtarea = document.createElement('textarea');
	this.txtarea.value = text;
	this.txtarea.name = "txt"+String(uniHusenCount);
	this.txtarea.style = "width:98%;height:"+height+";" +
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
	this.buttonGood.onclick = function(){goodButtonCounter(this.name,uniHusenCount)};

	this.buttonBad = document.createElement('input');
	this.buttonBad.type = "button";
	this.buttonBad.name = "button" + String(uniHusenCount*4-2);
	this.buttonBad.value = "Bad:"+String(badCount);
	this.buttonBad.style = "width:25%;height:20px;vertical-align:top";
	this.buttonBad.onclick = function(){badButtonCounter(this.name,uniHusenCount)};
	
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

	this.container.appendChild(this.handle);
	this.container.appendChild(this.txtarea);
	this.buttonContainer.appendChild(this.buttonRemove);
	this.buttonContainer.appendChild(this.buttonColor);
	this.buttonContainer.appendChild(this.buttonGood);
	this.buttonContainer.appendChild(this.buttonBad);
	this.container.appendChild(this.buttonContainer);
	
	document.body.appendChild(this.container);
	draggable(this.handle, this.container);
}
