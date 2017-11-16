
var whiteWs;
//var endpoint = "http://localhost:8080/facitter/api";
//本番環境用
var endpoint = 'https://team2017-2.spiral.cloud/facitter/api';

//最初のフラグ
var nowLoad = true;
//最初のloadをwsで送信するのときに使う


//$(document).ready(function(){

function whiteWsConnection() {
//	whiteWs = new WebSocket('ws://' + window.location.host + '/facitter/whiteWs');
	//　本番環境用
	whiteWs = new WebSocket('wss://' + window.location.host + '/facitter/whiteWs');


	//console.log("ws つなげる");
	whiteWs.onopen = function(){
		message = JSON.stringify({
			type: 'load',
			//history: historyJson,
			//index: record_index
		});
		whiteWs.send(message);

		loadWhite();
		//load();
	};

	whiteWs.onmessage = function(evt) {
		//return;
		console.log("ws get: "+evt.data);

		message = JSON.parse(evt.data);
		if(message.type === 'load' && !nowLoad){
			console.log('loadきたから履歴情報送ったげるで');
			message = JSON.stringify({
				type: 'update',
				//history: historyJson,
				index: record_index
			});
			whiteWs.send(message);

		} else if(message.type === 'update') {
			console.log('updateきたからcanvasに反映すんで');
			record_index = message.index;
			//recordArray = JSON.parse(message.history);
			loadWhite();
			//load();
			nowLoad = false;
		}
	};
}

function loadWhite(){
	//今までのホワイトボードの履歴を取得して反映する

	$.ajax({
		type: 'GET',
		url: endpoint + '/lines',
		success: function(json) {
			//console.log("success json"+ JSON.stringify(json));
			var latest_num = json.lines.length;

			console.log("line length: "+ latest_num);
			//console.log("json.lines[latest_num-1].line: \n"+json.lines[latest_num-1].line);

			if(latest_num !== 0){
				recordArray = JSON.parse(json.lines[latest_num-1].line);
				//record_index = json.lines[latest_num-1].index;
			}
			console.log("GET /lines record:"+JSON.stringify(recordArray[0]));
			console.log("GET /lines index:"+record_index);
			load();
		}
	});
}

var oldx, oldy;
var oldxx, oldyy;
var canvas, con, canvas_top = 20;
var colors = ["black", "red", "blue", "white"];
var color = colors[0];
var color_index = 0;
var colorString;
var eraser = false;
var drawing;
var sWidth = 5;
var eWidth = 15;
var swUpButton, swDownButton;
var redButton;
var record_index = 0;
var recordArray = new Array();
var lineRecords = new Array();
var freeHand = true
var stx, sty;
var viewPointer = false;

var historyJson;
var parsedJson = [];
var message;


//最初に実行される
//init();

//function init(){
//canvasのコンテキストを取得
canvas = document.getElementById("my_canvas");
con = canvas.getContext("2d");
con.lineWidth = sWidth;
var colors = ["black", "red", "blue", "white"];
con.lineCap = "round";
colorString = document.getElementById("size");
var oldGCO = con.globalCompositeOperation;

//キャンパスの描画領域の横幅を取得
var width = canvas.width;
var height = canvas.height;
//console.log("width: "+width);
//console.log("height: "+height);

swUpButton = $("#plus");
swDownButton = $("#minus");
swUpButton.mousedown(function (e){swUp(e);});
swDownButton.mousedown(function (e){swDown(e);});

$("#red,#black,#blue,#white").mousedown(function (e){colorChange(e,$(this));});
$("#clear li").mousedown(function (e){clear(e);});
$("#straight li").mousedown(function (e){straight(e);});
$("#freehand li").mousedown(function (e){freehand(e);});

$("#undo").mousedown(function (e){undo(e);});
$("#redo").mousedown(function (e){redo(e);});

canvas.onmousedown = function (e){drawLine(e,true);};
canvas.onmousemove = function (e){drawLine(e,false);};
canvas.onmouseup =  function (e){drawLine(e,false);};
//window上のmouseupイベントでstop()を呼び出す
window.addEventListener('mouseup', stop, false);
window.onmousemove = function (e){deletePointer();};

//}

function stop(event) {
	if (!drawing) return;
	if (event.type == "mouseup"){
		if(!freeHand){
			console.log("直線かくで");
			con.beginPath();
			con.moveTo(stx,sty);
			con.lineTo(oldx,oldy);
			con.stroke();
		}
		//履歴を記録
		recordArray[record_index] = lineRecords;
		//座標初期化
		lineRecords = new Array();
		//履歴を更新された場合最新の
		record_index++;
		if(record_index < recordArray.length){
			recordArray.splice(record_index,recordArray.length);
		}
	}
	drawing = false;   // ドラッグ中フラグを落とす
}

function drawLine(event,isStart){
	//console.log("drawLine");

	if(event.type == "mousedown"){
		drawing = true;
	}
	if(event.type == "mouseup")drawing = false;
	event.preventDefault();
	if(drawing){
		//console.log(drawing);
		var offset = $(event.target).offset();
		var mx = event.pageX - offset.left;
		var my = event.pageY - offset.top;
		if(isStart){
			if(freeHand){
				oldx = mx -1;
				oldy = my -1;
			} else {
				stx = mx -1;
				sty = my -1;
			}
		}
		if(freeHand){
			con.beginPath();
			con.moveTo(oldx,oldy);
			con.lineTo(mx,my);
			con.stroke();
		} else {
			//con.clearRect(0, 0, width, height);
			//load();
			//半透明
			con.globalAlpha = 0.3;

			con.beginPath();
			//console.log("直線の軌跡");
			con.moveTo(mx,my);
			con.lineTo(stx,sty);
			con.stroke();

			//戻す
			con.globalAlpha = 1;

		}
		oldx = mx;
		oldy = my;

		//座標を配列に保存				
		var xy = new Object();
		xy.x = mx;
		xy.y = my;
		xy.color = color;
		xy.size = con.lineWidth;
		xy.line = freeHand;
		xy.eraser = eraser;
		lineRecords.push(xy);
	}else{
		//ペンの状態を表示
		//con.clearRect(0, 0, width, height);
		//load();

		//console.log("mousemove");
		var offset = $(event.target).offset();
		var mx = event.pageX - offset.left;
		var my = event.pageY - offset.top;

		//半透明
		con.globalAlpha = 0.3;

		con.beginPath();
		con.moveTo(mx,my);
		con.lineTo(mx,my);
		con.stroke();
		oldxx = mx;
		oldyy = my;

		//戻す
		con.globalAlpha = 1;

		if (event.type == "mouseup"){
			if(!freeHand){
				console.log("直線かくで");
				con.beginPath();
				con.moveTo(stx,sty);
				con.lineTo(oldx,oldy);
				con.stroke();
			}
			//履歴を記録
			recordArray[record_index] = lineRecords;
			historyJson = JSON.stringify(recordArray);
			//console.log("historyJson: "+ historyJson);
			
			record_index++;
			
//			message = JSON.stringify({
//				type: 'update',
//				//history: historyJson,
//				index: record_index + 1,
//
//			});
			post(record_index);
//			console.log("ws send type:update");
//			whiteWs.send(message);

			//座標初期化
			lineRecords = new Array();
			//履歴を更新された場合最新の
			if(record_index < recordArray.length){
				recordArray.splice(record_index,recordArray.length);
			}
		}
	}
}

function deletePointer(){
	//カーソルが画面外に出たときにポインタをcanvasから駆除する
	var offset = $('#my_canvas').offset();
	var mx = event.pageX;
	var my = event.pageY;

	//console.log("left: " + offset.left + width + " top:" + offset.top + height);
	//console.log("mx :" + mx + "my :" + my);

	if(mx >= offset.left && mx <= offset.left + width && my >= offset.top && my <= offset.top + height){
		//console.log("in canvas");
	} else {
		//console.log("out of canvas");
		
		//con.clearRect(0, 0, width, height);
		//load();
	}
}

//線を太く
function swUp(e){
	if(eraser){
		eWidth++;
		eWidth++;
		eWidth++;
		con.lineWidth = eWidth;
		colorString.innerHTML = '<li>'+eWidth+'</li>';
	} else {
		sWidth++;
		sWidth++;
		sWidth++;
		con.lineWidth = sWidth;
		colorString.innerHTML = '<li>'+sWidth+'</li>';
	}
}
//線を細く
function swDown(e){
	if(eraser){
		if(eWidth > 0)eWidth--;
		if(eWidth > 0)eWidth--;
		if(eWidth > 0)eWidth--;
		con.lineWidth = eWidth;
		colorString.innerHTML = '<li>'+eWidth+'</li>';
	} else {
		if(sWidth > 0)sWidth--;
		if(sWidth > 0)sWidth--;
		if(sWidth > 0)sWidth--;
		con.lineWidth = sWidth;
		colorString.innerHTML = '<li>'+sWidth+'</li>';
	}
}

//カラーを変更
function colorChange(e, target){
	var my_color = $(target).css("background-color");
	console.log('いろ'+my_color);

	if(my_color === 'rgba(0, 0, 0, 0)')　{
		eraser = true;
		con.lineWidth = eWidth;
		colorString.innerHTML = '<li>'+eWidth+'</li>';
	} else {
		eraser = false;
		con.lineWidth = sWidth;
		colorString.innerHTML = '<li>'+sWidth+'</li>';

		con.strokeStyle = color = my_color;
	}
	switchEraser(eraser);
}

//消しゴムモードを変更
function switchEraser(eraser){
	if(eraser){
		// 消す準備
		con.globalCompositeOperation = 'destination-out';
	} else {
		// 消し終わったら戻す
		con.globalCompositeOperation = oldGCO;
	}
}

//画面を全削除
function clear(e){
	console.log("clear");
	//キャンバスを初期化
	con.clearRect(0,0,width,height);
	//座標を配列に保存				
	var xy = new Object();
	xy.clear = true;
	lineRecords.push(xy);
	//履歴を記録
	recordArray[record_index] = lineRecords;

	historyJson = JSON.stringify(recordArray);
	
	record_index++;

	
//	message = JSON.stringify({
//		type: 'update',
//		//history: historyJson,
//		index: record_index + 1,
//
//	});
	post(record_index);
//	console.log("ws send: clear");
//	whiteWs.send(message);


	//座標初期化
	lineRecords = new Array();
	//履歴を更新された場合最新の
	if(record_index < recordArray.length){
		recordArray.splice(record_index,recordArray.length);
	}
}

//直線、フリーハンド切り替え
function straight(e){
	freeHand = false;
	console.log(freeHand);
}
function freehand(e){
	freeHand = true;
	console.log(freeHand);
}

//アンドゥ
function undo(e){
	console.log("undo");
	if(record_index > 0){
		record_index--;
		load();
		historyJson = JSON.stringify(recordArray);

//		message = JSON.stringify({
//			type: 'update',
//			//history: historyJson,
//			index: record_index,
//
//		});
//		console.log("post前index: "+record_index);
		post(record_index);
//		console.log("ws send: undo index = "+record_index);
//		whiteWs.send(message);
	}
}

//リドゥ
function redo(e){
	console.log("redo");
	if(record_index < recordArray.length){
		record_index++;
		load();
		historyJson = JSON.stringify(recordArray);

//		message = JSON.stringify({
//			type: 'update',
//			//history: historyJson,
//			index: record_index,
//
//		});
		post(record_index);
//		console.log("ws send: redo");
//		whiteWs.send(message);
	}
}

//ロード
function load(){
	//console.log("load");
	//console.log("index: "+ record_index);
	//console.log("recordArray[0]: "+ recordArray[0]);
	//console.log("recordArray: "+ recordArray);

	//キャンバスを初期化
	con.clearRect(0,0,width,height);

	if(record_index === 0) return;

	//console.log("もらったrecordArray: "+recordArray);

	//線一本ずつ再現する
	//recordArray: 線の集まり（履歴）
	//record = recordArray[i]: 一本の線＝点の集まり
	//record[0]: 一点
	for(var i=0; i < record_index; i++){
		var record = recordArray[i];
		
		console.log("index: "+record_index);
		console.log("record: "+JSON.stringify(record));
		console.log("record[0]: "+JSON.stringify(record[0]));
		
		//描いていたときの状況を再現する
		var xy = record[0];
		line = xy.line;
		var clear = xy.clear;
		//console.log("clear: "+clear);
		//太さを描いたときの状態に戻す
		con.lineWidth = xy.size;
		con.strokeStyle = xy.color;
		switchEraser(xy.eraser);

		if(clear){
			con.clearRect(0,0,width,height);
		} else {
			if(line){
				for(var v=0; v<record.length; v++){
					if(typeof record[v] == "object"){
						var xy = record[v];
						//描画処理
						draw(v,xy.x,xy.y,xy.color);
					}
				}
			} else {
				//console.log("直線の履歴やで");
				var start = record[0];
				var end = record[record.length-1];
				con.beginPath();
				con.moveTo(start.x,start.y);
				con.lineTo(end.x,end.y);
				con.stroke();
			}
		}
		
		//console.log("文字サイズ: "+con.lineWidth);
		
		//現在の設定に戻す
		if(eraser){
			con.lineWidth = eWidth;
		} else{
			con.lineWidth = sWidth;
		}
		con.strokeStyle = color;
		switchEraser(eraser);
	}
}

function draw(num,x,y,color){
	var mx = x;
	var my = y;
	if(num == 0){
		oldx = mx -1;
		oldy = my -1;
	}
	con.beginPath();
	con.moveTo(oldx,oldy);
	con.lineTo(mx,my);
	con.strokeStyle = color;
	con.stroke();
	oldx = mx;
	oldy = my;
}

function post(record_index){
	$.ajax({
		type : 'POST',
		url : endpoint + '/lines',
		data : {
			index: record_index,
			line : historyJson
		},
		success: function(json){
			console.log('post success index is: '+ record_index);
			//console.log(json.line);
			//whiteWs.send(""+json.line);
			
			
			message = JSON.stringify({
				type: 'update',
				//history: historyJson,
				index: record_index,

			});
			console.log("ws send type:update");
			whiteWs.send(message);			
		},
		error: function(json){
		}
	});
}

//});
