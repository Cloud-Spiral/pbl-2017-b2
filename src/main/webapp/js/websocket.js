
// websocketオブジェクト
var ws;

// ws接続押下時の処理
window.onload = function() {

	// WebSocketオブジェクト作成
	// 接続先は 'ws://localhost:8080/alpaca/ws'
	ws = new WebSocket('ws://' + window.location.host + '/lama/ws');
	update();

	// サーバからのメッセージ受信時の処理
	ws.onmessage = function(message) {
		//message = JSON.parse(message.data)
		message = message.data.split(":")
		console.log(message)
		// TODO
		// DOM操作してHTMLに反映
		//$('#log').append('<p>' + message.data + '</p>');	
		if(message[0] == "post-task") {
			insertTask(message[1]);
		}
		else if(message[0] == "delete-task") {
			deleteTask(message[1]);
		}
		else if(message[0] == "change-task-body")
			updateTaskBody(message[1]);
	};
	
	ws.onclose = function(closeEvent) {
	    console.log('code = ' + closeEvent.code + ', reason = ' + closeEvent.reason);
	};


}

// send押下時の処理
$('#send').click(function() {
    // TODO
	// テキストデータをinputフィールドから読み込む
	var body = $('#body').val();
	
	// ws経由で送信
	ws.send(body);
});

