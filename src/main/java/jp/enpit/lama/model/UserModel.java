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

    // userを登録する機構
    public User register(User user) {
        //user.setUserName(user.getUserName());
        users().insertOne(toDocument(user));
        return user;
    }
    
    // Documentへの変換
    private Document toDocument(User user){
        return new Document()
            .append("name", user.getName());
    }
}
