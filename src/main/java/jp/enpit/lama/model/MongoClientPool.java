package jp.enpit.lama.model;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class MongoClientPool {
	/** 唯一のインスタンス． */
	private static final MongoClientPool INSTANCE = new MongoClientPool();

	private MongoClient client;
	private MongoDatabase database;

	/** 唯一のインスタンスを返す． */
	public static MongoClientPool getInstance() {
		return INSTANCE;
	}

	/**
	 * 接続先を構築する．
	 */
	private MongoClientPool() {
		String host = Properties.instance().property(Properties.Key.HOST_NAME);
		int port = Integer.parseInt(Properties.instance().property(Properties.Key.PORT_NUMBER));
		String dbname = Properties.instance().property(Properties.Key.DATEBASE_NAME);
		
		this.client = new MongoClient(host, port);
		this.database = this.client.getDatabase(dbname);
	}

	/** 指定された名前のコレクションを返す． */
	public MongoCollection<Document> collection(String name) {
		return database.getCollection(name);
	}
	
	public MongoDatabase database() {
		return database;
	}
	
}
