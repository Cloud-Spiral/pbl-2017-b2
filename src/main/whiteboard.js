// forked from nekodon's "HTML5 でペイントツール" http://jsdo.it/nekodon/iaSK
$(document).ready(function(){
					
		var oldx, oldy;
		var canvas, con, canvas_top = 20;
		var colors = ["black", "red", "blue"];
		var color = colors[0];
		var color_index = 0;
		var drawing;
		var sWidth = 1;
		var swUpButton, swDownButton;
		var redButton;
		var record_index = 0;
		var recordArray = new Array();
		var lineRecords = new Array();
		
    	init();
    
        function init(){
        	//canvasのコンテキストを取得
			canvas = document.getElementById("my_canvas");
			con = canvas.getContext("2d");
			con.lineWidth = sWidth;
			con.strokeStyle = "black";
			con.lineCap = "round";
			
			swUpButton = $("#plus");
			swDownButton = $("#minus");
			swUpButton.mousedown(function (e){swUp(e);});
			swDownButton.mousedown(function (e){swDown(e);});
			
			$("#red,#black,#blue,#yellow").mousedown(function (e){colorChange(e,$(this));});
			$("#publish li").mousedown(function (e){imgPublish(e);});
			
			$("#undo").mousedown(function (e){undo(e);});
			$("#redo").mousedown(function (e){redo(e);});
			
			canvas.onmousedown = function (e){drawLine(e,true);};
			canvas.onmousemove = function (e){drawLine(e,false);};
			canvas.onmouseup =  function (e){drawLine(e,false);};
        }
        
    	function drawLine(event,isStart){
			if(event.type == "mousedown")drawing = true;
			if(event.type == "mouseup")drawing = false;
			event.preventDefault();
			if(drawing){
                console.log(drawing);
				var offset = $(event.target).offset();
				var mx = event.pageX - offset.left;
				var my = event.pageY - offset.top;
				if(isStart){
					oldx = mx -1;
					oldy = my -1;
				}
				con.beginPath();
				con.moveTo(oldx,oldy);
				con.lineTo(mx,my);
				con.stroke();
				oldx = mx;
				oldy = my;
				
				//座標を配列に保存				
				var xy = new Object();
				xy.x = mx;
				xy.y = my;
				xy.color = color;
				lineRecords.push(xy);
			}else{
				if (event.type == "mouseup"){
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
			con.lineWidth = sWidth;
		}
		//線を補足
		function swDown(e){
			if(sWidth > 0)sWidth--;
			con.lineWidth = sWidth;
		}
		
		//カラーを変更
		function colorChange(e, target){
			var my_color = $(target).css("background-color");
			con.strokeStyle = color = my_color;
		}
		
		//画像をパブリッシュ
		function imgPublish(e){
			var img=new Image();
		    //保存できるタイプは、'image/png'と'image/jpeg'の2種類
		    var type = 'image/png'; 
		    //imgオブジェクトのsrcに格納。
		    img.src = canvas.toDataURL(type);
		    //念のため、onloadで読み込み完了を待つ。
		    img.onload = function(){
		       //例：現在のウィンドウに出力。
		    	location.href = img.src;
		    };
		}
		
		//アンドゥ
		function undo(e){
			if(record_index > 0){
				record_index--;
				//キャンバスを初期化
				con.clearRect(0,0,600,500);
				if(record_index == 0){
					//recordArray = [];
				}else{
					for(var i=0; i < record_index; i++){
					var record = recordArray[i];
						for(var v=0; v<record.length; v++){
							if(typeof record[v] == "object"){
								var xy = record[v];
								//描画処理
								draw(v,xy.x,xy.y,color);
							}
						}
					}
				}
				
				
			}
		}
		
		//リドゥ
		function redo(e){
			if(record_index < recordArray.length){
				record_index++;
				//キャンバスを初期化
				con.clearRect(0,0,600,500);
				for(var i=0; i < record_index; i++){
					var record = recordArray[i];
					for(var v=0; v<record.length; v++){
						if(typeof record[v] == "object"){
							var xy = record[v];
							//描画処理
							draw(v,xy.x,xy.y,color);
						}
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
