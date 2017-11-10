package jp.enpit.lama.rest;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import jp.enpit.lama.entities.ErrorMessage;
import jp.enpit.lama.entities.User;
import jp.enpit.lama.entities.Winner;
import jp.enpit.lama.model.UserModel;
import jp.enpit.lama.model.WinnerModel;

@Path("/winners")
public class WinnersRest {
    public WinnersRest(){
    }

    public Response errorMessage(int statusCode, String message){
        return Response.status(statusCode)
            .entity(new ErrorMessage(message))
            .build();
    }
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
	public Response getUsers() {
		try (WinnerModel model = createModel()) {
			return Response.status(200)
					.entity(model.findWinners())
					.build();
		}
    }
    
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response postWinner(@FormParam("name") String name){
        if(name == null || name.trim().equals(""))
            return errorMessage(400, "Empty name");
        if(name.length() > 30)
            return errorMessage(400, "Too long name");
            
        try(WinnerModel model = createModel()){
            Winner winner = model.register(new Winner(name));
            return Response.status(201)
                .entity(winner)
                .build();
        }
    }

    private WinnerModel createModel(){
        return new WinnerModel();
    }
    /*private int toInteger(String string){
        try{
            return Integer.parseInt(string);
        } catch(NumberFormatException e){
            return -1;
        }
    }*/
}
