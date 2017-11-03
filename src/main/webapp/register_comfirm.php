<?php
require_once 'MDB2.php';
require_once("function.php");
session_start();
header("Content-type: text/html; charset=utf-8");

//URLからパラメータ取得
$url_pass = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);

//ユーザー正式登録

//DB接続
$db = MDB2::connect(DNS);
if (PEAR::isError($db)) {
    die($db->getMessage());
}

//プレースホルダで SQL 作成
$sql = "SELECT * FROM USERS WHERE   TEMP_PASS = ? AND RESISTER_TIME >= ?";

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

if ($count == 0) {
    //URLが不正か期限切れ
    $_SESSION["error_status"] = 3;
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: register.php");

    $db->disconnect();
    exit();
}

$sql = "UPDATE USERS SET IS_USER = 1 WHERE ID = ? ;";

//パラメーターの型を指定
$stmt= $db->prepare($sql, array('text'));

//パラメーターを渡して SQL 実行
$stmt->execute(array($id));

$db->disconnect();


?>
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
</head>
<body>
<h1>登録完了</h1>
ユーザーの登録が終了しました。<br>
ログイン画面からログインしてください。<br><br>

<a href="/login.php">ログイン画面に戻る</a>     
</body>
</html>
