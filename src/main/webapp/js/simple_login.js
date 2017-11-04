var endpoint = 'http://localhost:8080/lama/api';
//本番環境用
//var endpoint = 'https://team2017-2.spiral.cloud/lama/api';
document.write("<script type='text/javascript' src='js/Moment.js'></script>");

//タスクを投稿
var postName = function() {
    var userName = $('userName').val();

    $.ajax({
        type : 'POST',
        url : endpoint + '/login',
        data: {
            name: userName
        }
        /*success : function(userName) {
        //var message = {tid: data.tid, type: "post-task"};
        //ws.send(JSON.stringify(message));
        ws.send("register-user:"+userName);*/
    }
});

/*var login = function(var userName) {
    
}*/
