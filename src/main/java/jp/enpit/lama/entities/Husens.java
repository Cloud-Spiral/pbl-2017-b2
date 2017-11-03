package jp.enpit.lama.entities;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Husens {
    @XmlElement(name="husens")
    private List<Husen> list = new ArrayList<>();

    public Husens(){
    	
    }

    public Husens(List<Husen> husensList){
        list.addAll(husensList);
    }

    public List<Husen> husens(){
        return Collections.unmodifiableList(list);
    }

    public int size(){
        return list.size();
    }

    public Iterator<Husen> iterator(){
        return list.iterator();
    }

    public Husen[] toArray(){
        return list.toArray(new Husen[size()]);
    }
    
    public String toString(){
    	String str="";
    	for(Husen x:list){
    		str = str + x.toString();
    	}
    	return str;
    }
}
