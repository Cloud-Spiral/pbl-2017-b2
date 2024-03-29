package jp.enpit.facitter.model;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Sorts.ascending;
import static com.mongodb.client.model.Sorts.descending;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.FormParam;

import org.bson.Document;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;

import jp.enpit.facitter.entities.Husen;
import jp.enpit.facitter.entities.Husens;

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

    public void orderPosition(int number,String left,String top,String width,String height){
    	int leftInt = Integer.parseInt(left.substring(0,left.indexOf("px")));
    	int topInt = Integer.parseInt(top.substring(0,top.indexOf("px")));
    	int widthInt = Integer.parseInt(width.substring(0,width.indexOf("px")));
    	int heightInt = Integer.parseInt(height.substring(0,height.indexOf("px")));
    	int count = 0;
    	for(Husen x :toList(list())){
    		String nextLeft = String.valueOf(leftInt+count%number*widthInt)+"px";
    		String nextTop = String.valueOf(topInt+count/number*heightInt)+"px";
//    		System.out.println(count +" " +x.getxPosition()+" "+x.getyPosition()+" to "
//    				+" "+nextLeft+" "+nextTop+"\n");
    		count++;
    	    husens().updateOne(eq("hid", x.getHid()),new Document("$set",new Document("xPosition",nextLeft)));
    	    husens().updateOne(eq("hid", x.getHid()),new Document("$set",new Document("yPosition",nextTop)));

    	}
    }
    
    public Husen findById(Integer id){
        Document document = husens().find(eq("hid", id))
                .limit(1).first();
        return toHusen(document);
    }

    public void deleteComment(Integer hid){
    	//System.out.println("delete "+hid);
        husens().deleteOne(eq("hid", hid));
    }

    public Husen register(Husen husen){
        husen.setHid(latestId() + 1);
        husens().insertOne(toDocument(husen));
        latesthids().insertOne(new Document("hid", husen.getHid()));
       // System.out.println("insert "+husen.getHid());
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
    
    public void updateText(int hid,String text){
    	husens().updateOne(eq("hid", hid),new Document("$set",new Document("text",text)));
    	//System.out.println("updateText "+hid);
    }
    
    public void updatePosition(int hid,String xPosition,String yPosition){
    	husens().updateOne(eq("hid", hid),new Document("$set",new Document("xPosition",xPosition)));
    	husens().updateOne(eq("hid", hid),new Document("$set",new Document("yPosition",yPosition)));
    	//System.out.println("updatePosition "+hid);
    }
    
    public void updateColor(int hid,int color){
    	husens().updateOne(eq("hid", hid),new Document("$set",new Document("color",color)));
    	//System.out.println("updatecolor "+hid);
    }
    
    public int updateGood(int hid){
    	husens().updateOne(eq("hid", hid),new Document("$inc",new Document("good",1)));
    	//System.out.println("updatecolor "+hid);
    	for(Husen x: findHusens().husens()){
    		if(x.getHid() == hid){
    			return x.getGood();
    		}
    	}
    	return 0;
    }
    
    public int updateBad(int hid){
    	husens().updateOne(eq("hid", hid),new Document("$inc",new Document("bad",1)));
    	//System.out.println("updatecolor "+hid);
    	for(Husen x: findHusens().husens()){
    		if(x.getHid() == hid){
    			return x.getBad();
    		}
    	}
    	return 0;
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
    
    public void changeStatus(@FormParam("hid") Integer hid,
    		@FormParam("text") String text,
    		@FormParam("xPosition") String xPosition,
    		@FormParam("yPosition") String yPosition,
    		@FormParam("height") String height,
    		@FormParam("good") int good,
    		@FormParam("bad") int bad,
    		@FormParam("color") int color,
    		@FormParam("canEditPerson") int canEdit){
    	
    }
}
