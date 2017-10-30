package jp.enpit.lama.model;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class MongoClientPool {

	private static final MongoClientPool INSTANCE = new MongoClientPool();
	
	private MongoClient client;
	private MongoDatabase database;
	
	public static MongoClientPool getInstance(){
		return INSTANCE;
	}
	
	private MongoClientPool(){
		this.client = new MongoClient("localhost", 27017);
		this.database = this.client.getDatabase("alpaca");
	}
	
	public MongoCollection<Document> collection(String name){
		return database.getCollection(name);
	}
}
