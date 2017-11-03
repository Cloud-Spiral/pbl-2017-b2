<?php
require_once 'MDB2.php';
require_once("function.php");
session_start();
header("Content-type: text/html; charset=utf-8");

$id = $_POST["id"];
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

//エラー情報リセット  
$_SESSION["error_status"] = 0;


//旧パスワードチェック

//DB接続
$db = MDB2::connect(DNS);
if (PEAR::isError($db)) {
    die($db->getMessage());
}

//プレースホルダで SQL 作成
$sql = "SELECT * FROM USERS WHERE ID = ? ;";

//パラメーターの型を指定
$stmt = $db->prepare($sql, array('text'));

//パラメーターを渡して SQL 実行
$rs = $stmt->execute(array($id));

while ($row = $rs->fetchRow(MDB2_FETCHMODE_ASSOC)) {
    $mail = $row["mailaddress"];
}

//URLパスワードを作成  
$url_pass = get_url_password();

//プレースホルダで SQL 作成
$sql = "UPDATE USERS SET RESET = 1,  TEMP_PASS = ?, TEMP_LIMIT_TIME = ? WHERE ID = ?";

//パラメーターの型を指定
$stmt = $db->prepare($sql, array("text","timestamp",'text'));

//パラメーターを渡して SQL 実行
$stmt->execute(array($url_pass, date('Y-m-d H:i:s'), $id));

$db->disconnect();  

//メール送信
//メールヘッダーインジェクション対策
$mail = str_replace(array("\r\n","\r","\n"), "", $mail);  
$msg = "以下のアドレスからパスワードのリセットを行ってください。" . PHP_EOL;
$msg .=  "アドレスの有効時間は１０分間です。" . PHP_EOL . PHP_EOL;
$msg .= "https://" . SERVER . "/password_reset_url.php?" . $url_pass;

mb_send_mail($mail, "パスワードのリセット", $msg, " From :  " . SENDER_EMAIL);

?>
<!DOCTYPE html>
<head>
<meta charset="utf-8">
</head>
<html lang="ja">
<body>
<h1>メール送信</h1>
パスワードのリセットのメールを送信しました。

<br><br>
<a href="/login.php">ログイン画面に戻る</a>
</body>
</html>
