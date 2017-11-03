<?php
// mysqlなのでここをmongoDBに書き換える
define("DNS", "mysql://user01:pass@localhost/Test?charset=utf8");
// serverアドレスを書き換える
define("SERVER", "192.168.11.11");
// DBにアクセスするためにメールアドレス
define("SENDER_EMAIL", "root@localhost");
// 無駄な文字を付け加えて強度を高める
define("STRETCH_COUNT", 1000);

/*
 * CSRF トークン作成
 * クロスサイトリクエストフォージェリー
 * webアプに存在する脆弱性を叩く攻撃方法
 * [参考URL]
 * https://www.trendmicro.com/ja_jp/security-intelligence/research-reports/threat-solution/csrf.html
 */
function get_csrf_token() {
    $TOKEN_LENGTH = 16;//16*2=32byte
    $bytes = openssl_random_pseudo_bytes($TOKEN_LENGTH);
    return bin2hex($bytes);
}

/*
 * パスワードをソルト＋ストレッチング
 */
function strechedPassword($salt, $password){
    $hash_pass = "";

    for ($i = 0; $i < STRETCH_COUNT; $i++){
        $hash_pass  = hash("sha256", ($hash_pass . $salt . $password));
    }

    return $hash_pass;    
}

/*
 * ソルトを作成
 * passの強度を高めるためにパスワードに付与する
 */
function get_salt() {
    $TOKEN_LENGTH = 4;//4*2=8byte
    $bytes = openssl_random_pseudo_bytes($TOKEN_LENGTH);
    return bin2hex($bytes);
}

/*
 * URL の一時パスワードを作成
 */
function get_url_password() {
    $TOKEN_LENGTH = 16;//16*2=32byte
    $bytes = openssl_random_pseudo_bytes($TOKEN_LENGTH);
    return hash("sha256", $bytes);
}
?>
