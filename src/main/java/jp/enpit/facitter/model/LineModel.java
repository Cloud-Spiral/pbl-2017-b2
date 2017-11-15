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

import jp.enpit.facitter.entities.Line;
import jp.enpit.facitter.entities.Lines;

public class LineModel extends BaseModel{
	private String collectionName = "lines";
	
	public LineModel(){
        this("lines");
    }
	
    public LineModel(String collectionName){
        this.collectionName = collectionName;
    }
    
    private MongoCollection<Document> lines(){
        return super.collection(collectionName);
    }
    
    private MongoCollection<Document> latestlids(){
        return super.collection("latestlids");
    }
    
    public int latestId(){
        MongoCollection<Document> lids = latestlids();
        if(lids.count() == 0L)
            return 0;
        return lids.find()
                .sort(descending("lid"))
                .first()
                .getInteger("lid", 0);
    }

    public void orderPosition(int number,String left,String top,String width,String height){
    	int leftInt = Integer.parseInt(left.substring(0,left.indexOf("px")));
    	int topInt = Integer.parseInt(top.substring(0,top.indexOf("px")));
    	int widthInt = Integer.parseInt(width.substring(0,width.indexOf("px")));
    	int heightInt = Integer.parseInt(height.substring(0,height.indexOf("px")));
    	int count = 0;
    	for(Line x :toList(list())){
    		String nextLeft = String.valueOf(leftInt+count%number*widthInt)+"px";
    		String nextTop = String.valueOf(topInt+count/number*heightInt)+"px";
//    		System.out.println(count +" " +x.getxPosition()+" "+x.getyPosition()+" to "
//    				+" "+nextLeft+" "+nextTop+"\n");
    		count++;
    	    lines().updateOne(eq("lid", x.getLid()),new Document("$set",new Document("xPosition",nextLeft)));
    	    lines().updateOne(eq("lid", x.getLid()),new Document("$set",new Document("yPosition",nextTop)));

    	}
    }
    
    public Line findById(Integer id){
        Document document = lines().find(eq("lid", id))
                .limit(1).first();
        return toLine(document);
    }

    public void deleteComment(Integer lid){
    	//System.out.println("delete "+lid);
        lines().deleteOne(eq("lid", lid));
    }

    public Line register(Line line){
        line.setLid(latestId() + 1);
        lines().insertOne(toDocument(line));
        latestlids().insertOne(new Document("lid", line.getLid()));
       // System.out.println("insert "+line.getlid());
        return line;
    }
    
    public Lines findLines(){
        return new Lines(toList(list()));
    }
    
    public FindIterable<Document> list(){
        return lines().find()
              .sort(ascending("lid"));
    }
    
    private List<Line> toList(FindIterable<Document> iterable){
        List<Line> list = new ArrayList<>();
        for(Document document: iterable){
            list.add(toLine(document));
        }
        return list;
    }
    
    public void updateLine(int lid,String line){
    	lines().updateOne(eq("lid", lid),new Document("$set",new Document("line",line)));
    	//System.out.println("updateText "+lid);
    }    
    
    private Document toDocument(Line line){
        return new Document("lid", line.getLid())
                .append("line", line.getLine());
    }

    private Line toLine(Document document){
        if(document == null)
            return null;
        return new Line(
        		document.getInteger("lid"),
                document.getString("line"));
    }
    }
