package jp.enpit.lama.entities;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;

public class Winners {
    @XmlElement(name="winners")
    private List<Winner> list = new ArrayList<>();

    public Winners(){
    }
    public Winners(List<Winner> winnerList) {
        list.addAll(winnerList);
    }

    public List<Winner> winners(){
        return Collections.unmodifiableList(list);
    }

    public int size(){
        return list.size();
    }

    public Iterator<Winner> iterator(){
        return list.iterator();
    }

    public Winner[] toArray(){
        return list.toArray(new Winner[size()]);
    }
}
