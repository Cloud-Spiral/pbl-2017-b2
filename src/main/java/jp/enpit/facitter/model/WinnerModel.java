package jp.enpit.facitter.model;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;
import static com.mongodb.client.model.Sorts.descending;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.bson.Document;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;

import jp.enpit.facitter.entities.Winner;
import jp.enpit.facitter.entities.Winners;

public class WinnerModel extends BaseModel{
	  private MongoCollection<Document> winners(){
	        return super.collection("winners");
	    }
	    public Winners findWinners() {
	    	Winners winners;
	    	winners = new Winners( toList( winners().find().sort(descending("id")) ) );
	    	return winners;
	    }
	    	    
	    // winnerを登録する機構
	    public Winner register(Winner winner) {
	        winners().insertOne(toDocument(winner));
	        return winner;
	    }
	    
	    // Documentへの変換
	    private Document toDocument(Winner winner){
	        return new Document()
	            .append("name", winner.getName());
	    }
	    
	    // Winnerへの変換
	    private Winner toWinner(Document document) {
	    	if(document == null)
	    		return null;
	    	return new Winner(
	    			document.getString("name")
	    			);
	    }
	    
	    // List形式への変換
	    private List<Winner> toList(FindIterable<Document> iterable) {
	    	List<Winner> list = new ArrayList<>();
	    	for(Document document: iterable) {
	    		list.add(toWinner(document));
	    	}
	    	return list;
	    }
}
