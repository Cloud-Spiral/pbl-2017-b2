<?php
require_once("function.php");
session_start();
header("Content-type: text/html; charset=utf-8");

//強制ブラウズはリダイレクト
if (!isset($_SESSION['id'])){
    $_SESSION["error_status"] = 2;
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: login.php");
    exit();
} 

//エラー情報リセット  
$_SESSION["error_status"] = 0;
?>

<html>
<body>
<h1>ようこそ</h1>
<form action="password_change.php" method="post">
<input type="hidden" name="token" value="<?php echo htmlspecialchars($_SESSION['token']  , ENT_QUOTES, "UTF-8") ?>">
<input type="submit" name="password_change" value="パスワード変更">
</form>
<form action="logout.php" method="post">
<input type="submit" name="logout" value="ログアウト">
</form>
</body>
</html>
