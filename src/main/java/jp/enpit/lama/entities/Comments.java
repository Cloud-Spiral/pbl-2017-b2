package jp.enpit.lama.entities;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Comments {
    @XmlElement(name="comments")
    private List<Comment> list = new ArrayList<>();

    public Comments(){
    }

    public Comments(List<Comment> likesList){
        list.addAll(likesList);
    }

    public List<Comment> comments(){
        return Collections.unmodifiableList(list);
    }

    public int size(){
        return list.size();
    }

    public Iterator<Comment> iterator(){
        return list.iterator();
    }

    public Comment[] toArray(){
        return list.toArray(new Comment[size()]);
    }
}
