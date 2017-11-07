package jp.enpit.lama.rest;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import jp.enpit.lama.entities.ErrorMessage;
import jp.enpit.lama.entities.User;
import jp.enpit.lama.model.UserModel;

@Path("/users")
public class UsersRest {
    public UsersRest(){
    }

    public Response errorMessage(int statusCode, String message){
        return Response.status(statusCode)
            .entity(new ErrorMessage(message))
            .build();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response postUser(@FormParam("name") String name){
    	System.out.println(name);
        if(name == null || name.trim().equals(""))
            return errorMessage(400, "Empty name");
        if(name.length() > 30)
            return errorMessage(400, "Too long name");
            
        try(UserModel model = createModel()){
            User user = model.register(new User(name));
            return Response.status(201)
                .entity(user)
                .build();
        }
    }

    private UserModel createModel(){
        return new UserModel();
    }

    /*private int toInteger(String string){
        try{
            return Integer.parseInt(string);
        } catch(NumberFormatException e){
            return -1;
        }
    }*/
}
