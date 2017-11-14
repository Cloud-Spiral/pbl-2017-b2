package jp.enpit.facitter.rest;

import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import jp.enpit.facitter.entities.Line;
import jp.enpit.facitter.model.LineModel;
@Path("/lines")
public class LinesRest {
	
	public LinesRest(){
    }
	
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLines(){
        try(LineModel model = createModel()){
        	Response q = Response.status(200)
                    .entity(model.findLines())
                    .build();
            return q;
        }
    }
    
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{hid}")
    public Response deleteComment(@PathParam("hid") Integer hid){
        try(LineModel model = createModel()){
            model.deleteComment(hid);
            return Response.status(200)
                    .build();
        }
    }
	
	
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response postLine(
    		@FormParam("index") int index,
    		@FormParam("line") String lineString
    		){
        try(LineModel model = createModel()){
        	Line line = new Line(index, lineString);
            model.register(line);
        	Response q = Response.status(201).entity(line).build();
            return q;
        }
    }
    
    @PUT
    @Path("/order")
    @Produces(MediaType.APPLICATION_JSON)
    public Response postReloader(@FormParam("number") Integer number
    		,@FormParam("left") String left
    		,@FormParam("top") String top
    		,@FormParam("width") String width
    		,@FormParam("height") String height){
        try(LineModel model = createModel()){
        	//System.out.println(number+" "+left+" "+top+" "+width+" "+height);
        	model.orderPosition(number,left,top,width,height);
        	Response q = Response.status(201).build();
            return q;
        }
    }
    
//    @PUT
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response change(@FormParam("hid") int hid,
//    	    		@FormParam("text") String text,
//    	    		@FormParam("xPosition") String xPosition,
//    	    		@FormParam("yPosition") String yPosition,
//    	    		@FormParam("height") String height,
//    	    		@FormParam("good") Boolean good,
//    	    		@FormParam("bad") Boolean bad,
//    	    		@FormParam("color") Integer color,
//    	    		@FormParam("canEditPerson") Integer canEditPerson
//    	    		){
//
////        System.out.println(hid+" "+text+" "+xPosition+" "+yPosition+" "
////        		+height+" "+good+" "+bad+" "+color+" "+canEditPerson);
//
//        try(LineModel model = createModel()){
//        	//model.changeStatus(hid,text,xPosition,yPosition,height,good,bad,color,canEdit);
//        	
//        	if(color != null){
//            	model.updateColor(hid,color);
//            	return Response.status(201)
//                        .build();
//            }
//        	if(good != null && good){
//        		int goodCount = model.updateGood(hid);
//        		return Response.status(201)
//        				.entity(String.valueOf(goodCount))
//                        .build();
//        	}
//        	if(bad != null && bad){
//        		int badCount = model.updateBad(hid);
//        		return Response.status(201)
//        				.entity(String.valueOf(badCount))
//                        .build();
//        	}
//        	if(xPosition != null && yPosition != null){
//        		model.updatePosition(hid,xPosition,yPosition);
//            	return Response.status(201)
//                        .build();
//        	}
//        	if(text != null){
//        		model.updateText(hid,text);
//        		return Response.status(201)
//                        .build();
//        	}
//        	
//        	return Response.status(400).build();
//        }
//    	
//    }
    
    private LineModel createModel(){
        return new LineModel();
    }
    
}
