<?php
session_start();
header("Content-type: text/html; charset=utf-8");

//セッション破棄
$_SESSION = array();
session_destroy();

//リダイレクト
header("HTTP/1.1 301 Moved Permanently");
header("Location: login.php");
?>
