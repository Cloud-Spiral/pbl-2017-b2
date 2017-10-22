package jp.enpit.lama.model;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;
import static com.mongodb.client.model.Sorts.ascending;
import static com.mongodb.client.model.Sorts.descending;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.bson.Document;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;

import jp.enpit.lama.entities.Comment;
import jp.enpit.lama.entities.Comments;

public class CommentModel extends BaseModel{
    private MongoCollection<Document> comments(){
        return super.collection("comments");
    }

    public Comment findById(int id){
        Document document = comments().find(eq("cid", id))
                .limit(1).first();
        return toComment(document);
    }

    public void deleteComment(int id){
        comments().deleteOne(eq("cid", id));
    }

    private MongoCollection<Document> latestCids(){
        return super.collection("latestCids");
    }

    public Comment register(Comment comment){
        comment.setCid(latestId() + 1);
        comments().insertOne(toDocument(comment));
        latestCids().insertOne(new Document("cid", comment.cid()));
        return comment;
    }

    public int latestId(){
        MongoCollection<Document> cids = latestCids();
        if(cids.count() == 0L)
            return 0;
        return cids.find()
                .sort(descending("cid"))
                .first()
                .getInteger("cid", 0);
    }

    public Comments findComments(){
        return new Comments(toList(list()));
    }

    public Comments findWithRange(int start, int length){
        return new Comments(toList(list()
                .skip(start)
                .limit(length)));
    }

    public Comments findWithLength(int length){
        return new Comments(toList(list()
                .limit(length)));
    }

    public Comments findWithStart(int start){
        return new Comments(toList(list()
                .skip(start)));
    }

    public Comments findWithFilter(String filter){
        return new Comments(toList(list(filter)));
    }

    public Comments findWithStartAndFilter(int start, String filter){
        return new Comments(toList(list(filter)
                .skip(start)));
    }

    public Comments findWithLengthAndFilter(int length, String filter){
        return new Comments(toList(list(filter)
                .limit(length)));
    }

    public Comments findWithRangeAndFilter(int start, int length, String filter){
        return new Comments(toList(list(filter)
                .skip(start)
                .limit(length)));
    }

    private List<Comment> toList(FindIterable<Document> iterable){
        List<Comment> list = new ArrayList<>();
        for(Document document: iterable){
            list.add(toComment(document));
        }
        return list;
    }

    private FindIterable<Document> list(){
        return comments().find()
                .sort(ascending("cid"));
    }
    
    private FindIterable<Document> list(String filter){
        return comments().find()
                .filter(regex("body", Pattern.compile(filter)))
                .sort(descending("cid"));
    }

    private Document toDocument(Comment comment){
        return new Document()
                .append("cid", comment.cid())
                .append("date", comment.date())
                .append("body", comment.body());
    }

    private Comment toComment(Document document){
        if(document == null)
            return null;
        return new Comment(document.getInteger("cid", 0),
                document.getString("body"),
                document.getDate("date"));
    }
}
