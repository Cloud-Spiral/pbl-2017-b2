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

// 
//var deleteComment = function(cid) {
//	$.ajax({
//		type : 'DELETE',
//		url : endpoint + '/comments/'+ cid,
//	});
//}

var getLikes = function() {
	$.ajax({
		type: 'GET',
		url: endpoint + '/likes',
		success: function(json) {
			$('#total').text(json.likes.length);
		}
		});
	}
 
var getComments = function() {
	$.ajax({
		type: 'GET',
		url: endpoint + '/comments',
		success: function(json) {			
			$('#board').empty();
			current += json.comments.length;
			json.comments.forEach(function(v) {
				var cid = v.cid;
				$('#board').prepend('<p>' + '<input class="delete" id=' + cid + ' type="button" value="削除" onclick="deleteComment(this.id);">' + ' '　+ v.body + '</p>');
			});
		}
	});
	}

setInterval(getLikes,2000);
setInterval(getComments,2000);

$('#like').click(postLike);
$('#submit').click(postMessage);