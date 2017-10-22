package jp.enpit.lama.rest;

import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import jp.enpit.lama.entities.Comment;
import jp.enpit.lama.entities.ErrorMessage;
import jp.enpit.lama.model.CommentModel;

@Path("/comments")
public class CommentsRest {
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{cid}")
    public Response getComment(@PathParam("cid") String idString){
        try(CommentModel model = createModel()){
            int cid = toInteger(idString);
            if(cid <= 0)
                return errorMessage(400, "Bad request");

            Comment comment = model.findById(cid);
            if(comment == null)
                return errorMessage(404, "Not found");

            return Response.status(200)
                    .entity(comment)
                    .build();
        }
    }

    public Response errorMessage(int statusCode, String message){
        return Response.status(statusCode)
                .entity(new ErrorMessage(message))
                .build();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response postComment(@FormParam("body") String body){
        if(body == null || body.trim().equals(""))
            return errorMessage(400, "Empty body");
        if(body.length() > 80)
            return errorMessage(400, "Too long body");

        try(CommentModel model = createModel()){
            Comment comment = model.register(new Comment(body));
            return Response.status(201)
                    .entity(comment)
                    .build();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response findComments(@QueryParam("start") String start,
            @QueryParam("n") String length,
            @QueryParam("filter") String filter){
        try(CommentModel model = createModel()){
            if(length == null && start == null && filter == null)
                return findCommentList(model);
            else if(length == null && filter == null)
                return findCommentsWithStart(model, start);
            else if(start == null && filter == null)
                return findCommentsWithLength(model, length);
            else if(start == null && length == null)
                return findCommentsWithFilter(model, filter);
            else if(length == null)
                return findCommentsWithStartAndFilter(model, start, filter);
            else if(start == null)
                return findCommentsWithLengthAndFilter(model, length, filter);
            else if(filter == null)
                return findCommentsWithRange(model, start, length);
            else
                return findCommentsWithRangeAndFilter(model, start, length, filter);
        }
    }

    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{cid}")
    public Response deleteComment(@PathParam("cid") String idString){
        int cid = toInteger(idString);
        if(cid <= 0){
            return errorMessage(400, "Bad request");
        }
        try(CommentModel model = createModel()){
            model.deleteComment(cid);
            return Response.status(200)
                    .build();
        }
    }

    private Response findCommentsWithStart(CommentModel model, String startString){
        try{
            int start = Integer.parseInt(startString);
            if(start < 0)
                return errorMessage(400, "Not a positive integer");
            return Response.status(200)
                    .entity(model.findWithStart(start))
                    .build();
        } catch(NumberFormatException e){
            return errorMessage(400, "Bad request");
        }
    }

    private Response findCommentsWithLength(CommentModel model, String lengthString){
        try{
            int length = Integer.parseInt(lengthString);
            if(length < 0)
                return errorMessage(400, "Not a positive integer");
            return Response.status(200)
                    .entity(model.findWithLength(length))
                    .build();
        } catch(NumberFormatException e){
            return errorMessage(400, "Bad request");
        }
    }

    private Response findCommentsWithRange(CommentModel model, String startString, String lengthString){
        try{
            int start = Integer.parseInt(startString);
            int length = Integer.parseInt(lengthString);
            if(start < 0 || length < 0)
                return errorMessage(400, "Not a positive integer");
            return Response.status(200)
                    .entity(model.findWithRange(start, length))
                    .build();
        } catch(NumberFormatException e){
            return errorMessage(400, "Bad request");
        }
    }

    private Response findCommentsWithFilter(CommentModel model, String filter){
        if(filter.trim().equals(""))
            return errorMessage(400, "Empty filter");
        return Response.status(200)
                .entity(model.findWithFilter(filter))
                .build();
    }

    private Response findCommentsWithStartAndFilter(CommentModel model, String startString, String filter){
        try{
            int start = Integer.parseInt(startString);
            if(start < 0)
                return errorMessage(400, "Not a positive integer");
            if(filter.trim().equals(""))
                return errorMessage(400, "Empty filter");
            return Response.status(200)
                    .entity(model.findWithStartAndFilter(start, filter))
                    .build();
        } catch(NumberFormatException e){
            return errorMessage(400, "Bad request");
        }
    }

    private Response findCommentsWithLengthAndFilter(CommentModel model, String lengthString, String filter){
        try{
            int length = Integer.parseInt(lengthString);
            if(length < 0)
                return errorMessage(400, "Not a positive integer");
            if(filter.trim().equals(""))
                return errorMessage(400, "Empty filter");
            return Response.status(200)
                    .entity(model.findWithLengthAndFilter(length, filter))
                    .build();
        } catch(NumberFormatException e){
            return errorMessage(400, "Bad request");
        }
    }

    private Response findCommentsWithRangeAndFilter(CommentModel model, String startString, String lengthString, String filter){
        try{
            int start = Integer.parseInt(startString);
            int length = Integer.parseInt(lengthString);
            if(start < 0 || length < 0)
                return errorMessage(400, "Not a positive integer");
            if(filter.trim().equals(""))
                return errorMessage(400, "Empty filter");
            return Response.status(200)
                    .entity(model.findWithRangeAndFilter(start, length, filter))
                    .build();
        } catch(NumberFormatException e){
            return errorMessage(400, "Bad request");
        }
    }

    private Response findCommentList(CommentModel model){
        return Response.status(200)
                .entity(model.findComments())
                .build();
    }

    private int toInteger(String string){
        try{
            return Integer.parseInt(string);
        } catch(NumberFormatException e){
            return -1;
        }
    }

    private CommentModel createModel(){
        return new CommentModel();
    }
}
