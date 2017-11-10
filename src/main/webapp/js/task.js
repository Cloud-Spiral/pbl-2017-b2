var endpoint = 'http://localhost:8080/facitter/api';

//本番環境用
//var endpoint = 'https://team2017-2.spiral.cloud/facitter/api';
document.write("<script type='text/javascript' src='js/Moment.js'></script>");

//タスクを投稿
var postTask = function() {
	var message = $('#message').val();
	//var priority = $('#priority-hidden').val();
	var priority = $('#priority').raty('score');
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
		url: endpoint + '/tasks/status/'+tid,
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
			
			var symbol = '<img src=image/default-symbol.png id=task-symbol' + task.tid + '>',
			body = '<input id=task-body' + task.tid + ' value=' + task.body +' type="text" onkeyup="changeTaskBody(this)">',
			//date = moment(task.date).format('YYYY年MM月DD日 HH時mm分'),
			priority = '<class=task-priority id=task-priority' + task.tid + '>', //oninpupt
			status = '<input id=task-status' + task.tid + ' type="button" value="' + buttonStatus + '" onclick="changeTaskStatus(this)">'
			td1.innerHTML = symbol;
			td2.innerHTML = body;
			td3.innerHTML = priority;
			td4.innerHTML = status;
			
			$("#task-symbol"+task.tid).parent().addClass('symbol-cell');
			$("#task-body"+task.tid).parent().addClass('body-cell');
			$("#task-priority"+task.tid).parent().addClass('priority-cell');
			$("#task-status"+task.tid).parent().addClass('status-cell');
			
			$("#task-priority"+task.tid).raty({
				number:5,
				score: task.priority,
				click: function(score, evt) {
					changeTaskPriority(this, score)
				}
			});
			if(task.status == "open") {
				changeSymbol(task);
			}
		}
	});
}

//ブラウザのテーブルからタスクを削除する
var deleteTask = function(tid) {
	var target = document.getElementById("task-status"+tid);
	tr = target.parentNode.parentNode;
	tr.parentNode.deleteRow(tr.sectionRowIndex);
}

//ブラウザのテーブルの内容を変更する
var updateTaskBody = function(tid) {
	$.ajax({
		type: 'GET',
		url: endpoint + '/tasks/'+tid,
		success: function(task)　{
			document.getElementById("task-body"+tid).value = task.body;
		}
	});
}

//タスクの状態を切り替える tidを受け取る
var changeTaskStatus = function(button) {
	var tid = button.id.replace("task-status","");
	//var message = {tid: tid, type: "delete-task"};
	//ws.send(JSON.stringify(message));
	ws.send("delete-task:"+tid);
	$.ajax({
		type : 'PUT',
		url : endpoint + '/tasks/status',
		data: {tid: tid},
		success : function(data) {
			ws.send("post-task:"+tid);
		}
	});
}

//シンボルを変える
var changeSymbol = function(task) {
	var currentDate = moment();
	var taskDate = moment(task.date);
	if(currentDate.diff(taskDate, "seconds") > 10) { //minutes１分以上たったら
		document.getElementById("task-symbol"+task.tid).src = "image/warning-symbol.png";
	}
}

//taskの内容を変更
var changeTaskBody = function(task) {
	var key = window.event.keyCode;
	//if(key == 13) {
		var tid = task.id.replace("task-body","");
		var body = $('#task-body'+tid).val();
		var priority = $('#task-priority'+tid).raty('score');
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
				ws.send("change-task-body:"+tid)
			}
		});
	//}
}

//taskの優先度を変更
var changeTaskPriority = function(task, priority) {
	var tid = task.id.replace("task-priority","");
	var body = $('#task-body'+tid).val();
	//var priority = $('#task-priority'+tid).raty('score');
	ws.send("delete-task:"+tid);
	$.ajax({
		type : 'PUT',
		url : endpoint + '/tasks',
		data: {
			tid: tid,
			body: body,
			priority: priority
		},
		success : function(data) {
			ws.send("post-task:"+tid);
		}
	});
}


//taskbodyはonkeypressのほうがいい
var createTaskTable = function(tasks) {
	for(var i in tasks){
		var buttonStatus = "close";
		if(tasks[i].status == "close")
			buttonStatus = "open";
		$('<tr id=task-id' + tasks[i].tid +'>'
				+ '<td class=symbol-cell><img src="image/default-symbol.png" id=task-symbol' + tasks[i].tid + '></td>'
				+ '<td class=body-cell><input id=task-body' + tasks[i].tid + ' value=' + tasks[i].body +' type="text" onkeyup="changeTaskBody(this)"></td>'
				//+ '<td>' + moment(tasks[i].date).format('YYYY年MM月DD日 HH時mm分') + '</td>'
				+ '<td class=priority-cell class=task-priority id=task-priority' + tasks[i].tid + '></td>' 
				+ '<td class=status-cell><input id=task-status' + tasks[i].tid + ' type="button" value="' + buttonStatus + '" onclick="changeTaskStatus(this)"></td>'
				+ '</tr>')
				.appendTo('table#' + tasks[i].status + '-tasks tbody');
		$("#task-priority"+tasks[i].tid).raty({
			number:5,
			score: tasks[i].priority,
			click: function(score, evt) {
				changeTaskPriority(this, score)
			}
		});
		if(tasks[i].status == "open") {
			changeSymbol(tasks[i]);
		}
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
		url: endpoint + '/tasks',
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
	$('.task-content li').css('display', 'none');

	//クリックされたタブと同じ順番のコンテンツを表示します。
	$('.task-content li').eq(index).css('display', 'block');

	//一度タブについているクラスselectを消し、
	$('.tab li').removeClass('select');

	//クリックされたタブのみにクラスselectをつけます。
	$(this).addClass('select')
}


//var l = window.setInterval(update, 10000);
//
$('#submit-task').click(postTask);
$('.tab li').click(tabChange);

