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

import jp.enpit.lama.entities.Task;
import jp.enpit.lama.entities.Tasks;

public class TaskModel extends BaseModel{
    private MongoCollection<Document> tasks(){
        return super.collection("tasks");
    }

    public Task findById(int id){
        Document document = tasks().find(eq("tid", id))
                .limit(1).first();
        return toTask(document);
    }

    public void deleteTask(int id){
        tasks().deleteOne(eq("tid", id));
    }

    private MongoCollection<Document> latesttids(){
        return super.collection("latesttids");
    }

    public Task register(Task task){
        task.setTid(latestId() + 1);
        tasks().insertOne(toDocument(task));
        latesttids().insertOne(new Document("tid", task.tid()));
        return task;
    }

    public int latestId(){
        MongoCollection<Document> tids = latesttids();
        if(tids.count() == 0L)
            return 0;
        return tids.find()
                .sort(descending("tid"))
                .first()
                .getInteger("tid", 0);
    }

    //priorityでソートしてから、投稿時間でソートする。
    public Tasks findTasks(){
        BasicDBObject sort = new BasicDBObject();
        sort.put("priority", -1);
        sort.put("date", -1);
        return new Tasks(toList(list()
                .sort(sort)
                ));
    }
    
    //statusで検索する。
    public Tasks findStatus(Task task) {
        String status = task.status();
        BasicDBObject sort = new BasicDBObject();
        sort.put("priority", -1);
        sort.put("date", -1);
        Tasks tasks = new Tasks(toList(tasks()
                .find(eq("status", status))
                .sort(sort)
                ));
        return tasks;
    }

    public Tasks findWithRange(int start, int length){
        return new Tasks(toList(list()
                .skip(start)
                .limit(length)));
    }

    public Tasks findWithLength(int length){
        return new Tasks(toList(list()
                .limit(length)));
    }

    public Tasks findWithStart(int start){
        return new Tasks(toList(list()
                .skip(start)));
    }

    public Tasks findWithFilter(String filter){
        return new Tasks(toList(list(filter)));
    }

    public Tasks findWithStartAndFilter(int start, String filter){
        return new Tasks(toList(list(filter)
                .skip(start)));
    }

    public Tasks findWithLengthAndFilter(int length, String filter){
        return new Tasks(toList(list(filter)
                .limit(length)));
    }

    public Tasks findWithRangeAndFilter(int start, int length, String filter){
        return new Tasks(toList(list(filter)
                .skip(start)
                .limit(length)));
    }

    private List<Task> toList(FindIterable<Document> iterable){
        List<Task> list = new ArrayList<>();
        for(Document document: iterable){
            list.add(toTask(document));
        }
        return list;
    }

    private FindIterable<Document> list(){
        return tasks().find()
                .sort(ascending("tid"));
    }

    private FindIterable<Document> list(String filter){
        return tasks().find()
                .filter(regex("body", Pattern.compile(filter)))
                .sort(descending("tid"));
    }

    private Document toDocument(Task task){
        return new Document()
                .append("tid", task.tid())
                .append("date", task.date())
                .append("body", task.body())
                .append("priority", task.priority())
                .append("status", task.status());
    }

    private Task toTask(Document document){
        if(document == null)
            return null;
        return new Task(document.getInteger("tid"),
                document.getString("body"),
                document.getDate("date"),
                document.getInteger("priority"),
                document.getString("status"));
    }

    public void changeTaskStatus(int tid) {
        Task task = findById(tid);        
        String status;
        if(task.status().equals("open")) 
            status = "close";
        else
            status = "open";
        Document updDoc = new Document("status", status);
        tasks().updateOne(eq("tid", tid), new Document("$set", updDoc));
    }

    public void changeTask(int tid, String body, int priority) {
        Document updDoc = new Document()
                .append("body", body)
                .append("priority", priority);
        tasks().updateOne(eq("tid", tid), new Document("$set", updDoc));
    }
}
