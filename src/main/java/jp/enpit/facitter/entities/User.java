package jp.enpit.facitter.entities;

import javax.xml.bind.annotation.XmlElement;

public class User {
    @XmlElement(name="name")
    private String name;
    @XmlElement(name="password")
    private String password;

    public User(){
        setName("ゲスト");
        setPassword("password");
    }
    public User(String name) {
        setName(name);
        setPassword("password");
    }
    public User(String name, String password) {
    	setName(name);
    	setPassword(password);
    }

   public void setName(String name) {
        this.name = name;
   }
   public String getName() {
	   return this.name;
   }
   public void setPassword(String password) {
	   this.password = password;
   }
   public String getPassword() {
	   return this.password;
   }
}
