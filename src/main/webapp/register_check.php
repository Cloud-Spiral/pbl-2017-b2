<?php
require_once 'MDB2.php';
require_once("function.php");
session_start();
header("Content-type: text/html; charset=utf-8");  

$_SESSION['token']  = get_csrf_token();

$id = $_POST["id"];
$mail = $_POST['mail'];
$password = $_POST["password"];
$confirm_password = $_POST["confirm_password"];


if ($password != $confirm_password) {
    //パスワード不一致 
    $_SESSION["error_status"] = 1;
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: register.php");
    exit();
}  

//IDチェック

//DB接続
/*$db = MDB2::connect(DNS);
if (PEAR::isError($db)) {
    die($db->getMessage());
}

//プレースホルダで SQL 作成
$sql = "SELECT COUNT(*) AS CNT FROM USERS WHERE ID = ? ;";

//パラメーターの型を指定
$stmt = $db->prepare($sql, array('text'));

//パラメーターを渡して SQL 実行
$rs = $stmt->execute(array($id));*/

$client = new MongoClient();
$db = $client->selectDB('Team2db');
$col = $db->selectCollection('Users');
$cursor = $col->find();
$count = $cursor->array("ID" => ?).count();
// $sum = $col->aggregate(array("ID" => ?);

/*while ($row = $rs->fetchRow(MDB2_FETCHMODE_ASSOC)) {
    $count = $row['cnt'];
}*/

$db.logout();

//既にIDが登録されていた
if ($count != 0) {
    $_SESSION["error_status"] = 2;
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: register.php");
    exit();
} 

//エラー情報リセット
$_SESSION["error_status"] = 0;

?>
<!DOCTYPE html>
<head>
<meta charset="utf-8">
</head>
<html lang="ja">
<body>
<h1>確認画面</h1>
<h2>登録しますか？</h2>
<form action="register_submit.php" method="post">
<table border="0">
<tr>
<td>ID</td>
<td><?php echo htmlspecialchars($id, ENT_QUOTES, "UTF-8") ?></td>
</tr>
<tr>
<td>メールアドレス</td>
<td><?php echo htmlspecialchars($mail, ENT_QUOTES, "UTF-8") ?></td>
</tr>
</table>
<input type="hidden" name="id" value="<?php echo htmlspecialchars($id  , ENT_QUOTES, "UTF-8") ?>">
<input type="hidden" name="mail" value="<?php echo htmlspecialchars($mail  , ENT_QUOTES, "UTF-8") ?>">
<input type="hidden" name="password" value="<?php echo htmlspecialchars($password  , ENT_QUOTES, "UTF-8") ?>">
<input type="hidden" name="token" value="<?php echo htmlspecialchars($_SESSION['token']  , ENT_QUOTES, "UTF-8") ?>">
<input type="submit" value="登録">
<input type="button" value="戻る" onclick="history.back();">
</form>
</body>
</html>
