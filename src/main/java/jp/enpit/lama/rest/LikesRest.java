package jp.enpit.lama.rest;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import jp.enpit.lama.entities.Like;
import jp.enpit.lama.model.LikeModel;

@Path("likes")
public class LikesRest {
    public LikesRest(){
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLikes(){
        try(LikeModel model = createModel()){
            return Response.status(200)
                    .entity(model.list())
                    .build();
        }
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response postLike(){
        try(LikeModel model = createModel()){
            Like like = new Like();
            model.register(like);
            return Response.status(201)
                    .entity(like)
                    .build();
        }
    }

    private LikeModel createModel(){
        return new LikeModel();
    }
}
