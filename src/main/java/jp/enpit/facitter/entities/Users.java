package jp.enpit.facitter.entities;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Users {
    @XmlElement(name="users")
    private List<User> list = new ArrayList<>();

    public Users(){
    }
    public Users(List<User> userList) {
        list.addAll(userList);
    }

    public List<User> users(){
        return Collections.unmodifiableList(list);
    }

    public int size(){
        return list.size();
    }

    public Iterator<User> iterator(){
        return list.iterator();
    }

    public User[] toArray(){
        return list.toArray(new User[size()]);
    }

}
