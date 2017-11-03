<?php
require_once("function.php");
session_start();
header("Content-type: text/html; charset=utf-8");

//CSRF トークン
$_SESSION['token']  = get_csrf_token();
?>

<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<script type="text/javascript">
/*
 * 登録前チェック  
 */
function conrimMessage() {
    var id = document.getElementById("id").value;

    //必須チェック
    if(id == "") {
        alert("必須項目が入力されていません。");
        return false;
    }

    return true;
}

</script>
</head>
<body>
<h1>パスワードリセット 画面</h1>
ID を登録すると、パスワードリセット用のアドレスを登録メールアドレスに送信します。
<?php
if ($_SESSION["error_status"] == 1) {
    echo "<h2 style='color:red;'>パスワードをリセットしてください。</h2>";
}
if ($_SESSION["error_status"] == 2) {
    echo "<h2 style='color:red;'>入力内容に誤りがあります。</h2>";
}
if ($_SESSION["error_status"] == 3) {
    echo "<h2 style='color:red;'>不正なリクエストです。</h2>";
}
?>

<form action="password_reset_mail.php" method="post" onsubmit="return conrimMessage();">
<table border="0">
<tr>
<td>ID</td>
<td><input type="text" name="id" id="id"></td>
</tr>

</table>
<input type="hidden" name="token" value="<?php echo htmlspecialchars($_SESSION['token']  , ENT_QUOTES, "UTF-8") ?>">
<input type="submit" value="登録">
<input type="button" value="戻る" onclick="history.back();">
</form>
</body>
</html>
