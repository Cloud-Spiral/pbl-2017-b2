package jp.enpit.lama.entities;

import java.util.Date;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Comment {
    @XmlElement(name="cid")
    private int cid;
    @XmlElement(name="location")
    private String location;
    @XmlElement(name="date")
    private Date date;
    @XmlElement(name="body")
    private String body;

    public Comment(){
        date = new Date();
    }

    public Comment(String body){
        this();
        setBody(body);
    }

    public Comment(int cid, String body){
        this(body);
        setCid(cid);
    }

    public Comment(int cid, String body, Date date){
        this(cid, body);
        this.date = date;
    }

    public void setCid(int cid){
        this.cid = cid;
        updateLocation();
    }

    public int cid(){
        return cid;
    }

    public String location(){
        if(location == null &&  cid != 0){
            updateLocation();
        }
        return location;
    }

    public Date date(){
        return date;
    }

    public void setBody(String body){
        if(body == null)
            throw new NullPointerException();
        this.body = body;
    }

    public String body(){
        return body;
    }

    private void updateLocation(){
        this.location = "/comments/" + cid;
    }
}
