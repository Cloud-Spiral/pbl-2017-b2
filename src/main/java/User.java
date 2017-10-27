/**
 * 登録者の情報を格納するクラス
 * sugihara
 * 2017/10/27
 **/

public class User {
    public String name;
    public String macAddress;

    public User(String name, String macAddress) {
        setName(name);
        setMacAddress(macAddress);
    }
    
    // name のsetter
    public void setName(String name) {
        this.name = name;
    }
    // name のgetter
    public String getName() {
        return this.name;
    }
    // ip のsetter
    public void setMacAddress(String macAddress) {
        this.macAddress = macAddress;
    }
    // ip のgetter
    public String getMacAddress() {
        return this.macAddress;
    }
}
