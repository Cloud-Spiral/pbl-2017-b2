/**
 * husen you no JavaScript //
 */
var isMouseDown = false;
var offsetX, offsetY;
var cont;
var husenCount = 1;
var endpoint = "http://localhost:8080/facitter/api";
var isAllMax = true;

//本番環境用
//var endpoint = 'https://team2017-2.spiral.cloud/facitter/api';

/*
window.onload = function(){
	loadHusens();
	hwsConnection();
}*/

$("#postit").mousedown(function (e){new Card();});
$("#allResize").mousedown(function (e){allResizeHusen();});
$("#FGO").mousedown(function (e){husenGrandOrder();});
//websocketオブジェクト
var hws;

function hwsConnection() {
	hws = new WebSocket('ws://' + window.location.host + '/facitter/ws');

	//　本番環境用
	//hws = new WebSocket('wss://' + window.location.host + '/facitter/ws');

	hws.onmessage = function(message) {
		var arrayStr = message.data.split(' ');
		if(arrayStr[0] === 'color'){
			colorSetter(parseInt(arrayStr[1]),parseInt(arrayStr[2]));
		}else if(arrayStr[0] === 'delete'){
			fadeOutContainer(parseInt(arrayStr[1]));
			setTimeout(deleter, 300, parseInt(arrayStr[1]));
		}else if(arrayStr[0] === 'good'){
			document.getElementsByName(arrayStr[1])[0].value = "Good:"+arrayStr[2];
		}else if(arrayStr[0] === 'bad'){
			document.getElementsByName(arrayStr[1])[0].value = "Bad:"+arrayStr[2];
		}else if(arrayStr[0] === 'text'){
			document.getElementsByName(arrayStr[1])[0].value = arrayStr[2];
		}else if(arrayStr[0] === 'position'){
			setPosition(arrayStr[1],arrayStr[2],arrayStr[3]);
//			document.getElementById(arrayStr[1]).style.left = arrayStr[2];
//			document.getElementById(arrayStr[1]).style.top = arrayStr[3];
		}else if(arrayStr[0] === 'new'){
			createCard(parseInt(arrayStr[1]));
			setTimeout(fadeInContainer, 200, parseInt(arrayStr[1]));
		}else if(arrayStr[0] === 'order'){
			reloadAllHusenPosition();
		}
	};
}

function loadHusens(){
	$.ajax({
		type: 'GET',
		url: endpoint + '/husens',
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
			}
			setTimeout(allFadein, 200, json);
		}
	});
}

function allFadein(json){
	for(i=0;i<json.husens.length;i++){
		fadeInContainer(json.husens[i].hid);
	}
}
function fadeInContainer(hid){
	$("#container" + String(hid)).addClass("fadeIn");
	$("#handle" + String(hid)).addClass("fadeIn");
	var txtarea = document.getElementsByName("txt"+String(hid))[0];
	txtarea.classList.add("fadeIn");
	$("#buttonContainer" + String(hid)).addClass("fadeIn");
	//txtarea.className = "husen fadeIn";
	//$("input[name='txt" + String(hid)+"']").addClass("fadeIn");//なぜできない
}

function fadeOutContainer(hid){
	$("#container" + String(hid)).removeClass("fadeIn");
	$("#handle" + String(hid)).removeClass("fadeIn");
	var txtarea = document.getElementsByName("txt"+String(hid))[0];
	txtarea.classList.remove("fadeIn");
	$("#buttonContainer" + String(hid)).removeClass("fadeIn");
	//	txtarea.className = "husen";
//	var txtName='input[name="txt' + String(hid)+'"]';
//	$(txtName).removeClass("fadeIn");
}

function updateText(name,count){
	$.ajax({
		type : 'PUT',
		url : endpoint+'/husens',
		data: {
			hid: count,
			text: document.getElementsByName(name)[0].value
		},
		success : function() {
			//console.log('text-a');
			hws.send("text "+name+" "+document.getElementsByName(name)[0].value);
		},
		error: function() {
			//console.log('text-b');
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
			//console.log('good-a');
			hws.send("good "+name+" "+good);
		},
		error: function(good) {
			//console.log('good-b');
		}
	});
}

function setPosition(id,left,top){
	document.getElementById(id).style.left = left;
	document.getElementById(id).style.top = top;
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
			//console.log('bad-a');
			hws.send("bad "+name+" "+bad);
		},
		error: function(bad) {
			//console.log('bad-b');
		}
	});
}
function colorSetter(count,color){
	var handle = "handle" + String(count);
	var container = "container" + String(count);
	var name = "txt" + String(count);
	document.getElementById(handle).style.backgroundColor = getHandleColor(color);
	document.getElementById(container).style.backgroundColor = getBackColor(color);
	document.getElementById(container).style.border = getBackColor(color);
	document.getElementsByName(name)[0].style.backgroundColor = getBackColor(color);
}

function colorCounter(count,color){
	$.ajax({
		type : 'PUT',
		url : endpoint+'/husens',
		data: {
			hid: count,
			color: color
		},
		success : function(data) {
			//console.log('put-a');
			hws.send("color "+count+" "+color);
		},
		error: function(data) {
			//console.log('put-b');
		}
	});
}

function deleter(hid){
	//var containerId = "#container" + String(hid);
	var container = document.getElementById("container"+String(hid));
	container.remove();
}

function deleteHusen(count){
	$.ajax({
		type : 'DELETE',
		url : endpoint+'/husens/'+count,
		success : function(data) {
			//console.log('delete-a');
			hws.send("delete "+count);
		},
		error: function(data) {
			//console.log('delete-b');
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

var clickCount = 0;
function draggable(count, handle, container) {
	container.style.position = "absolute";

	handle.onmousedown = function(event) {
		event.preventDefault();
		var rect = container.getBoundingClientRect();
		offsetX = event.screenX - rect.left;
		offsetY = event.screenY - rect.top;
		cont = container;
		isMouseDown = true;
		$('.husen').css('transition','all 0ms 0s ease');
		if( !clickCount ) {
			++clickCount ;
			setTimeout( function() {
				clickCount = 0 ;
			}, 350 ) ;
		// ダブルクリックの場合
		} else {
			$('.husen').css('transition','all 300ms 0s ease');
			console.log(cont + " doubleClick");
			resizeContainer(cont);
			clickCount = 0 ;
		}
	}

	document.onmouseup = function() {
		if (isMouseDown) {
			$.ajax({
				type : 'PUT',
				url : endpoint + '/husens',
				data : {
					hid : parseInt(cont.id.substring(9)),
					xPosition : cont.style.left,
					yPosition : cont.style.top
				},
				success : function(data) {
					//console.log('move-a');
					hws.send("position "+cont.id+" "+cont.style.left+" "+cont.style.top);
				},
				error : function(data) {
					//console.log('move-b');
					// hws.send("post-task:"+tid);
				}
			});
			$('.husen').css('transition','all 300ms 0s ease');
		}
		isMouseDown = false;
	}
	document.onmousemove = function(event) {
		if (isMouseDown == true) {
			cont.style.left = event.screenX - offsetX + "px";
			cont.style.top = event.screenY - offsetY + "px";
		}
	}
}



function husenGrandOrder(){
	$.ajax({
		type : 'PUT',
		url : endpoint+'/husens/order',
		data:{
			number: 4,
			left: "70px",
			top: "20px",
			width: "245px",
			height: "200px" 
		},
		success : function(data) {
			//console.log('order-a');
			hws.send("order");
		},
		error: function(data) {
			console.log('order-b');
		}
	});
}

function reloadAllHusenPosition(){
	$.ajax({
		type: 'GET',
		url: endpoint + '/husens',
		success: function(json) {
			for(i=0;i<json.husens.length;i++){
				var id = "container"+json.husens[i].hid;
				var newx = json.husens[i].xPosition;//String --px
				var newy = json.husens[i].yPosition;//String --px
				setPosition(id,newx,newy);
			}
		}
	});
}

function allResizeHusen(){
	var contList = document.getElementsByClassName('husenContainer');
	if(isAllMax){
		//minimize
		for(var i = 0; i < contList.length; i++){
			minimizeHusen(contList[i]);
		}
	}else{
		//maximize
		for(var i = 0; i < contList.length; i++){
			maximizeHusen(contList[i]);
		}
	}
	isAllMax = !isAllMax;
}

function resizeContainer(cont){
	var contArray = cont.children;
	if(cont.classList.contains("mini")){
		maximizeHusen(cont);
	}else{
		minimizeHusen(cont);
	}
}

function minimizeHusen(cont){
	var contArray = cont.children;
	cont.classList.add("mini");
	cont.style.width="120px";
	for(var i = 0; i < contArray.length; i++){
		if(String(contArray[i].name).substring(0,3) === "txt"){
			document.getElementsByName(contArray[i].name)[0].style.height="25px";
		}else if(String(contArray[i].id).substring(0,15) === "buttonContainer"){
			document.getElementById(contArray[i].id).style.height="0px";
		}
	}
}

function maximizeHusen(cont){
	var contArray = cont.children;
	cont.classList.remove("mini");
	cont.style.width="240px";
	for(var i = 0; i < contArray.length; i++){
		if(String(contArray[i].name).substring(0,3) === "txt"){
			document.getElementsByName(contArray[i].name)[0].style.height="150px";
		}else if(String(contArray[i].id).substring(0,15) === "buttonContainer"){
			document.getElementById(contArray[i].id).style.height="20px";
		}
	}
}

function Card() {
	//var x = this;
	$.ajax({
		type : 'POST',
		url : endpoint + '/husens',
		data : {
			text : "",
			xPosition : "100px",
			yPosition : "80px",
			height : "150px",
			good : 0,
			bad : 0,
			color : 0,
			canEdit : 0
		},
		success: function(json){
			//console.log(json);
			hws.send("new "+String(json.hid));
		},
		error: function(json){
			//console.log(json);
		}
	});
	//return this.container;
}
function createCard(hid){
	makeCard(hid,"","100px","80px","150px",0,0,0,0);
}

function makeCard(hid,text,xPosition,yPosition,height,good,bad,color,canEditPerson){
	var uniHusenCount = hid;
	var goodCount=good;
	var badCount=bad;
	var colorCount=color;
	this.container = document.createElement('div');
	this.container.className = 'husen husenContainer';
	this.container.id = "container"+String(uniHusenCount);
	this.container.style="width:240px;background-color:"+ getBackColor(colorCount) +";" +
	"border:"+ getHandleColor(colorCount) +";box-shadow:4px 4px 8px #BBB;" +
	"left:"+xPosition+";top:"+yPosition;

	this.handle = document.createElement('div');
	this.handle.id = "handle"+String(uniHusenCount);
	this.handle.className = 'husen';
	this.handle.style.width = "100%";
	this.handle.style.height = "25px";
	this.handle.style.margin = "0px";
	this.handle.style.backgroundColor = getHandleColor(colorCount);

	this.txtarea = document.createElement('textarea');
	this.txtarea.className = 'husen';
	this.txtarea.value = text;
	this.txtarea.name = "txt"+String(uniHusenCount);
	this.txtarea.style = "width:98%;height:"+height+";" +
	"background-color:"+getBackColor(colorCount)+";" +
	"display:block;resize:none;" +
	"border:0px;" +
	"font-size:20px;font-family:Arial";
	this.txtarea.onblur = function(){
		updateText(this.name,uniHusenCount);
	}

	var height = this.txtarea.style.height;

	this.buttonContainer = document.createElement('div');
	this.buttonContainer.className = 'husen';
	this.buttonContainer.style = "width:100%;height:20px;display:block";
	this.buttonContainer.id = "buttonContainer"+String(uniHusenCount);

	this.buttonGood = document.createElement('input');
	this.buttonGood.type = "button";
	this.buttonGood.name = "button" + String(uniHusenCount*4-3);
	this.buttonGood.value = "Good:"+String(goodCount);
	this.buttonGood.style = "width:25%;height:100%;vertical-align:top";
	this.buttonGood.onclick = function(){goodButtonCounter(this.name,uniHusenCount)};

	this.buttonBad = document.createElement('input');
	this.buttonBad.type = "button";
	this.buttonBad.name = "button" + String(uniHusenCount*4-2);
	this.buttonBad.value = "Bad:"+String(badCount);
	this.buttonBad.style = "width:25%;height:100%;vertical-align:top";
	this.buttonBad.onclick = function(){badButtonCounter(this.name,uniHusenCount)};

	this.buttonColor = document.createElement('input');
	this.buttonColor.type = "button";
	this.buttonColor.name = "button" + String(uniHusenCount*4-1);
	this.buttonColor.value = "Color";
	this.buttonColor.style = "width:25%;height:100%;vertical-align:top";
	this.buttonColor.onclick = function(){colorCounter(uniHusenCount,++colorCount)};

	this.buttonRemove = document.createElement('input');
	this.buttonRemove.type = "button";
	this.buttonRemove.name = "button" + String(uniHusenCount*4);
	this.buttonRemove.value = "Delete";
	this.buttonRemove.style = "width:25%;height:100%;vertical-align:top";
	this.buttonRemove.onclick = function(){deleteHusen(uniHusenCount)};

	this.container.appendChild(this.handle);
	this.container.appendChild(this.txtarea);
	this.buttonContainer.appendChild(this.buttonRemove);
	this.buttonContainer.appendChild(this.buttonColor);
	this.buttonContainer.appendChild(this.buttonGood);
	this.buttonContainer.appendChild(this.buttonBad);
	this.container.appendChild(this.buttonContainer);

	document.body.appendChild(this.container);
	//console.log(uniHusenCount);
	draggable(uniHusenCount, this.handle, this.container);
}
