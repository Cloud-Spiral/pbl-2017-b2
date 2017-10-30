package jp.enpit.lama.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/hello")
public class HelloRest {
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.TEXT_PLAIN)
	public Response helloUser(
			@QueryParam("name") String name){
		if(name == null) return helloWorld();
		return Response.status(200)
				.entity("Congratulation, " + name + "!")
				.build();
	}
	
	public Response helloWorld(){
		return Response.status(200)
				.entity("Congratulation!!")
				.build();
	}
}
