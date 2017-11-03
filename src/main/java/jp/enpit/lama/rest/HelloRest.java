package jp.enpit.lama.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/hello")
public class HelloRest{
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response helloUser(@QueryParam("name") String name){
    	String msg = "Conguratulations";
        if("".equals(name))
        	msg += "!!!!";
        else
            msg += ", " + name + "!!!!!";
        return Response.status(200)
                .entity(msg)
                .build();
    }
}