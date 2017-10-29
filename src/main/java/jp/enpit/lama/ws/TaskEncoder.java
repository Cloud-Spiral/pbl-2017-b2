package jp.enpit.lama.ws;


import javax.json.Json;
import javax.json.JsonObject;
import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

public class TaskEncoder implements Encoder.Text<Task> {

    @Override
    public void init(EndpointConfig paramEndpointConfig) {
        System.out.println("TestEncoder#init");
    }

    @Override
    public void destroy() {
        System.out.println("TestEncoder#destroy");
    }

    @Override
    public String encode(Task paramData) throws EncodeException {
        JsonObject model = Json.createObjectBuilder()
                .add("tid", paramData.getTid())
                .add("type",paramData.getType())
                .build();
        return model.toString();
    }

}