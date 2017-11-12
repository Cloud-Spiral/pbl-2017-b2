package jp.enpit.lama.model;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;
import static com.mongodb.client.model.Sorts.ascending;
import static com.mongodb.client.model.Sorts.descending;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.bson.Document;

import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;

import jp.enpit.lama.entities.User;
import jp.enpit.lama.entities.Users;

public class UserModel extends BaseModel {
    private MongoCollection<Document> users(){
        return super.collection("Users");
    }
    
    // Userが登録されているか確認する
    /*public boolean containUser(String name) {
    	if(users().find().filter(regex("name", Pattern.compile(name))) != null) return true;
    	return false;
    }*/
    public Users findUsers(String name) {
    	Users users;
    	users = new Users( toList( users().find().filter( regex("name", Pattern.compile(name)) ).sort(descending("id")) ));
    	//if(users != null) {
    		return users;
    	//}
    	//else return null;;
    }
    
    public Users findUsers() {
    	Users users;
    	users = new Users( toList( users().find().sort(descending("id")) ) );
    	return users;
    }
    
    public User findUser(String name) {
    	Users users;
    	users = findUsers(name);
    	
    	if(users.size() == 0) return null;
    	
    	return users.users().get(0);
    }
    
    public boolean isContainUser(String name) {
    	Users users = findUsers(name);
    	if(users.size() > 0) return true;
    	else return false;
    }
    // userを登録する機構
    public User register(User user) {
        //user.setUserName(user.getUserName());
        users().insertOne(toDocument(user));
        return user;
    }
    
    // Documentへの変換
    private Document toDocument(User user){
        return new Document()
            .append("name", user.getName())
            .append("password", user.getPassword())
            .append("status", user.getStatus());
    }
    
    // Userへの変換
    private User toUser(Document document) {
    	if(document == null)
    		return null;
    	return new User(
    			document.getString("name"),
    			document.getString("password")
    			);
    }
    
    // List形式への変換
    private List<User> toList(FindIterable<Document> iterable) {
    	List<User> list = new ArrayList<>();
    	for(Document document: iterable) {
    		list.add(toUser(document));
    	}
    	return list;
    }
}
