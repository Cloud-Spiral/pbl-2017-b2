package jp.enpit.lama.rest;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import jp.enpit.lama.entities.ErrorMessage;
import jp.enpit.lama.entities.Task;
import jp.enpit.lama.model.TaskModel;

@Path("tasks")
public class TasksRest {
    public TasksRest(){
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTasks(){
        try(TaskModel model = createModel()){
            return Response.status(200)
                    .entity(model.findTasks())
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
    public Response postTask(@FormParam("body") String body, @FormParam("priority") Integer priority){
        if(body == null || body.trim().equals(""))
            return errorMessage(400, "Empty body");
        if(body.length() > 80)
            return errorMessage(400, "Too long body");
        try(TaskModel model = createModel()){
            Task task = model.register(new Task(body, priority, "open"));
            return Response.status(201)
                    .entity(task)
                    .build();
        }
    }
    
    @PUT
    @Path("status")
    @Produces(MediaType.APPLICATION_JSON)
    public Response changeTaskStatus(@FormParam("tid") Integer tid){
        try(TaskModel model = createModel()){
            model.changeTaskStatus(tid);
            return Response.status(201)
                    .build();
        }
    }

    // task自体を変更する（bodyや優先度）
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    public Response changeTaskPriority(@FormParam("tid") Integer tid, @FormParam("body") String body, @FormParam("priority") Integer priority){
        try(TaskModel model = createModel()){
            model.changeTask(tid, body, priority);
            return Response.status(201)
                    .build();
        }
    }

    private TaskModel createModel(){
        return new TaskModel();
    }
}