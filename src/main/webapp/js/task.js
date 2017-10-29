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
			//var message = {tid: data.tid, type: "post-task"};
			//ws.send(JSON.stringify(message));
			ws.send("post-task:"+data.tid);
		}
	});
}

//ブラウザのテーブルにタスクを追加する。
//https://qiita.com/i_am_207/items/2f7dc462aaaaac74592e
var insertTask = function(tid) {	
	$.ajax({
		type: 'GET',
		url: '/lama/api/tasks/'+tid,
		success: function(json)　{
			for(var i = 0; i < json.tasks.length; i++) {
				if(json.tasks[i].tid == tid) {
					var task = json.tasks[i];
					var taskNumber = i; 
				}
			}
			var buttonStatus = "close";
			if(task.status == "close")
				buttonStatus = "open";
			var table = document.getElementById(task.status+"-tbody");
			var tr = table.insertRow(taskNumber);
			var td1 = tr.insertCell(-1),
			td2 = tr.insertCell(-1),
			td3 = tr.insertCell(-1),
			td4 = tr.insertCell(-1);
			var body = '<input id=task-body' + task.tid + ' value=' + task.body +' type="text" onkeypress="changeTaskBody(this)">',
			date = moment(task.date).format('YYYY年MM月DD日 HH時mm分'),
			priority = '<input class=task-priority id=task-priority' + task.tid + ' value=' + task.priority +' type="number" oninput="changeTaskPriority(this)">',
			status = '<input id=task-status' + task.tid + ' type="button" value="' + buttonStatus + '" onclick="changeTaskStatus(this)">'
			td1.innerHTML = body;
			td2.innerHTML = date;
			td3.innerHTML = priority;
			td4.innerHTML = status;
		}
	});
}

//ブラウザのテーブルからタスクを削除する
var deleteTask = function(tid) {
	var target = document.getElementById("task-status"+tid);
	tr = target.parentNode.parentNode;
	tr.parentNode.deleteRow(tr.sectionRowIndex);
}

//タスクの状態を切り替える tidを受け取る
var changeTaskStatus = function(button) {
	var tid = button.id.replace("task-status","");
	console.log(button)
	//var message = {tid: tid, type: "delete-task"};
	//ws.send(JSON.stringify(message));
	ws.send("delete-task:"+tid);
	$.ajax({
		type : 'PUT',
		url : endpoint + '/tasks/status',
		data: {tid: tid},
		success : function(data) {
			//message = {tid: data.tid, type: "post-task"};
			//ws.send(JSON.stringify(message));
			ws.send("post-task:"+tid);
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

//taskの内容を変更
var changeTaskBody = function(task) {
	var key = window.event.keyCode;
	if(key == 13) {
		var tid = task.id.replace("task-body","");
		var body = $('#task-body'+tid).val();
		var priority = $('#task-priority'+tid).val();
		if(body == "") return;
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
				//ws.send("tasks")
			}
		});
	}
}

//taskの優先度を変更
var changeTaskPriority = function(task) {
	var key = window.event.keyCode;
	var tid = task.id.replace("task-priority","");
	var body = $('#task-body'+tid).val();
	var priority = $('#task-priority'+tid).val();
	if(priority == "") return;
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
			//ws.send("tasks")
		}
	});
}



var createTaskTable = function(tasks) {
	for(var i in tasks){
		var buttonStatus = "close";
		if(tasks[i].status == "close")
			buttonStatus = "open";
		$('<tr id=task-id' + tasks[i].tid +'>'
				+ '<td><input id=task-body' + tasks[i].tid + ' value=' + tasks[i].body +' type="text" onkeypress="changeTaskBody(this)">'
				+ '<td>' + moment(tasks[i].date).format('YYYY年MM月DD日 HH時mm分') + '</td>'
				+ '<td><input class=task-priority id=task-priority' + tasks[i].tid + ' value=' + tasks[i].priority +' type="number" oninput="changeTaskPriority(this)"></td>'
				+ '<td><input id=task-status' + tasks[i].tid + ' type="button" value="' + buttonStatus + '" onclick="changeTaskStatus(this)"></td>'
				+ '</tr>')
				.appendTo('table#' + tasks[i].status + '-tasks tbody');
		if(tasks[i].status == "open")
			changeColor(tasks[i]);
	}
} 

//websocketで変更があったときに、このメソッドを呼ぶ。（誰かがボタンを押すなど）誰も操作しない時間が続いても呼ぶ。（予定）
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

