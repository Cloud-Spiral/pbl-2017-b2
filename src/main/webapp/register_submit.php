<?php
require_once 'MDB2.php';
require_once("function.php");
session_start();
header("Content-type: text/html; charset=utf-8");

//CSRF チェック
if ($_SESSION['token'] != $_POST['token']) {
    $_SESSION = array();
    session_destroy();
    session_start();

    $_SESSION["error_status"] = 2;
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: login.php");
    exit();
} 

//エラー情報のリセット
$_SESSION["error_status"] = 0;

$id = $_POST["id"];
$mail = $_POST["mail"];
$password = $_POST["password"];

//ソルト作成
$salt = get_salt();

//一時URLパスワード作成
$url_pass = get_url_password();

//ユーザーの仮登録

//ストレッチングパスワード   
$hash = strechedPassword($salt, $password);

//DB接続
$db = MDB2::connect(DNS);
if (PEAR::isError($db)) {
    die($db->getMessage());
}

//プレースホルダで SQL 作成
$sql = "INSERT INTO USERS (ID,SALT,PASSWORD,MAILADDRESS,TEMP_PASS,LAST_CHANGE_PASS_TIME,RESISTER_TIME) ";
$sql .=  " VALUES (?,?,?,?,?,?,?);";

//パラメーターの型を指定
$stmt = $db->prepare($sql, array('text','text','text','text','text','timestamp','timestamp'));

//パラメーターを渡して SQL 実行
$res  = $stmt->execute(array($id, $salt,$hash,$mail,$url_pass,date('Y-m-d H:i:s'),date('Y-m-d H:i:s')));

//ID重複の可能性があるのでチェック
if (PEAR::isError($res)) {
    $db->disconnect();

    $_SESSION["error_status"] = 4;
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: register.php");
    exit();
}

$db->disconnect();

//ユーザーにメールの送信

//メールヘッダーインジェクション対策
$mail = str_replace(array("\r\n","\r","\n"), "", $mail);  

$url = "https://" . SERVER .  "/register_confirm.php?" . $url_pass;

$msg = "以下のアドレスからアカウトを有効にしてください。" . PHP_EOL;
$msg .= "アドレスの有効時間は１０分間です。" . PHP_EOL;
$msg .= "有効時間後はパスワードのリセットを行ってください。" . PHP_EOL . PHP_EOL;
$msg .= $url;

mb_send_mail($mail, "ユーザー登録", $msg, " From: " . SENDER_EMAIL);

?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body>
<h1>仮登録完了</h1>
仮登録が完了しました。<br>
登録を完了するには、送信されたメールで手続きを行ってください。<br><br>

</body>
</html>
