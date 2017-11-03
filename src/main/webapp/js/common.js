/*
 * パスワード強度チェック
 * see
 *  https://www.websec-room.com/passswordchecker
 * [参考URL]
 * https://www.websec-room.com/2015/03/15/2153
 */
var passwordLevel = 0;

function setMessage(password) {
    passwordLevel = getPasswordLevel(password);
    var message = "";
    if (passwordLevel == 1) {message = "弱い";}
    if (passwordLevel == 2) {message = "やや弱い";}
    if (passwordLevel == 3) {message = "普通";}
    if (passwordLevel == 4) {message = "やや強い";}
    if (passwordLevel == 5) {message = "強い";}

    var div = document.getElementById("pass_message");
    if (!div.hasFistChild) {div.appendChild(document.createTextNode(""));}
    div.firstChild.data = message;
}

/*
 * パスワード一致チェック
 */
function setConfirmMessage(confirm_password) {
    var password = document.getElementById("password").value;
    var message = "";
    if (password == confirm_password) {
        message = "";
    } else {
        message =  "パスワードが一致しません";
    }

    var div = document.getElementById("pass_confirm_message");
    if (!div.hasFistChild) {div.appendChild(document.createTextNode(""));}
    div.firstChild.data = message;
}
