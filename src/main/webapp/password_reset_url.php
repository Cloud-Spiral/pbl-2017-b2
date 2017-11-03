<?php
require_once 'MDB2.php';
require_once("function.php");
session_start();
header("Content-type: text/html; charset=utf-8");

//URLからパラメータ取得
$url_pass = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);

//CSRF
$_SESSION["token"] = get_csrf_token();

//ユーザー正式登録

//DB接続
$db = MDB2::connect(DNS);
if (PEAR::isError($db)) {
    die($db->getMessage());
}

//プレースホルダで SQL 作成
$sql = "SELECT * FROM USERS WHERE   TEMP_PASS = ? AND TEMP_LIMIT_TIME >= ?";

//パラメーターの型を指定
$stmt = $db->prepare($sql, array('text', 'timestamp'));

//10分前の時刻を取得
$date = new DateTime("- 10 min");

//パラメーターを渡して SQL 実行
$rs = $stmt->execute(array($url_pass, $date->format('Y-m-d H:i:s')));

$count  = 0;

while ($row = $rs->fetchRow(MDB2_FETCHMODE_ASSOC)) {
    $id= $row['id'];
    $count++;
}

$db->disconnect();

if ($count == 0) {
    //URLが不正か期限切れ
    $_SESSION["error_status"] = 3;
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: password_reset.php");
    exit();
}

//IDをセッションに格納
$_SESSION["id"] = $id;

?>

<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<script src="passwordchecker.js" type="text/javascript"></script>
<script src="common.js" type="text/javascript"></script>
<script type="text/javascript">
/*
 * 登録前チェック  
 */
function confirmMessage() {
    var pass = document.getElementById("password").value;
    var conf = document.getElementById("confirm_password").value;

    //必須チェック
    if((pass == "") || (conf == "")) {
        alert("必須項目が入力されていません。");
        return false;
    }

    //パスワードチェック
    if (pass != conf) {
        alert("パスワードが一致していません。");
        return false;
    }

    if (passwordLevel < 3) {
        return confirm("パスワード強度が弱いですがよいですか？");
    }
    return true;
}

</script>
</head>
<body>
<h1>パスワード変更画面（リセット）</h1>

<?php
if ($_SESSION["error_status"] == 1) {
    echo "<h2 style='color:red;'>入力内容に誤りがあります。</h2>";
}
if ($_SESSION["error_status"] == 2) {
    echo "<h2 style='color:red;'>不正なリクエストです。</h2>";
}
?>


<form action="password_reset_submit.php" method="post" onsubmit="return confirmMessage();">
<table border="0">
<tr>
<td>新しいパスワード</td>
<td><input type="password" name="password" id="password" onkeyup="setMessage(this.value);"></td>
<td><div id="pass_message"></div></td>
</tr>
<tr>
<td>新しいパスワード（確認）</td>
<td><input type="password" name="confirm_password" id="confirm_password" onkeyup="setConfirmMessage(this.value);"></td>
<td><div id="pass_confirm_message"></div></td>
</tr>
</table>
<input type="hidden" name="token" value="<?php echo htmlspecialchars($_SESSION['token']  , ENT_QUOTES, "UTF-8") ?>">
<input type="submit" value="更新">
<input type="button" value="戻る" onclick="history.back();">
</form>
</body>
</html>
