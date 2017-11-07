package jp.enpit.lama.entities;

import javax.xml.bind.annotation.XmlElement;

public class User {
    @XmlElement(name="name")
        private String name;

    public User(){
        setName("ゲスト");
    }
    public User(String name) {
        setName(name);
    }

   public void setName(String name) {
        this.name = name;
   }
   public String getName() {
	   return this.name;
   }
}
