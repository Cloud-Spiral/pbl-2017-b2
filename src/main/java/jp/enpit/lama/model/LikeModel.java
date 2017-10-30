package jp.enpit.lama.model;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoIterable;
import com.mongodb.client.model.Sorts;


import jp.enpit.alpaca.entities.Like;
import jp.enpit.alpaca.entities.Likes;

public class LikeModel implements AutoCloseable{
	private MongoClient client;
	private MongoDatabase database;
	private MongoCollection<Document> collection;
	
	public LikeModel(){
		client = new MongoClient("localhost",27017);
		database = client.getDatabase("alpaca");
		collection = database.getCollection("likes");
	}
	
	/*
	 * データベースとして保存されているLikeのリストをLikesとして返すメソッド
	 */
	public Likes list(){
		FindIterable<Document> iterable = collection.find()
				.sort(Sorts.ascending("date"));
		List<Like> likes = new ArrayList<>();
		for(Document doc: iterable){
			likes.add(toLike(doc));
		}
		return new Likes(likes);
	}
	
	/*
	 * DocumentからLikeに変換するメソッド
	 */
	public Like toLike(Document doc){
		return new Like(doc.getDate("date"));
	}
	
	/*
	 * Likeを受けとり、データベースに保存するメソッド
	 */
	public void register(Like like){
		collection.insertOne(new Document("date",like.date()));	
	}
		
	//その他の処理
	public void close(){
		client.close();
	}

}
