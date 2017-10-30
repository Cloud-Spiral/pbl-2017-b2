package jp.enpit.lama.entities;

import java.util.*;
import javax.xml.bind.annotation.XmlElement;

public class Like {
	@XmlElement(name="date")
	private Date date;
	
	public Like(){
		this(new Date());
	}
	public Like(Date date){
		this.date = date;
	}
	public Date date(){
		return date;
	}
}
