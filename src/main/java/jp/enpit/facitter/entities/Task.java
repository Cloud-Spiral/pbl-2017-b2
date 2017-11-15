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
    @XmlElement(name="notice")
    private boolean notice = false; //タスクに通知をつけるかどうか
    
    private final long NOTICE_TIME = 1; //通知する時間

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
    
    public Task(int tid, String body, Date date, int priority, String status, boolean notice){
        this(tid, body, date);
        this.priority = priority;
        this.status = status;
        this.notice = notice;
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
    
    public boolean notice() {
        return this.notice;
    }
    
    public void setNotice(boolean notice) {
        this.notice = notice;
    }
    
    public boolean checkTime() {
        long currentTime = new Date().getTime();
        long taskTime = date.getTime();
        long diff = ( currentTime - taskTime ) / (1000 * 60 );
        if(diff >= NOTICE_TIME)
            notice = true;
        return notice;
    }
}
