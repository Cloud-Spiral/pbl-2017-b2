package jp.enpit.lama.entities;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Likes {
    @XmlElement(name="likes")
    private List<Like> list = new ArrayList<>();

    public Likes(){
    }

    public Likes(List<Like> likesList){
        list.addAll(likesList);
    }

    public List<Like> likes(){
        return Collections.unmodifiableList(list);
    }

    public int size(){
        return list.size();
    }

    public Iterator<Like> iterator(){
        return list.iterator();
    }

    public Like[] toArray(){
        return list.toArray(new Like[size()]);
    }
}
