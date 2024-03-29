
// websocketオブジェクト
var tws;
var userName;
// tws接続押下時の処理
window.onload = function() {
	//ふせん
	loadHusens();
	hwsConnection();
	twsConnection();
	
	//ホワイトボード
	whiteWsConnection();	
	//loadWhite();

	ywsConnection();
  
	userName = getCookie('userName');
	if(userName == null){
		userName = 'Guest';
	}
	////console.log("userName="+userName);
}
/* window.addEventListener( 'load', loadHusen);　で一つ一つ増やせるらしい
 */


function twsConnection(){
	// WebSocketオブジェクト作成
	//tws = new WebSocket('ws://' + window.location.host + '/facitter/ws');
	//　本番環境用
	tws = new WebSocket('wss://' + window.location.host + '/facitter/ws');
	
	$.fn.raty.defaults.path="image";
	$("#priority").raty({
		number: 5,
		score: 1
	});
	update();

	// サーバからのメッセージ受信時の処理
	tws.onmessage = function(message) {
		//message = JSON.parse(message.data)
		message = message.data.split(":")
		//////console.log(message)
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
	
	tws.onclose = function(closeEvent) {
	    ////console.log('tws close code = ' + closeEvent.code + ', reason = ' + closeEvent.reason);
	};
}

function onUnload(){
	  tws.close();
	  hws.close();
	  whiteWs.close();
}

window.addEventListener("unload",onUnload,false);
