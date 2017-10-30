package jp.enpit.lama.entities;

import java.util.*;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement
public class Likes {
	@XmlElement(name="likes")
	private List<Like> list = new ArrayList<>();
	
	public Likes(){
	}
	public Likes(List<Like> otherList){
		list.addAll(otherList);
	}
	public Like[] getLikes(){
		return list.toArray(new Like[list.size()]);
	}
}
