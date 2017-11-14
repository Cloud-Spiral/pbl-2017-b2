
// websocketオブジェクト
var yws;

// yws接続押下時の処理

function ywsConnection(){
	// WebSocketオブジェクト作成
	yws = new WebSocket('ws://' +  window.location.host + '/facitter/ws');
	//　本番環境用
	//yws = new WebSocket('wss://' + window.location.host + '/facitter/ws');

	// サーバからのメッセージ受信時の処理
	yws.onmessage = function(message) {
		//message = JSON.parse(message.data)
		var str = message.data.split(":")
		console.log(str)
		// TODO
		// DOM操作してHTMLに反映
		//$('#log').append('<p>' + message.data + '</p>');	
		if(str[0] == "start") {
			cntStart(parseInt(str[1]),parseInt(str[2]));
		}
		else if(str[0] == "stop") {
			cntStop();
		}
		else if(str[0] == "reset")
			reSet();
	};
	
	yws.onclose = function(closeEvent) {
	    console.log('code = ' + closeEvent.code + ', reason = ' + closeEvent.reason);
	};
}

// start押下時の処理
$('#start').click(function() {
    // TODO
	// テキストデータをinputフィールドから読み込む
	var min = $('#min').val();
	var sec = $('#sec').val();
	
	var str = "start" + ":" + min + ":" + sec;
	console.log(min + "   " + sec);
	// yws経由で送信
	yws.send(str);
});

//stop押下時の処理
$('#stop').click(function() {
	// yws経由で送信
	yws.send("stop");
});

//reset押下時の処理
$('#reset').click(function() {
	// yws経由で送信
	yws.send("reset");
});

	var timer1; //タイマーを格納する変数（タイマーID）の宣言
	
	
	//カウントダウン関数を1000ミリ秒毎に呼び出す関数
	function cntStart(min,sec) {
		document.timer.elements[2].disabled=true;
		$("#min").prop('disabled', true);
		$("#sec").prop('disabled', true);
		if (min=="") min=0;
		if (sec=="") sec=0;
		tmWrite(min*60+sec);
		
		timer1=setInterval("countDown()",1000);
	}
	
	//タイマー停止関数
	function cntStop() {
		document.timer.elements[2].disabled=false;
		$("#min").prop('disabled', false);
		$("#sec").prop('disabled', false);
		clearInterval(timer1);
	}
	
	//カウントダウン関数
	function countDown() {
		var min=document.timer.elements[0].value;
		var sec=document.timer.elements[1].value;
		  
		if( (min=="") && (sec=="") ) {
			alert("時刻を設定してください！");
			reSet();
		} else {
			if (min=="") min=0;
			min = parseInt(min);
			
			if (sec=="") sec=0;
			sec = parseInt(sec);
			
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
		$("#min").prop('disabled', false);
		$("#sec").prop('disabled', false);
		clearInterval(timer1);
	}  