package jp.enpit.lama.rest;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import jp.enpit.lama.entities.ErrorMessage;
import jp.enpit.lama.entities.Husen;
import jp.enpit.lama.model.HusenModel;
@Path("/husens")
public class HusensRest {
	
	public HusensRest(){
    }
	
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getHusens(){
        try(HusenModel model = createModel()){
            return Response.status(200)
                    .entity(model.list())
                    .build();
        }
    }
	
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response postHusen(
    		@FormParam("cid") int cid,
    		@FormParam("text") String text,
    		@FormParam("xPosition") String xPosition,
    		@FormParam("yPosition") String yPosition,
    		@FormParam("height") String height,
    		@FormParam("good") int good,
    		@FormParam("bad") int bad,
    		@FormParam("color") int color,
    		@FormParam("canEdit") int canEdit
    		){

        try(HusenModel model = createModel()){
        	Husen husen = new Husen(cid,
    				text,
    				xPosition,
    				yPosition,
    				height,
    				good,
    				bad,
    				color,
    				canEdit);
            model.register(husen);
            return Response.status(201)
                    .entity(husen)
                    .build();
        }
    }
    
    private HusenModel createModel(){
        return new HusenModel();
    }
    
}
