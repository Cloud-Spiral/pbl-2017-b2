package jp.enpit.lama.model;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Sorts.ascending;
import static com.mongodb.client.model.Sorts.descending;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;

import jp.enpit.lama.entities.Husen;
import jp.enpit.lama.entities.Husens;

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
    
    private MongoCollection<Document> latesthids(){
        return super.collection("latesthids");
    }
    
    public int latestId(){
        MongoCollection<Document> hids = latesthids();
        if(hids.count() == 0L)
            return 0;
        return hids.find()
                .sort(descending("hid"))
                .first()
                .getInteger("hid", 0);
    }

    public Husen findById(Integer id){
        Document document = husens().find(eq("hid", id))
                .limit(1).first();
        return toHusen(document);
    }

    public void deleteComment(Integer hid){
        husens().deleteOne(eq("hid", hid));
    }

    public Husen register(Husen husen){
        husen.setHid(latestId() + 1);
        husens().insertOne(toDocument(husen));
        latesthids().insertOne(new Document("hid", husen.getHid()));
        return husen;
    }
    
    public Husens findHusens(){
        return new Husens(toList(list()));
    }
    
    public FindIterable<Document> list(){
        return husens().find()
                .sort(ascending("hid"));
    }
    
    private List<Husen> toList(FindIterable<Document> iterable){
        List<Husen> list = new ArrayList<>();
        for(Document document: iterable){
            list.add(toHusen(document));
        }
        return list;
    }
    
    private Document toDocument(Husen husen){
        return new Document("hid", husen.getHid())
                .append("text", husen.getText())
                .append("xPosition", husen.getxPosition())
                .append("yPosition", husen.getyPosition())
                .append("height", husen.getHeight())
                .append("good", husen.getGood())
                .append("bad", husen.getBad())
                .append("color", husen.getColor())
                .append("canEditPerson", husen.getCanEditPerson());
    }

    private Husen toHusen(Document document){
        if(document == null)
            return null;
        return new Husen(
        		document.getInteger("hid"),
                document.getString("text"),
                document.getString("xPosition"),
                document.getString("yPosition"),
                document.getString("height"),
                document.getInteger("good"),
                document.getInteger("bad"),
                document.getInteger("color"),
                document.getInteger("canEditPerson"));
    }
}
