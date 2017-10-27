/**
 * DBに接続してUserの管理を行うクラス
 * sugihara
 * 2017/10/27
 **/

// 外部クラスのimport
import com.mongodb.MongoClient;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.DBCursor;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.FinedIterable;
import com.mongodb.client.MongoCursor;
import com.mongodb.BasicDBObject;
import org.json.Document;

// 自作クラスのimport

public class UserManager {
    // DB格納用
    private MongoDatabase db;
    // DBの名前
    private String dbName;
    // host 名 or url
    private String host;
    // port番号
    private int port;

    public void run() {
        initDb("localhost", 27017);
    }

    /**
     * DBにMemberを登録するようのTableを作る
     **/
    public void initDb(String host, int port) {
        // MongoDBを使う準備
        MongoClient client = new MongoClient();

        // hostとport設定
        this.host = host;
        this.port = port;
        MongoClient client = openDb(host, port);
        
        // 複数のサーバを対象としたアクセスの場合
        // private ServerAddress primary = new ServerAddress("hoge", port);
        // private ServerAddress secondary = new ServerAddress("foo", port);
        // private List<ServerAddress> addressArr = new ArrayList<>(Arrays.asList(primary, secondary));
        // MongoClient client = new MongoClient(addressArr);
        
        // DB取得
        // 無いなら勝手に作られる
        dbName = "Team2db";
        db = client.getDatabase(databaseName);
        
        // Collection取得
        // String collectionName = "Users";
        // MongoCollection<Document> coll = mongoDb.getCollection(collectionName);

        // MongoClientの終了
        closeDb(client);
    }
    
    /**
     * Collectionを開く
     **/
    public MongoCollection<Document> openCollection(MongoDatabase db, String collName) {
        MongoCollection<Document> coll = db.getCollection(collName);
        return coll;
    }
    /**
     * DBを開く
     **/
    public MongoClient opneDb(String host, int port) {
        MongoClient client = new MongoClient(host, port);
        return client;
    }
    /**
     * DBを閉じる
     **/
    public void closeDb(MongoClient mongoClient) {
        mongoClient.close();
    }

    /**
     * Userを登録する
     **/
    public void userRegister(DBObject json) {
        MongoClient client = openDb(host, port);
        MongoCollection<Document> coll = openCollection(this.db, "Users");
        
        // JSONからUser情報を取得する
        User user = new User(json.getString("name","macAddress"));
        
        // 指定IPのUserがすでに登録されている時
        if(containMacAddress(coll, user.getMacAddress())) {
            System.out.println("This user registration already\n");
        }
        // 指定MACアドレスのUserが登録されていない時
        else {
            // Insertする内容をここに記述する
            BasicDBObject doc = new BasicDBObject("name", user.getName())
                .append("macAddress", user.getMacAddress);
            // Insertする
            coll.insert(doc);
        }
        
    }

    /**
     * そのMacアドレスのUserが登録されているか確認する
     **/
    public boolean containMacAddress(MongoCollection<Document> coll, String macAddress) {
        boolean exist = false;

        BasicDBObject query = new BasicDBObject("macAddress", macAddress);
        DBCursor cursor = coll.find(query);

        try {
            if(!cursor.hasNext()) {
                exist = false;
            }
            else {
                exist = true;
            }
        }
        finally {
            cursor.close();
        }

        return exist;
    }

    /**
     * Macアドレスから名前を検索
     **/
    public String whoAreYou(MongoCollection<Document> coll, String macAddress) {
        String name;

        BasicDBObject query = new BasicDBObject("macAddress", macAddress);
        DBCursor cursor = coll.find("macAddress", macAddress);

        try {
            if(cursor.hasNext()) {
                name = cursor.getString("name");
            }
            else {
                system.out.println("ありえない...");
                name = "NotFound";
            }
        } finally {
            cursor.close();
        }

        return name;
    }

    /**
     * JSONにして投げる
     **/


    // 名前からipアドレスを検索...必要？
    /*public Member whatIp(String name) throws SQLException{
        conn = DriverManager.getConnection(uri);
        st = conn.createStatement();

        // 処理を記述する

        st.close();
        conn.close();
    }*/
}
