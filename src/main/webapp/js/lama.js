var endpoint = '/lama/api';
var current = 0;

var postLike = function() {
	$.ajax({
		type : 'POST',
		url : endpoint + '/likes'
	});
}

var postMessage = function() {
	var message = $('#message').val();
	$.ajax({
		type : 'POST',
		url : endpoint + '/comments',
		data : {
			body : message
		},
		success: function(){
			$('#message').val('');
		}
	});
}

var deleteComment = function(cid) {
	$.ajax({
		type : 'DELETE',
		url : endpoint + '/comments/'+ cid,
	});
}

var update = function() {
	$('#board').empty();
	$.ajax({
		type : 'GET',
		url : endpoint + '/likes',
		success : function(json) {
			$('#total').text(json.likes.length);
		}
	});
	$.ajax({
		type : 'GET',
		url : endpoint + '/comments?start=' + current,
		success : function(json) {
			current += json.comments.length;
			json.comments.forEach(function(v) {
				var cid = v.cid;
				$('#board').prepend('<p>' + '<input class="delete" id=' + cid + ' type="button" value="削除" onclick="deleteComment(this.id);">' + ' '　+ v.body + '</p>');
			});
		}
	});
}

var l = window.setInterval(update, 3000);
window.onload = update;

$('#like').click(postLike);
$('#submit').click(postMessage);