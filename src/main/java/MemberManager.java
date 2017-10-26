/**
 * DBに接続してMemberの管理を行うクラス
 * 参考URL1:https://qiita.com/fugahogeds/items/7dc1a56e950b31e8779e
 * 
 * sugihara
 * 2017/10/27
 **/

// 外部クラスのimport
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.ResultSet;

// 自作クラスのimport

public class MemberManager {
    private String uri;
    private Connection conn;
    private Statement st;

    // DBにMemberを登録するようのTableを作る
    public void initDb() throws SQLException {
        // (1) 接続用のURIを用意する(必要に応じて認証指示user/passwordを付ける)
        uri = "jdbc:derby:memory:sample;create=true";
        // String id = "user01";
        // String pw = "password";

        // (2) DriverManagerクラスのメソッドで接続する
        conn = DriverManager.getConnection(uri);
        // conn = DriverManager.getConnection(uri,id,pw);

        // (3) SQL送信用インスタンスの作成
        st = conn.createStatement();

        // (4) SQL送信
        st.executeUpdate("create table member(id integer primary key, NAME TEXT, IP TEXT)");

        st.close();
        conn.close();
    }

    // Memberを登録する
    public void memberRegistration(Member member) throws SQLException{
        conn = DriverManager.getConnection(uri);
        st = conn.createStatement();
        
        // SQL文（member tableに名前とipアドレスを格納する)
        st.executeUpdate("insert into member values(" + member.getName() + "," + member.getIp() + ")");

        // インスタンスの正常クローズ
        st.close();
        conn.close();
    }

    // そのipのmemberが登録されているか確認する
    public boolean containIp(String ip) throws SQLException{
        conn = DriverManager.getConnection(uri);
        st = conn.createStatement();

        // dbからの返答を記憶する変数
        ResultSet result;

        result = st.executeQuery("select NAME from member where IP == " + ip);

        if(!result.next()) {
            st.close();
            conn.close();
            return false;
        }

        st.close();
        conn.close();

        return true;
    }

    // ipアドレスから名前を検索
    public Member whoAreYou(String ip) throws SQLException{
        conn = DriverManager.getConnection(uri);
        st = conn.createStatement();
        Member who=new Member("who","where");
        who.setIp(ip);

        // dbからの返答を記憶する変数
        ResultSet result;

        // select実行
        result = st.executeQuery("select NAME from member where IP == " + ip);
        
        // selectの結果を格納
        while(result.next()) {
            who.setName(result.getString("NAME"));
        }

        // インスタンスの正常クローズ
        st.close();
        conn.close();

        return who;
    }

    // 名前からipアドレスを検索...必要？
    /*public Member whatIp(String name) throws SQLException{
        conn = DriverManager.getConnection(uri);
        st = conn.createStatement();

        // 処理を記述する

        st.close();
        conn.close();
    }*/
}
