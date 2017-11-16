package jp.enpit.facitter.entities;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Lines {
    @XmlElement(name="lines")
    private List<Line> list = new ArrayList<>();

    public Lines(){
    	
    }

    public Lines(List<Line> linesList){
        list.addAll(linesList);
    }

    public List<Line> lines(){
        return Collections.unmodifiableList(list);
    }

    public int size(){
        return list.size();
    }

    public Iterator<Line> iterator(){
        return list.iterator();
    }

    public Line[] toArray(){
        return list.toArray(new Line[size()]);
    }
}
