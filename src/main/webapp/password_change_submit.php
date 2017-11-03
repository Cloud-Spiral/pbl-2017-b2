<?php
require_once 'MDB2.php';
require_once("function.php");
session_start();
header("Content-type: text/html; charset=utf-8");

$id = $_SESSION["id"];
$old_password = $_POST['old_password'];
$password = $_POST["password"];
$confirm_password = $_POST["confirm_password"];
$token = $_POST["token"];

// CSRFチェック
if ($_SESSION["token"] != $token) {
    $_SESSION = array();
    session_destroy();
    session_start();

    $_SESSION["error_status"] = 2;
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: login.php");
    exit();
} 

//パスワード不一致 
if ($password != $confirm_password) {
    $_SESSION["error_status"] = 1;

    //POSTで戻る
    echo_html_submit();
    exit();
} 

//エラー情報をリセット
$_SESSION["error_status"] = 0;


//旧パスワードチェック

//DB接続
$db = MDB2::connect(DNS);
if (PEAR::isError($db)) {
    die($db->getMessage());
}

//プレースホルダで SQL 作成
$sql = "SELECT * FROM USERS WHERE ID = ?  AND IS_USER = 1;";

//パラメーターの型を指定
$stmt = $db->prepare($sql, array('text'));

//パラメーターを渡して SQL 実行
$rs = $stmt->execute(array($id));

while ($row = $rs->fetchRow(MDB2_FETCHMODE_ASSOC)) {
    $salt = $row["salt"];
    $mail = $row["mailaddress"];
    $db_password = $row["password"];
}

$db->disconnect();

//旧パスワードのストレッチング
$hash = strechedPassword($salt, $old_password);

//旧パスワードエラー
if ($hash != $db_password) {
    $_SESSION["error_status"] = 1;

    //POST で戻る
    echo_html_submit();
    exit();
}

//パスワード更新

//新パスワード生成
$hash_new = strechedPassword($salt, $password);


//DB接続
$db = MDB2::connect(DNS);
if (PEAR::isError($db)) {
    die($db->getMessage());
}

//プレースホルダで SQL 作成
$sql = "UPDATE USERS SET PASSWORD = ? , RESET = 0, LAST_CHANGE_PASS_TIME = ? WHERE ID = ?";

//パラメーターの型を指定
$stmt = $db->prepare($sql, array('text',"timestamp",'text'));

//パラメーターを渡して SQL 実行
$stmt->execute(array($hash_new, date('Y-m-d H:i:s'), $id));

$db->disconnect();  

//メール送信
$mail = str_replace(array("\r\n","\r","\n"), "", $mail);  //メールヘッダーインジェクション対策
$msg = "パスワードが変更されました。";

mb_send_mail($mail, "パスワードの変更", $msg, " From : " . SENDER_EMAIL);


/*
 * HTML を出力してPOSTリクエストで戻る  
 */
function echo_html_submit() {
    echo "<!DOCTYPE html>";
    echo "<head>";
    echo "<meta charset='utf-8'>";
    echo "</head>";
    echo "<html lang='ja'>";
    echo "<body onload='document.returnForm.submit();'>";
    echo "<form name='returnForm' method='post' action='password_change.php'>";
    echo "<input type='hidden' name='token' value='" .  htmlspecialchars($_SESSION["token"], ENT_QUOTES, "UTF-8") . "''>";
    echo "</form>";
    echo "</body>";
    echo "</html>";
}

?>
<!DOCTYPE html>
<head>
<meta charset="utf-8">
</head>
<html lang="ja">
<body>
<h1>完了画面</h1>
パスワードの変更が完了しました。

<br><br>
<a href="/login.php">ログイン画面に戻る</a>
</body>
</html>
