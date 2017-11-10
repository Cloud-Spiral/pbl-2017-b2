package jp.enpit.lama.model;

import org.bson.Document;

import com.mongodb.client.MongoCollection;

public abstract class BaseModel implements AutoCloseable {

    public BaseModel(){
    }

    protected MongoCollection<Document> collection(String collectionName){
    	return MongoClientPool.getInstance().database().getCollection(collectionName);
    }

    public void close(){
    }
}
