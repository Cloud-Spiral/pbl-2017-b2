var endpoint = 'http://localhost:8080/lama/api';
document.write("<script type='text/javascript' src='js/Moment.js'></script>");

//タスクを投稿
var postTask = function() {
	var message = $('#message').val();
	var priority = $('#priority').val();
	if(priority == "")　{
		priority = 0;
	}

	$.ajax({
		type : 'POST',
		url : endpoint + '/tasks',
		data: {
			body: message,
			priority: priority
		},
		success : function(data) {
			//update(); //websocketでやる
			ws.send("tasks")
		}
	});
}

//タスクの状態を切り替える tidを受け取る
var changeTaskStatus = function(button) {
	var tid = button.id.replace("task-status","");
	$.ajax({
		type : 'PUT',
		url : endpoint + '/tasks/status',
		data: {tid: tid},
		success : function(data) {
			//update(); //websocketでやる
			ws.send("tasks")
		}
	});
}

//タスク自体を変更する tidを受け取る
//bodyが空のときの処理がまだ未実装
var changeTask = function(button) {
	var tid = button.id.replace("task-change-button","");
	var body = $('#task-body-text'+tid).val();
	var priority = $('#task-priority-number'+tid).val();
	if(priority == "")
		priority = 0;
	$.ajax({
		type : 'PUT',
		url : endpoint + '/tasks',
		data: {
			tid: tid,
			body: body,
			priority: priority
		},
		success : function(data) {
			//update(); //websocketでやる
			ws.send("tasks")
		}
	});
}

//セルの色を変える
var changeColor = function(task) {
	var currentDate = moment();
	var taskDate = moment(task.date);
	if(currentDate.diff(taskDate, "seconds") > 10) { //minutes１分以上たったら
		var taskId = '#task-id' + task.tid;
		$(taskId).css('background-color', 'red');
	}
}


var createTaskTable = function(tasks) {
	for(var i in tasks){
		var buttonStatus = "close";
		if(tasks[i].status == "close")
			buttonStatus = "open";
		$('<tr id=task-id' + tasks[i].tid +'>'
				+ '<td><input id=task-body-text' + tasks[i].tid + ' value=' + tasks[i].body +' type="text" style="ime-mode:disabled">'
				+ '<td>' + moment(tasks[i].date).format('YYYY年MM月DD日 HH時mm分') + '</td>'
				+ '<td><input id=task-priority-number' + tasks[i].tid + ' value=' + tasks[i].priority +' type="number" style="ime-mode:disabled">'
				+ '<td><input id=task-status' + tasks[i].tid + ' type="button" value="' + buttonStatus + '" onclick="changeTaskStatus(this)"></td>'
				+ '<td><input id=task-change-button' + tasks[i].tid + ' type="button" value="変更" onclick="changeTask(this)"></td>'
				+ '</tr>')
				.appendTo('table#' + tasks[i].status + '-tasks tbody');
		if(tasks[i].status)
			changeColor(tasks[i]);
	}
} 

//websocketで変更があったときに、このメソッドを呼ぶ。（誰かがボタンを押すなど）誰も操作しない時間が続いても呼ぶ。
/*
 * http://webworkersclip.com/2875/
 * http://www.ezgate-mt.sakura.ne.jp/jquery/161.html
 * https://app.codegrid.net/entry/momentjs
 */
var update = function() {
	$("table.task-table tbody").html("");
	$.ajax({
		type: 'GET',
		url: '/lama/api/tasks',
		success: function(json)　{
			var tasks = json.tasks;
			if(tasks.length == 0)
				return 0;
			createTaskTable(tasks);
		}
	});
}

//タブ切り替え
var tabChange = function() { 
	//.index()を使いクリックされたタブが何番目かを調べ、
	//indexという変数に代入します。
	var index = $('.tab li').index(this);

	//コンテンツを一度すべて非表示にし、
	$('.content li').css('display', 'none');

	//クリックされたタブと同じ順番のコンテンツを表示します。
	$('.content li').eq(index).css('display', 'block');

	//一度タブについているクラスselectを消し、
	$('.tab li').removeClass('select');

	//クリックされたタブのみにクラスselectをつけます。
	$(this).addClass('select')
}


//var l = window.setInterval(update, 10000);

$('#submit-task').click(postTask);
$('.tab li').click(tabChange);
window.onload = update;
