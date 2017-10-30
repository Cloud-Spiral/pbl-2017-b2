package jp.enpit.lama.rest;


import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import jp.enpit.alpaca.entities.Comment;
import jp.enpit.alpaca.entities.ErrorMessage;
import jp.enpit.alpaca.model.CommentModel;


@Path("/comments")
public class CommentRest {
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{cid}")
	public Response getComment(@PathParam("cid") String idString){
		try(CommentModel model = new CommentModel()){
			int cid = toInteger(idString);
			if(cid <= 0)
				return errorMessage(400, "Bad request");
			Comment comment = model.findById(cid);
			if(comment == null)
				return errorMessage(404, "Not found");
			return Response.status(200).entity(comment).build();
		}
	}
	
	public Response errorMessage(int statusCode, String message){
		return Response.status(statusCode).entity(new ErrorMessage(message)).build();
	}
	
	public int toInteger(String string){
		try{
			return Integer.parseInt(string);
		} catch(NumberFormatException e){
			return -1;
		}
	}
}
