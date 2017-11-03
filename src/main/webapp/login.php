<?php
    require_once("function.php");
    session_start();
    header("Content-type: text/html; charset=utf-8");
?>
<!doctype html>
<html lang="ja">
<body>
    <h1>ログイン</h1>
    <?php
        if ($_SESSION["error_status"] == 1) {
            echo "<h2 style='color:red'>IDまたはパスワードが異なります。</h2>";
        }
        if ($_SESSION["error_status"] == 2) {
            echo "<h2 style='color:red'>不正なリクエストです。</h2>";
        }

        //エラー情報のリセット
        $_SESSION["error_status"] = 0;
    ?>
    <form action="login_check.php" method="post">
    <table border="0">
        <tr>
            <td>ID </td>
            <td><input type="text" name="id"></td>
        </tr>
        <tr>
        <td>
            Password
        </td>
        <td>
            <input type="password" name="password">
        </td>
        </tr>
    </table> 

        <input type="submit" value="ログイン">
        <input type="reset" value="リセット">
    </form>

    <br>
    <a href="/register.php">新規登録</a><br>
    <a href="/password_reset.php"">パスワードリセット</a>

</body>
</html>
