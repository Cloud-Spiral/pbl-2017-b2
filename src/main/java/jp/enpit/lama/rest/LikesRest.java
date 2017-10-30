package jp.enpit.lama.rest;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import jp.enpit.alpaca.entities.Like;
import jp.enpit.alpaca.model.LikeModel;

@Path("likes")
public class LikesRest {
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public Response postLike(){
		try(LikeModel model = new LikeModel()){
			Like like = new Like();
			model.register(like);
			return Response.status(200).entity(like).build();
		}
	}
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getLikes(){
		try(LikeModel model = new LikeModel()){
			return Response.status(200)
					.entity(model.list())
					.build();
		}
	}
}
