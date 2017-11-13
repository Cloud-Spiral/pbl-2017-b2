var endpoint = 'http://localhost:8080/lama/api';
var current = 0;

var hogetHello = function() {
	var name = $('#name').val();
	$.ajax({
		type : 'GET',
		url : endpoint + '/hello'
	});
}

var getHello = function() {
	var name = $('#name').val();
	$.ajax({
		type : 'GET',
		url : endpoint + '/hello',
		data: {name: name},
		success : function(helloText) {
			$('#board').text(helloText);
			console.log(helloText)
		}
	});
}

$('#submit').click(getHello);
