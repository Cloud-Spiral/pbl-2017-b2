package jp.enpit.facitter.entities;

import java.util.Date;

import javax.xml.bind.annotation.XmlElement;

public class Task {
    @XmlElement(name="tid")
    private int tid;
    @XmlElement(name="date")
    private Date date;
    @XmlElement(name="body")
    private String body;
    @XmlElement(name="priority")
    private int priority;
    @XmlElement(name="status")
    private String status;

    public Task(){
        date = new Date();
    }

    public Task(String body){
        this();
        setBody(body);
    }

    public Task(int tid, String body){
        this(body);
        setTid(tid);
    }
    
    public Task(int tid, String body, Date date){
        this(tid, body);
        this.date = date;    
    }
    
    public Task(int tid, String body, Date date, int priority, String status){
        this(tid, body, date);
        this.priority = priority;
        this.status = status;
    }
    
    public Task(String body,  int priority){
        this(body);
        this.priority = priority;
    }
    public Task(String body,  int priority, String status){
        this(body);
        this.priority = priority;
        this.status = status;
    }

    public void setTid(int tid){
        this.tid = tid;
    }

    public int tid(){
        return tid;
    }
    
    public void setBody(String body){
        if(body == null)
            throw new NullPointerException();
        this.body = body;
    }
    
    public Date date(){
        return date;
    }
    
    public String body(){
        return body;
    }
    
    public void setPriority(int priority){
        this.priority = priority;
    }
    
    public int priority(){
        return priority;
    }
    
    public String status(){
        return status;
    }
    
    public void setStatus(String status){
        this.status = status;
    }

}
