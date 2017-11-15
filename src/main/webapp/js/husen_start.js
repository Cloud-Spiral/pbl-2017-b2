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
 * websocket.jsに移動
window.onload = function(){
	loadHusens();
	hwsConnection();
}*/

function setPositionFunc(array){
	setPosition(array[0],array[1],array[2]);
}

function setPosition(id,left,top){
	document.getElementById(id).style.left = left;
	document.getElementById(id).style.top = top;
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

document.onmouseup = function() {
	isMouseDown = false;
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
		} 
	}
	document.onmousemove = function(event) {		
		if (isMouseDown == true) {			
				cont.style.left = event.screenX - offsetX + "px";
				cont.style.top = event.screenY - offsetY + "px";
		}
	}
}

function makeCardStart(hid,text,xPosition,yPosition,height,good,bad,colorCount,canEditPerson){
	var uniHusenCount = hid;
	var goodCount=good;
	var badCount=bad;
	this.container = document.createElement('div');
	this.container.className = 'husen husenContainer';
	this.container.id = "container"+String(uniHusenCount);
	this.container.style="width:500px;background-color:"+ getBackColor(colorCount) +";" +
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
	this.txtarea.style = "width:98%;height:"+height+";" +
	"background-color:"+getBackColor(colorCount)+";" +
	"color:"+getHandleColor(colorCount)+";" + 
	"display:block;resize:none;" +
	"border:0px;" +
	"font-size:30px;font-family:Arial";


	this.container.appendChild(this.handle);
	this.container.appendChild(this.txtarea);

	document.body.appendChild(this.container);
	//console.log(uniHusenCount);
	draggable(uniHusenCount, this.handle, this.container);
}

function makeCardLogo(hid,text,xPosition,yPosition,height,good,bad,color,canEditPerson){
	var uniHusenCount = hid;
	var goodCount=good;
	var badCount=bad;
	var colorCount=color;
	this.container = document.createElement('div');
	this.container.className = 'husen husenContainer';
	this.container.id = "container"+String(uniHusenCount);
	this.container.style="width:725px;background-color:"+ getBackColor(colorCount) +";" +
	"border:"+ getHandleColor(colorCount) +";box-shadow:4px 4px 8px #BBB;" +
	"left:"+xPosition+";top:"+yPosition;

	this.handle = document.createElement('div');
	this.handle.id = "handle"+String(uniHusenCount);
	this.handle.className = 'husen_logo';
	this.handle.style.width = "100%";
	this.handle.style.height = "25px";
	this.handle.style.margin = "0px";
	this.handle.style.backgroundColor = getHandleColor(colorCount);

	this.txtarea = document.createElement('img');
	this.txtarea.src = "image/facitter-F.png";	
	this.container.appendChild(this.handle);
	this.container.appendChild(this.txtarea);

	document.body.appendChild(this.container);
	//console.log(uniHusenCount);
	draggable(uniHusenCount, this.handle, this.container);
}
function makeCardSign(hid,text,xPosition,yPosition,height,good,bad,color,canEditPerson){
	var uniHusenCount = hid;
	var goodCount=good;
	var badCount=bad;
	var colorCount=color;
	this.container = document.createElement('div');
	this.container.className = 'husen husenContainer';
	this.container.id = "container"+String(uniHusenCount);
	this.container.style="width:325px;background-color:"+ getBackColor(colorCount) +";" +
	"border:"+ getHandleColor(colorCount) +";box-shadow:4px 4px 8px #BBB;" +
	"left:"+xPosition+";top:"+yPosition;

	this.handle = document.createElement('div');
	this.handle.id = "handle"+String(uniHusenCount);
	this.handle.className = 'husen';
	this.handle.style.width = "100%";
	this.handle.style.height = "25px";
	this.handle.style.margin = "0px";
	this.handle.style.backgroundColor = getHandleColor(colorCount); 
	
	
	/*
	this.txtarea = document.createTextNode(text);
	this.txtarea.style = "width:98%;height:"+height+";" +
	"background-color:"+getBackColor(colorCount)+";" +
	"color:"+getHandleColor(colorCount)+";" + 
	"display:block;resize:none;" +
	"border:0px;" +
	"font-size:30px;font-family:Arial";
	*/
	
	this.txtarea = document.createElement('textarea');
	this.txtarea.style = "width:98%;height:"+height+";" +
	"background-color:"+getBackColor(colorCount)+";" +
	"color:"+getHandleColor(colorCount)+";" + 
	"display:block;resize:none;" +
	"border:0px;" +
	"font-size:30px;font-family:Arial";
	
	
	this.linkarea = document.createElement('a');
	this.linkarea.style = "color:"+getHandleColor(colorCount)+";" + "font-size:30px;font-family:Arial";
	if(hid == 0) this.linkarea.href = "http://localhost:8080/facitter/login.html";　//ローカル用
	else this.linkarea.href = "http://localhost:8080/facitter/signup.html";　//ローカル用
	this.linktxt = document.createTextNode(text);
	this.linkarea.appendChild(this.linktxt);
	this.txtarea.appendChild(this.linkarea);
	this.container.appendChild(this.handle);
	this.container.appendChild(this.linkarea);

	document.body.appendChild(this.container);
	//console.log(uniHusenCount);
	draggable(uniHusenCount, this.handle, this.container);
}


makeCardLogo(0,"LOGO","515px","100px","500px",0,0,0,0);
makeCardSign(0,"Sign In","1400px","160px","100px",0,0,4,0);
makeCardSign(1,"Create New Account","1380px","50px","100px",0,0,4,0);
makeCardStart(0,"What's Facitter?\n\nファシリテーション用のアプリです。","60px","420px","400px",0,0,2,0);
makeCardStart(0,"What's Facilitation?\n\nファシリテーションとは、なんかすごいやつです。","620px","400px","400px",0,0,3,0);
makeCardStart(0,"What's New?\n\n進捗ありません。","1250px","390px","400px",0,0,5,0);
makeCardStart(0,"現在の議題\n\n「どうすれば開発が締め切りまでに終わるか」","15px","30px","250px",0,0,4,0);

$("body").css("zoom","90%");