$(document).ready(function(){


	var oldx, oldy;
	var canvas, con, canvas_top = 20;
	var colors = ["black"];
	var color = colors[0];
	var color_index = 0;
	var drawing;
	var sWidth = 5;
	var swUpButton, swDownButton;
	var redButton;
	var record_index = 0;
	var recordArray = new Array();
	var lineRecords = new Array();
	var freeHand = true
	var stx, sty;
	
	//最初に実行される
	//init();

//	function init(){
		//canvasのコンテキストを取得
		canvas = document.getElementById("my_canvas");
		con = canvas.getContext("2d");
		con.lineWidth = sWidth;
		var colors = ["black", "red", "blue", "yellow"];
		con.lineCap = "round";

		// キャンパスの描画領域の横幅を取得
		var width = canvas.width;
		var height = canvas.height;
		console.log("width: "+width);
		console.log("height: "+height);

		swUpButton = $("#plus");
		swDownButton = $("#minus");
		swUpButton.mousedown(function (e){swUp(e);});
		swDownButton.mousedown(function (e){swDown(e);});

		$("#red,#black,#blue,#yellow").mousedown(function (e){colorChange(e,$(this));});
		$("#clear li").mousedown(function (e){clear(e);});
		$("#straight li").mousedown(function (e){straight(e);});
		$("#freehand li").mousedown(function (e){freehand(e);});

		$("#undo").mousedown(function (e){undo(e);});
		$("#redo").mousedown(function (e){redo(e);});

		canvas.onmousedown = function (e){drawLine(e,true);};
		canvas.onmousemove = function (e){drawLine(e,false);};
		canvas.onmouseup =  function (e){drawLine(e,false);};
		// window上のmouseupイベントでstop()を呼び出す
		window.addEventListener('mouseup', stop, false);
	//}

	function stop(event) {
		if (!drawing) return;
		if (event.type == "mouseup"){
			if(!freeHand){
				console.log("直線かくで");
				//console.log("stx, y: "+stx+sty);
				//console.log("oldx, y: "+oldx+oldy);
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
			console.log(drawing);
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
			con.beginPath();
			con.moveTo(oldx,oldy);
			con.lineTo(mx,my);
			if(freeHand) con.stroke();
			oldx = mx;
			oldy = my;

			//座標を配列に保存				
			var xy = new Object();
			xy.x = mx;
			xy.y = my;
			xy.color = color;
			xy.size = con.lineWidth;
			xy.line = freeHand;
			lineRecords.push(xy);
		}else{
			if (event.type == "mouseup"){
				if(!freeHand){
					console.log("直線かくで");
					//console.log("stx, y: "+stx+sty);
					//console.log("oldx, y: "+oldx+oldy);
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
		}
	}

	//線を太く
	function swUp(e){
		sWidth++;
		sWidth++;
		sWidth++;
		con.lineWidth = sWidth;
	}
	//線を細く
	function swDown(e){
		if(sWidth > 0)sWidth--;
		if(sWidth > 0)sWidth--;
		if(sWidth > 0)sWidth--;
		con.lineWidth = sWidth;
	}

	//カラーを変更
	function colorChange(e, target){
		var my_color = $(target).css("background-color");
		con.strokeStyle = color = my_color;
	}
	//画面を全削除
	function clear(e){
		console.log("clear");
		//キャンバスを初期化
		con.clearRect(0,0,1000, 1000);
		//座標を配列に保存				
		var xy = new Object();
		xy.clear = true;
		lineRecords.push(xy);
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
			//キャンバスを初期化
			con.clearRect(0,0,1000, 1000);
			if(record_index == 0){
				//recordArray = [];
			}else{

				//線一本ずつ再現する
				for(var i=0; i < record_index; i++){
					var record = recordArray[i];

					//フラグ取り出す
					var xy = record[0];
					line = xy.line;
					var clear = xy.clear;
					console.log("clear: "+clear);
					if(!clear){
						if(line){
							for(var v=0; v<record.length; v++){
								if(typeof record[v] == "object"){
									var xy = record[v];
									//太さを描いたときの状態に戻す
									con.lineWidth = xy.size;
									//描画処理
									draw(v,xy.x,xy.y,xy.color);
									//現在の設定に戻す
									con.lineWidth = sWidth;
									con.strokeStyle = color;
								}
							}
						} else {
							console.log("直線の履歴やで");
							var start = record[0];
							var end = record[record.length-1];
							con.beginPath();
							//描いたときの状態に戻す
							con.lineWidth = start.size;
							con.strokeStyle = start.color;

							con.moveTo(start.x,start.y);
							con.lineTo(end.x,end.y);
							con.stroke();

							//現在の設定に戻す
							con.lineWidth = sWidth;
							con.strokeStyle = color;
						}
					} else {
						con.clearRect(0,0,1000, 1000);
					}
				}
			}
		}
	}

	//リドゥ
	function redo(e){
		console.log("redo");
		if(record_index < recordArray.length){
			record_index++;
			//キャンバスを初期化
			con.clearRect(0,0,1000, 1000);
			//線一本ずつ再現する
			for(var i=0; i < record_index; i++){
				var record = recordArray[i];

				//フラグ取り出す
				var xy = record[0];
				line = xy.line;
				var clear = xy.clear;
				console.log("clear: "+clear);
				if(!clear){
					if(line){
						for(var v=0; v<record.length; v++){
							if(typeof record[v] == "object"){
								var xy = record[v];
								//太さを描いたときの状態に戻す
								con.lineWidth = xy.size;
								//描画処理
								draw(v,xy.x,xy.y,xy.color);
								//現在の設定に戻す
								con.lineWidth = sWidth;
								con.strokeStyle = color;
							}
						}
					} else {
						console.log("直線の履歴やで");
						var start = record[0];
						var end = record[record.length-1];
						con.beginPath();
						//描いたときの状態に戻す
						con.lineWidth = start.size;
						con.strokeStyle = start.color;

						con.moveTo(start.x,start.y);
						con.lineTo(end.x,end.y);
						con.stroke();

						//現在の設定に戻す
						con.lineWidth = sWidth;
						con.strokeStyle = color;
					}
				} else {
					con.clearRect(0,0,1000, 1000);
				}
			}
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

});
