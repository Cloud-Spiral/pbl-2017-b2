package jp.enpit.lama.ws;


import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;


import java.io.StringReader;

import javax.json.Json;
import javax.json.JsonException;
import javax.json.JsonObject;


public class TaskDecoder implements Decoder.Text<Task> {

    @Override
    public void destroy() {
        System.out.println("TestDecoder#destroy");
    }

    @Override
    public void init(EndpointConfig arg0) {
        System.out.println("TestDecoder#init");
    }

    @Override
    public Task decode(String inputString) throws DecodeException {
        JsonObject jsonObject = Json.createReader(new StringReader(inputString)).readObject();
        return  new Task(jsonObject);
    }

    /*
     * Answer whether the given String can be decoded into an object of type
     * T.だそう 入力チェックもここでやるのがよい？
     */
    @Override
    public boolean willDecode(String inputString) {
        try {
            Json.createReader(new StringReader(inputString)).readObject();
            return true;
        } catch (JsonException ex) {
            ex.printStackTrace();
            return false;
        }
    }
}
