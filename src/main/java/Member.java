/**
 * 登録者の情報を格納するクラス
 * sugihara
 * 2017/10/27
 **/

public class Member {
    public String name;
    public String ip;

    public Member(String name, String ip) {
        setName(name);
        setIp(ip);
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
    public void setIp(String ip) {
        this.ip = ip;
    }
    // ip のgetter
    public String getIp() {
        return this.ip;
    }
}
