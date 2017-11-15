package jp.enpit.facitter.ws;


import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;


//参考サイト　https://www.rocher.kyoto.jp/arbr/?p=286
//@ServerEndpoint(value = "/ws", decoders = { TaskDecoder.class }, encoders = { TaskEncoder.class })
@ServerEndpoint(value = "/ws")
public class FacitterWs {

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
    public void onClose(Session session, CloseReason reason) {
        // チャット接続者一覧から自分を消す
        sessions.remove(session);
        System.out.println("code = " + reason.getCloseCode().getCode() + ", reason = " + reason.getReasonPhrase());
    }

    /**
     *  クライアントからのwsテキストメッセージ受信時の処理
     */
    @OnMessage
    public void onMessage(String message) {
        //System.out.println("send:" + message);
        //return task;
        // チャット接続者一覧の全てにメッセージを送る
        for (Session session : sessions) {
            try {
                session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    
    @OnError
    public void onError(Session session, Throwable thr) {}
}