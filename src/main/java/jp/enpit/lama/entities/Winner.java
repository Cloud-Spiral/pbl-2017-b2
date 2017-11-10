package jp.enpit.lama.entities;

import javax.xml.bind.annotation.XmlElement;

public class Winner {
	
    @XmlElement(name="name")
    private String name;

    public Winner(){
	    setName("ゲスト");
	}
	public Winner(String name) {
	    setName(name);
	}	
	public void setName(String name) {
	    this.name = name;
	}
	public String getName() {
	   return this.name;
	}
}
