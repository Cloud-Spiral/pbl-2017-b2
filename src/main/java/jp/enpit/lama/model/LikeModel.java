package jp.enpit.lama.model;

import static com.mongodb.client.model.Sorts.ascending;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.bson.Document;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;

import jp.enpit.lama.entities.Like;
import jp.enpit.lama.entities.Likes;

public class LikeModel extends BaseModel{
    private static final String LIKE_KEY = "date";

    private String collectionName;

    public LikeModel(){
        this("likes");
    }

    public LikeModel(String collectionName){
        this.collectionName = collectionName;
    }

    private MongoCollection<Document> collection(){
        return super.collection(collectionName);
    }

    public Like register(Like like){
        collection().insertOne(toDocument(like));
        return like;
    }

    public Likes list(){
        FindIterable<Document> iterable = collection().find()
                .sort(ascending(LIKE_KEY));
        return new Likes(toList(iterable));
    }

    private List<Like> toList(Iterable<Document> iterable){
        List<Like> list = new ArrayList<>();
        for(Document document: iterable)
            list.add(toLike(document));
        return list;
    }

    private Document toDocument(Like like){
        return new Document(LIKE_KEY, like.date());
    }

    private Like toLike(Document document){
        Date date = document.getDate(LIKE_KEY);
        return new Like(date);
    }
}
