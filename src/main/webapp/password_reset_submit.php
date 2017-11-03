<?php
require_once 'MDB2.php';
require_once("function.php");
session_start();
header("Content-type: text/html; charset=utf-8");

$token = $_POST["token"];

$id = $_POST["id"];
$password = $_POST["password"];
$confirm_password = $_POST["confirm_password"];

//CSRF エラー
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
    $_SESSION["error_status"] = 2;
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: password_reset_url.php");
    exit();
} 


//パスワード更新

//DB接続
$db = MDB2::connect(DNS);
if (PEAR::isError($db)) {
    die($db->getMessage());
}

//プレースホルダで SQL 作成
$sql = "SELECT * FROM USERS WHERE   ID = ?  AND RESET = 1";

//パラメーターの型を指定
$stmt = $db->prepare($sql, array('text'));

//パラメーターを渡して SQL 実行
$id = $_SESSION['id'];
$rs = $stmt->execute(array($id));

$count  = 0;

while ($row = $rs->fetchRow(MDB2_FETCHMODE_ASSOC)) {
    $salt = $row['salt'];
    $mail = $row['mailaddress'];
    $count++;
}

if ($count == 0) {
    //期限切れとか
    $db->disconnect();

    $_SESSION["error_status"] = 2;
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: password_reset.php");
    exit();
}

//新パスワード作成
$hash = strechedPassword($salt, $password);

//プレースホルダで SQL 作成
$sql = "UPDATE USERS SET RESET = 0, IS_USER = 1, PASSWORD = ?, LAST_CHANGE_PASS_TIME = ? WHERE ID = ? ;";

//パラメーターの型を指定
$stmt= $db->prepare($sql, array("text", "timestamp", "text"));

//パラメーターを渡して SQL 実行
$stmt->execute(array($hash, date('Y-m-d H:i:s'), $id));

$db->disconnect();

//メール送信
$mail = str_replace(array("\r\n","\r","\n"), "", $mail);  //メールヘッダーインジェクション対策
$msg = "パスワードがリセットされました。" ;

mb_send_mail($mail, "パスワードのリセット完了", $msg, " From :  " . SENDER_EMAIL);

?>
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
</head>
<body>
<h1>パスワードリセット完了</h1>
パスワードのリセットが終了しました。<br>
ログイン画面からログインしてください。<br><br>

<a href="/login.php">ログイン画面に戻る</a>      
</body>
</html>
