package jp.enpit.lama.entities;

import java.util.Date;

import javax.xml.bind.annotation.XmlElement;

public class User {
    @XmlElement(name="userName")
        private string userName;

    public User(){
        this.userName = "ゲスト";
    }
    public User(string name) {
        setUserName(name);
    }

   public void setUserName(string name) {
        this.userName = name;
   }
}
