package jp.enpit.lama.ws;

import javax.json.JsonObject;

public class Task {
    private int tid;
   /* public String body;
    public int priority;
    public String status;*/
    private String type;
    

    public Task(JsonObject jsonObject) {
        if(jsonObject.containsKey("tid")){
            this.tid = jsonObject.getInt("tid");
        }
        if(jsonObject.containsKey("type")){
            this.type = jsonObject.getString("type");
        }
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getTid() {
        return tid;
    }
    public String getType() {
        return type;
    }
    
}
