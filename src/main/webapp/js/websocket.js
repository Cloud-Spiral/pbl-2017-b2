
// websocketオブジェクト
var ws;

// ws接続押下時の処理
window.onload = function() {

	// WebSocketオブジェクト作成
	ws = new WebSocket('ws://' +  window.location.host + '/facitter/ws');
	//　本番環境用
	//ws = new WebSocket('wss://' + window.location.host + '/facitter/ws');
	
	update();

	// サーバからのメッセージ受信時の処理
	ws.onmessage = function(message) {
		//message = JSON.parse(message.data)
		message = message.data.split(" ")
		console.log(message)
		// TODO
		// DOM操作してHTMLに反映
		//$('#log').append('<p>' + message.data + '</p>');	
		if(message[0] == "start") {
			cntStart(message[1],message[2]);
		}
		else if(message[0] == "stop") {
			cntStop();
		}
		else if(message[0] == "reset")
			reSet();
	};
	
	ws.onclose = function(closeEvent) {
	    console.log('code = ' + closeEvent.code + ', reason = ' + closeEvent.reason);
	};


}

// start押下時の処理
$('#start').click(function() {
    // TODO
	// テキストデータをinputフィールドから読み込む
	var min = $('#min').val();
	var sec = $('#sec').val();
	
	var str = "start" + " " + sec + " " + min;

	// ws経由で送信
	ws.send(str);
});

//stop押下時の処理
$('#stop').click(function() {
	// ws経由で送信
	ws.send("stop");
});

//reset押下時の処理
$('#reset').click(function() {
	// ws経由で送信
	ws.send("reset");
});

	var timer1; //タイマーを格納する変数（タイマーID）の宣言
	
	
	//カウントダウン関数を1000ミリ秒毎に呼び出す関数
	function cntStart(min,sec) {
		document.timer.elements[2].disabled=true;
		timer1=setInterval("countDown(" + min + "," + sec + ")",1000);
	}
	
	//タイマー停止関数
	function cntStop() {
		document.timer.elements[2].disabled=false;
		clearInterval(timer1);
	}
	
	//カウントダウン関数
	function countDown(min,sec) {
		var min=min;
		var sec=sec;
		
		if( (min=="") && (sec=="") ) {
			alert("時刻を設定してください！");
			reSet();
		} else {
			if (min=="") min=0;
			min=parseInt(min);
			
			if (sec=="") sec=0;
			sec=parseInt(sec);
			
			tmWrite(min*60+sec-1);
		}
	}
	
	//残り時間を書き出す関数
	function tmWrite(int) {
		int=parseInt(int);
		
		if (int<=0) {
			reSet();
			alert("時間です！");
		} else {
			//残り分数はintを60で割って切り捨てる
			document.timer.elements[0].value=Math.floor(int/60);
			//残り秒数はintを60で割った余り
			document.timer.elements[1].value=int % 60;
		}
	}
	
	//フォームを初期状態に戻す（リセット）関数
	function reSet() {
		document.timer.elements[0].value="0";
		document.timer.elements[1].value="0";
		document.timer.elements[2].disabled=false;
		clearInterval(timer1);
	}  