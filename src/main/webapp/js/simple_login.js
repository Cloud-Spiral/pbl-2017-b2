var endpoint = 'http://localhost:8080/lama/api';
//本番環境用
//var endpoint = 'https://team2017-2.spiral.cloud/lama/api';
//document.write("<script type='text/javascript' src='js/Moment.js'></script>");

//タスクを投稿
var postName = function() {
    var userName = $('#userName').val();
    //var flag = false;

    $.ajax({
        type : 'POST',
        url : endpoint + '/users',
        data: {
            name: userName
        },
    	success : function() {
    		//flag = true;
    		// 本番環境へ
    	    window.location.href = "https://team2017-2.spiral.cloud/lama/";
    	}
        /*success : function(userName) {
        //var message = {tid: data.tid, type: "post-task"};
        //ws.send(JSON.stringify(message));
        ws.send("register-user:"+userName);*/
    });
    
    // 本番環境へ
    //if(flag) window.location.href = "https://team2017-2.spiral.cloud/lama/";
    // local環境へ
    // window.location.href = "http://localhost:8080/lama/";
}

/*var login = function(var userName) {
    
}*/

//$('#submit-user').click(postUser);
