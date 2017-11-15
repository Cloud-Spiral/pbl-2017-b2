var endpoint = 'http://localhost:8080/facitter/api';
// 本番環境用
// var endpoint = 'https://team2017-2.spiral.cloud/facitter/api';
// document.write("<script type='text/javascript'
// src='js/Moment.js'></script>");


// Userを登録
var register = function() {

	var userName = $('#userName').val();
	// var email = $('#email').val();
	var password = $('#password').val();
	var passwordConfirm = $('#passwordConfirm').val();
	/*
	 * var userName = document.getElementById('userName').value; var email =
	 * document.getElementById('email').value; var password =
	 * document.getElementById('password').value; var passwordConfirm =
	 * document.getElementById('passwordConfirm').value;
	 */

	// if ((userName == '' || email == '') || password == ''
	if (userName == '' || password == '' || passwordConfirm == '') {
		// console.log("any one is empty\n");
		return;
	}

	if (!confirmCheck())
		return;

	if (!checkContain()) {
		// console.log("Contain01");
		return;
	}

	$.ajax({
		type : 'POST',
		url : endpoint + '/users',
		data : {
			name : userName,
			password : password
		},
		success : function() {
			// flag = true;
			// 本番環境へ
			// window.location.href =
			// "https://team2017-2.spiral.cloud/lama/";
			window.location.href = "../facitter/";
		}
	});

}

var confirmCheck = function() {
	var form = document.forms[0];
	// エラーメッセージをクリアする
	// form.password.setCustomValidity("");
	// パスワードの一致確認
	if (form.password.value != form.passwordConfirm.value) {
		// 一致していなかったら、エラーメッセージを表示する
		console.log("一致してない\n");
		form.password.setCustomValidity("パスワードと確認用パスワードが一致しません");
		return false;
	} else {
		// エラーメッセージをクリアする
		form.password.setCustomValidity("");
	}
	return true;
}

// 指定したUserがDBに登録されているかを確認する
var checkContain = function() {
	var userName = document.getElementById('userName').value;
	var error = false;

	$.ajax({
		type : 'GET',
		url : endpoint + '/users/' + userName,
		data : {
			name : userName
		},
		async : false
	}).fail(function(response) {
		// 含まれていない
		// console.log(response);
		// console.log("Not contain");
		error = true;
	}).done(function(response) {
		// 含まれている
		// console.log(response);
		// console.log("Contain00");
		//return false;
	});

	return error;
}

// login
var login = function() {
	var userName = $('#userName').val();
	//var email = $('#email').val();
	var password = $('#password').val();
	var pass;

	$.ajax({
		type : 'GET',
		url : endpoint + '/users/' + userName,
		data : {
			name : userName
		},
		async : false
	}).fail(function(response) {
		// 含まれていない
		// console.log(response);
		// console.log("Not contain");
	}).done(function(response) {
		// 含まれている
		// console.log(response);
		// console.log("Contain00");
		pass = response['password'];
	});

	// console.log(password);
	// console.log(pass);

	if (password == pass) {
		window.location.href = "../facitter/";
	} else ;
		//window.location.reload();
}

/*window.onbeforeunload = function() {
	logout();
	return "本当に離れますか？";
};*/

var logout = function() {
	var userName = $('#userName').val();

	$.ajax({
		type : 'PUT',
		url : endpoint + '/users/logout/'+userName,
		data : $.param({name: userName}),
		success : function() {
			// flag = true;
			// 本番環境へ
			// window.location.href =
			// "https://team2017-2.spiral.cloud/lama/";
			window.location.href = "#";
		},
		error: function(xhr, ajaxOptions, thrownError) {
			alert("msg: "+thrownError.message+" , status: "+xhr.status)
		}
	});
}
