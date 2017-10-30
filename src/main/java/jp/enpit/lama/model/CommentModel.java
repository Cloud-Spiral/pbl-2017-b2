package jp.enpit.lama.model;




import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;

import jp.enpit.alpaca.entities.Comment;


public class CommentModel implements AutoCloseable{
	private MongoClient client;
	private MongoDatabase database;
	private MongoCollection<Document> collection;
	
	private MongoCollection<Document> cids;
	private MongoCollection<Document> comments;
	
	public CommentModel(){
		client = new MongoClient("localhost",27017);
		database = client.getDatabase("alpaca");
		collection = database.getCollection("comments");
		
		cids = database.getCollection("cids");
		comments = database.getCollection("comments");
	}
	
	//idをもとに対応するCommentオブジェクトを取得するメソッド
	public Comment findById(int id){
		Document document = collection.find(Filters.eq("cid",id)).first();
		return toComment(document);
	}
	
	//DocumentからCommentに変換するメソッド
	public Comment toComment(Document doc) {
		Comment com = new Comment();
		com.setCid(doc.getInteger("cid", 0));
		com.setDate(doc.getDate("date"));
		com.setBody(doc.getString("body"));
		return com;
	}

	public int newId(){
		if(cids.count() == 0L) return 0;
		
		return cids.find().sort(Sorts.descending("cid")).first().getInteger("cid", 0);
	}
	
	public Comment register(Comment comment){
		comment.setCid(newId() + 1);
		comments.insertOne(toDocument(comment));
		Document idDoc = new Document("cid",comment.cid());
		cids.insertOne(idDoc);
		return comment;
	}
	
	//その他の処理
	public void close(){
		client.close();
	}
}
