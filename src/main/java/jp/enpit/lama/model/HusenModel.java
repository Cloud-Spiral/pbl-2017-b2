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

import jp.enpit.lama.entities.Husen;
import jp.enpit.lama.entities.Husens;
import jp.enpit.lama.entities.Likes;

public class HusenModel extends BaseModel{
	private String collectionName = "husens";
	
	public HusenModel(){
        this("husens");
    }
	
    public HusenModel(String collectionName){
        this.collectionName = collectionName;
    }
    
    private MongoCollection<Document> husens(){
        return super.collection(collectionName);
    }

    public Husen findById(Integer id){
        Document document = husens().find(eq("cid", id))
                .limit(1).first();
        return toHusen(document);
    }

    public void deleteComment(Integer cid){
        husens().deleteOne(eq("cid", cid));
    }

    public Husen register(Husen husen){
        husens().insertOne(toDocument(husen));
        return husen;
    }

    public Husens list(){
        return new Husens(toList());
    }

    private List<Husen> toList(){
    	Iterable<Document> iterable = husens().find();
        List<Husen> list = new ArrayList<>();
        for(Document document: iterable){
            list.add(toHusen(document));
        }
//        List<Husen> list2 = new ArrayList<>();
//        list2.add(new Husen(1,"","","","",1,1,1,1));
//        return list2;
        return list;
    }
    
    private Document toDocument(Husen husen){
        return new Document("cid", husen.getCid())
                .append("text", husen.getText())
                .append("xPosition", husen.getxPosition())
                .append("yPosition", husen.getyPosition())
                .append("height", husen.getHeight())
                .append("good", husen.getGood())
                .append("bad", husen.getBad())
                .append("color", husen.getColor())
                .append("canEdit", husen.getCanEdit());
    }

    private Husen toHusen(Document document){
        if(document == null)
            return null;
        return new Husen(
        		document.getInteger("cid"),
                document.getString("text"),
                document.getString("xPosition"),
                document.getString("yPosition"),
                document.getString("height"),
                document.getInteger("good"),
                document.getInteger("bad"),
                document.getInteger("color"),
                document.getInteger("canEdit"));
    }
}
