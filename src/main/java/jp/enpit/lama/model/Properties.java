package jp.enpit.lama.model;

import java.util.HashMap;
import java.util.Map;

public class Properties {
    public static enum Key{
        DATEBASE_NAME,
        HOST_NAME,
        PORT_NUMBER;
    };
    private static Properties INSTANCE = new Properties();

    private Map<Key, String> properties = new HashMap<>();

    public static final Properties instance(){
        return INSTANCE;
    }

    private Properties(){
        properties.put(Key.DATEBASE_NAME, "lama");
        properties.put(Key.HOST_NAME, "localhost");
        properties.put(Key.PORT_NUMBER, "27017");
    }

    public String property(Key key){
        return properties.get(key);
    }

    public String property(Key key, String defaultValue){
        return properties.getOrDefault(key, defaultValue);
    }

    public int propertyAsInt(Key key){
        return Integer.parseInt(property(key));
    }

    public void put(Key key, String value){
        properties.put(key, value);
    }
}
