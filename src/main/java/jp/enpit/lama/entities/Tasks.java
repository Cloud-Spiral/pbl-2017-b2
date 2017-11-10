package jp.enpit.lama.entities;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Tasks {
    @XmlElement(name="tasks")
    private List<Task> list = new ArrayList<>();
    
    public Tasks(){
    }

    public Tasks(List<Task> tasksList){
        list.addAll(tasksList);
    }

    public List<Task> tasks(){
        return Collections.unmodifiableList(list);
    }

    public int size(){
        return list.size();
    }

    public Iterator<Task> iterator(){
        return list.iterator();
    }

    public Task[] toArray(){
        return list.toArray(new Task[size()]);
    }
    
}
