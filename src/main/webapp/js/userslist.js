var endpoint = 'http://localhost:8080/facitter/api';

//本番環境用
//var endpoint = 'https://team2017-2.spiral.cloud/facitter/api';

/**
 * ユーザリスト（当選者リスト）を更新する
 * coded by Matsuzaki
 */
var wordcolor = ["#d900a9", "#ffb900", "#108904", "#5c239b", "#0078d7"];
var updateList = function(){
	$.ajax({
		type: 'GET',
		url: endpoint + '/users',
		success: function(json){
			$('#userlist').empty();			
			for(var i=0; i<json.users.length;i++){
				var str = '<li><span style="color:' + "#000000"/*wordcolor[i%5]*/ + '">　・ ' + json.users[i].name+  '</span></li>' ;
				$('#userlist').append(str);
			}
		}
	});
	$.ajax({
		type: 'GET',
		url: endpoint + '/winners',
		success: function(json){
			$('#lotterybox').empty();			
			for(var i=json.winners.length-1; i>-1;i--){
				var str = '<option>' + json.winners[i].name + '</option>' ;
			$('#lotterybox').append(str);
			}
		}
	});
	
}
/**
 * 参加しているユーザの中から抽選で一人を決定する
 * coded by Matsuzaki
 */
var startLottery = function() {
	$.ajax({
		type: 'GET',
		url: endpoint + '/users',
		dataType: 'json',
		success: function(json){			
			var min = 1;
			var max = json.users.length;
			var ran = Math.floor( Math.random() * (max + 1 - min) ) + min ;
		
			var str = '<option id="winner">'+  json.users[ran-1].name +'</option>';
			$('#lotterybox').append(str);
			registerWinner();
		}
	});	
}
/**
 * 抽選結果のWinnerを登録する
 * coded by Matsuzaki
 */
var registerWinner = function() {
	var winnerName = $('#winner').val();
	
	$.ajax({
		type : 'POST',
		url : endpoint + '/winners',
		data : {
			name : winnerName
		},
		success : function() {
				// flag = true;
				// 本番環境へ
				// window.location.href =
				// "https://team2017-2.spiral.cloud/lama/";
			
				//URLの遷移をするここでは用いない
				//window.location.href = "../lama/";
		}
	});
}

//一定時間毎に自動更新
setInterval(updateList, 50);