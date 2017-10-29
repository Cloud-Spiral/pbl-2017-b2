package jp.enpit.lama.ws;


import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import javax.websocket.EncodeException;



@ServerEndpoint(value = "/ws", decoders = { TaskDecoder.class }, encoders = { TaskEncoder.class })
public class LamaWs {

    /**
     * チャット接続者一覧を保持するスレッドセーフなSetオブジェクト<br>
     * （スレッドセーフな ＝ 同時書き込みに強いListみたいなもん）
     */
    private static final Set<Session> sessions = new CopyOnWriteArraySet<Session>();

    /**
     * クライアントからのws接続要求時の処理
     * @param session
     */
    @OnOpen
    public void onOpen(Session session) {
        // チャット接続者一覧に自分を追加
        sessions.add(session);
        System.out.println("open:" + session.toString());
    }


    /**
     *  クライアントからのws切断要求時の処理
     * @param session
     */
    @OnClose
    public void onClose(Session session) {
        // チャット接続者一覧から自分を消す
        sessions.remove(session);

    }

    /**
     *  クライアントからのwsテキストメッセージ受信時の処理
     * @param msg
     * @throws EncodeException 
     */
    @OnMessage
    public void onMessage(Task task) {
        System.out.println("send:" + task);
        //return task;
        // チャット接続者一覧の全てにメッセージを送る
        for (Session session : sessions) {
            session.getAsyncRemote().sendObject(task);
        }
    }
}