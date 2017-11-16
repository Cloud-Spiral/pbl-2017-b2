/**
 * husen you no JavaScript //
 */
var isMouseDown = false;
var offsetX, offsetY;
var cont;
var husenCount = 1;
var endpoint = "http://localhost:8080/facitter/api";
var isAllMax = 0;

//本番環境用
//var endpoint = 'https://team2017-2.spiral.cloud/facitter/api';

/*
 * websocket.jsに移動
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
	if(hws != null){
		return;
	}
	hws = new WebSocket('ws://' + window.location.host + '/facitter/hws');
	//　本番環境用
	//hws = new WebSocket('wss://' + window.location.host + '/facitter/hws');
	hws.onmessage = hwsOnMessage;
	hws.onclose = function(closeEvent) {
	    console.log('hws close code = ' + closeEvent.code + ', reason = ' + closeEvent.reason);
	};
}

function hwsOnMessage(message){
	var arrayStr = message.data.split(' ');
	if(arrayStr[0] === 'color'){
		colorSetter(parseInt(arrayStr[1]),parseInt(arrayStr[2]));
	}else if(arrayStr[0] === 'delete'){
		fadeOutContainer(parseInt(arrayStr[1]));
		setTimeout(deleter, 300, parseInt(arrayStr[1]));
	}else if(arrayStr[0] === 'good'){
		document.getElementsByName(arrayStr[1])[0].innerHTML = "Good:"+arrayStr[2];
	}else if(arrayStr[0] === 'bad'){
		document.getElementsByName(arrayStr[1])[0].innerHTML = "Bad:"+arrayStr[2];
	}else if(arrayStr[0] === 'text'){
		document.getElementsByName(arrayStr[1])[0].value = arrayStr[2];
	}else if(arrayStr[0] === 'position'){
		setPosition(arrayStr[1],arrayStr[2],arrayStr[3]);
	}else if(arrayStr[0] === 'new'){
		createCard(parseInt(arrayStr[1]));
		setTimeout(fadeInContainer, 200, parseInt(arrayStr[1]));
	}else if(arrayStr[0] === 'order'){
		$('.husen').css('transition','all 500ms 0s ease');
		reloadAllHusenPosition();
		setTimeout(function(){$('.husen').css('transition','all 300ms 0s ease');}, 200);
	}
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
	$("#header" + String(hid)).addClass("fadeIn");
	$("#handle" + String(hid)).addClass("fadeIn");
	var txtarea = document.getElementsByName("txt"+String(hid))[0];
	txtarea.classList.add("fadeIn");
	$("#buttonContainer" + String(hid)).addClass("fadeIn");
	//txtarea.className = "husen fadeIn";
	//$("input[name='txt" + String(hid)+"']").addClass("fadeIn");//なぜできない
}

function fadeOutContainer(hid){
	//$("#container" + String(hid)).removeClass("fadeIn");
	var container = document.getElementById("container"+String(hid));
	//console.log(container);
	container.style.opacity = 0;
	$("#header" + String(hid)).removeClass("fadeIn");
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

function setPositionFunc(array){
	setPosition(array[0],array[1],array[2]);
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
	
	document.getElementsByName("button"+String(count*4-3))[0].style.color = getHandleColor(color);
	document.getElementsByName("button"+String(count*4-2))[0].style.color = getHandleColor(color);
	document.getElementsByName("button"+String(count*4-1))[0].style.color = getHandleColor(color);
	
	document.getElementsByName("button"+String(count*4-3))[0].style.borderLeftColor = getHandleColor(color);
	document.getElementsByName("button"+String(count*4-2))[0].style.borderLeftColor = getHandleColor(color);
	document.getElementsByName("button"+String(count*4-1))[0].style.borderLeftColor = getHandleColor(color);
	
	removeColorChange(document.getElementsByName("button"+count*4)[0],count,color);
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
		return "#9E9E9E";
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
//画面の位置用
var targetElement = document.getElementById( "my_canvas" ) ;
var clientRect = targetElement.getBoundingClientRect() ;
// 画面内のキャンバスの位置
var canvasX = clientRect.left ;
var canvasY = clientRect.top ;

function draggable(count, handle, container) {
	container.style.position = "absolute";
	var containerId = container.id;
	container.onmousedown = function(event){
		//console.log(container.nextElementSibling.id);
		while(container.nextElementSibling != null &&
				container.nextElementSibling.classList.contains("husenContainer")){
			if (container.nextElementSibling != null) {
				$('#' + containerId).before($('#' + container.nextElementSibling.id));
			}
		}
	}

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
			//console.log(cont + " doubleClick");
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
			cont = null;
		}
		isMouseDown = false;
	}
	document.onmousemove = function(event) {		
		/* 変更前
		if (isMouseDown == true) {			
				cont.style.left = event.screenX - offsetX + "px";
				cont.style.top = event.screenY - offsetY + "px";
		}
		*/
		//ホワイトボードから付箋がはみ出さないように
		if (isMouseDown == true) {
			var rect = cont.getBoundingClientRect();
			var hwidth = 240;
			var hheight = 200;
			var xleft = event.screenX - offsetX - canvasX;//canvasからのhusenの位置x
			var ytop = event.screenY - offsetY -  canvasY;//canvasからのhusenの位置y
			var xright = xleft  +  hwidth ;
			var ybottom = ytop   +  hheight;
			var canvas = document.getElementById("my_canvas");
			var cwidth = canvas.width;
			var cheight = canvas.height;
			
			
			cont.style.left = event.screenX - offsetX + "px";
			cont.style.top = event.screenY - offsetY + "px";
			
			if(xleft < 0) cont.style.left = canvasX+1 + "px";
			if(ytop < 0) cont.style.top = canvasY+1 + "px";
			if(xright > cwidth + 5) cont.style.left = cwidth - hwidth + 5 + canvasX + "px";
			if(ybottom > cheight + 10) cont.style.top = cheight - hheight + 10 + canvasY + "px";
		}	
	}
}

function husenGrandOrder(){
	$.ajax({
		type : 'PUT',
		url : endpoint+'/husens/order',
		data:{
			number: 4,
			left: "75px",
			top: "75px",
			width: "245px",
			height: "200px" 
		},
		success : function(data) {
			//console.log('order-a');
			hws.send("order");
		},
		error: function(data) {
			//console.log('order-b');
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
				//setTimeout(setPositionFunc, 1200,[id,newx,newy]);
				setPosition(id,newx,newy);
			}
		}
	});
}

function allResizeHusen(){
	var contList = document.getElementsByClassName('husenContainer');
	if(isAllMax === 0){
		//minimize
		for(var i = 0; i < contList.length; i++){
			minimizeHusen(contList[i]);
		}
	}else if(isAllMax === 1){
		//transparentize
		for (var i = 0; i < contList.length; i++) {
			invisualizeHusen(contList[i]);
		}
	}else{
		//maximize
		for(var i = 0; i < contList.length; i++){
			maximizeHusen(contList[i]);
		}
	}
	isAllMax++;
	isAllMax = isAllMax%3;
}

function resizeContainer(cont){
	var contArray = cont.children;
	if(cont.classList.contains("mini")){
		invisualizeHusen(cont);
	}else if(cont.classList.contains("invisible")){
		maximizeHusen(cont);
	}else{
		minimizeHusen(cont);
	}
}

function minimizeHusen(cont){
	var contArray = cont.children;
	cont.classList.add("mini");
	cont.classList.remove("invisible");
	cont.style.width="120px";
	cont.style.opacity="1";
	for(var i = 0; i < contArray.length; i++){
		if(String(contArray[i].name).substring(0,3) === "txt"){
			document.getElementsByName(contArray[i].name)[0].style.height="25px";
		}else if(String(contArray[i].id).substring(0,15) === "buttonContainer"){
			document.getElementById(contArray[i].id).style.height="0px";
		}else if(String(contArray[i].id).substring(0,6) === "header"){
			document.getElementById(contArray[i].id).children[0].style.width = "99px";
		}
	}
}

function invisualizeHusen(cont){
	var contArray = cont.children;
	cont.classList.remove("mini");
	cont.classList.add("invisible");
	cont.style.width="120px";
	cont.style.opacity="0.15";
	for(var i = 0; i < contArray.length; i++){
		if(String(contArray[i].name).substring(0,3) === "txt"){
			document.getElementsByName(contArray[i].name)[0].style.height="25px";
		}else if(String(contArray[i].id).substring(0,15) === "buttonContainer"){
			document.getElementById(contArray[i].id).style.height="0px";
		}else if(String(contArray[i].id).substring(0,6) === "header"){
			document.getElementById(contArray[i].id).children[0].style.width = "99px";
		}
	}
}

function maximizeHusen(cont){
	var contArray = cont.children;
	cont.classList.remove("invisible");
	cont.classList.remove("mini");
	cont.style.width="240px";
	cont.style.opacity="1";
	for(var i = 0; i < contArray.length; i++){
		if(String(contArray[i].name).substring(0,3) === "txt"){
			document.getElementsByName(contArray[i].name)[0].style.height="150px";
		}else if(String(contArray[i].id).substring(0,15) === "buttonContainer"){
			document.getElementById(contArray[i].id).style.height="25px";
		}else if(String(contArray[i].id).substring(0,6) === "header"){
			document.getElementById(contArray[i].id).children[0].style.width = "204px";
		}
	}
}

function removeColorChange(remove,uniHusenCount,color){
	remove.style.color = "#FFFFFF";
	remove.style.background = getHandleColor(color);
	remove.style.borderLeftColor = getHandleColor(color);
	remove.style.borderRightColor = getHandleColor(color);
	remove.onmouseover = function(){
		document.getElementsByName("button"+uniHusenCount*4)[0].style.background = "#AAAAAA";
		document.getElementsByName("button"+uniHusenCount*4)[0].style.color= "#000000";
		document.getElementsByName("button"+uniHusenCount*4)[0].style.borderLeftColor = "#000000";
		document.getElementsByName("button"+uniHusenCount*4)[0].style.borderRightColor = "#000000";
	};
	remove.onmouseout = function(){
		document.getElementsByName("button"+uniHusenCount*4)[0].style.color = "#FFFFFF";
		document.getElementsByName("button"+uniHusenCount*4)[0].style.background = getHandleColor(color);
		document.getElementsByName("button"+uniHusenCount*4)[0].style.borderLeftColor = getHandleColor(color);
		document.getElementsByName("button"+uniHusenCount*4)[0].style.borderRightColor = getHandleColor(color);
	};

//	this.buttonRemove.style.color = "#FFFFFF";
//	this.buttonRemove.style.borderLeftColor = getHandleColor(color);
//	this.buttonRemove.style.borderRightColor = getHandleColor(color);
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
	"border:"+ getHandleColor(colorCount) +";box-shadow:4px 4px 8px #BBB;display:inline-block;" +
	"left:"+xPosition+";top:"+yPosition;

	this.header = document.createElement('div');
	this.header.id = "header"+String(uniHusenCount);
	this.header.className = 'husen';
	this.header.style.width = "100%";
	this.header.style.height = "25px";
	
	this.handle = document.createElement('div');
	this.handle.id = "handle"+String(uniHusenCount);
	this.handle.className = 'husen';
	this.handle.style.width = "204px";
	this.handle.style.height = "25px";
	this.handle.style.margin = "0px";
	this.handle.style.backgroundColor = getHandleColor(colorCount);
	this.handle.style.display = "inline-block";
	this.handle.style.position = "absolute";

	this.txtarea = document.createElement('textarea');
	this.txtarea.className = 'husen';
	this.txtarea.value = text;
	this.txtarea.name = "txt"+String(uniHusenCount);
	this.txtarea.style = "width:100%;height:"+height+";" +
	"background-color:"+getBackColor(colorCount)+";" +
	"display:block;resize:none;" +
	"border:0px;" +
	"font-size:20px;font-family:Arial";
	this.txtarea.onblur = function(){
		updateText(this.name,uniHusenCount);
	}

	var height = this.txtarea.style.height;

	this.buttonContainer = document.createElement('div');
	this.buttonContainer.className = 'husen buttonContainer';
	this.buttonContainer.style = "width:100%;height:25px;display:block;vertical-align:bottom;";
	this.buttonContainer.id = "buttonContainer"+String(uniHusenCount);
	
	this.buttonGood = document.createElement('a');
	this.buttonGood.name = "button" + String(uniHusenCount*4-3);
	this.buttonGood.className = "square_btn";
	this.buttonGood.innerHTML = "Good:"+String(goodCount);
	this.buttonGood.style = "width:32.05%;height:85%;vertical-align:top";
	this.buttonGood.onclick = function(){goodButtonCounter(this.name,uniHusenCount)};
	this.buttonGood.style.color = getHandleColor(color);
	this.buttonGood.style.borderLeftColor = getHandleColor(color);
	
	this.buttonBad = document.createElement('a');
	this.buttonBad.name = "button" + String(uniHusenCount*4-2);
	this.buttonBad.className = "square_btn";
	this.buttonBad.innerHTML = "Bad:"+String(badCount);
	this.buttonBad.style = "width:32.05%;height:85%;vertical-align:top";
	this.buttonBad.onclick = function(){badButtonCounter(this.name,uniHusenCount)};
	this.buttonBad.style.color = getHandleColor(color);
	this.buttonBad.style.borderLeftColor = getHandleColor(color);
	
	this.buttonColor = document.createElement('a');
	this.buttonColor.name = "button" + String(uniHusenCount*4-1);
	this.buttonColor.className = "square_btn";
	this.buttonColor.innerHTML = "Color";
	this.buttonColor.style = "width:32.05%;height:85%;vertical-align:top";
	this.buttonColor.onclick = function(){colorCounter(uniHusenCount,++colorCount)};
	this.buttonColor.style.color = getHandleColor(color);
	this.buttonColor.style.borderLeftColor = getHandleColor(color);

	this.buttonRemove = document.createElement('a');
	this.buttonRemove.name = "button" + String(uniHusenCount*4);
	this.buttonRemove.className = "square_rmbtn";
	this.buttonRemove.innerHTML = "×";
	this.buttonRemove.style = "width:12.5%;height:100%;vertical-align:top";
	this.buttonRemove.onclick = function(){deleteHusen(uniHusenCount)};
	
	removeColorChange(this.buttonRemove,uniHusenCount,color);
	
	this.header.appendChild(this.handle);
	this.header.appendChild(this.buttonRemove);
	this.container.appendChild(this.header);
	this.container.appendChild(this.txtarea);
	this.buttonContainer.appendChild(this.buttonColor);
	this.buttonContainer.appendChild(this.buttonGood);
	this.buttonContainer.appendChild(this.buttonBad);
	this.container.appendChild(this.buttonContainer);

	document.body.appendChild(this.container);
	//console.log(uniHusenCount);
	draggable(uniHusenCount, this.handle, this.container);
}