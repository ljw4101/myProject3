package com.airbnb.web.complex;

import org.springframework.stereotype.Component;

import com.airbnb.web.command.Command;
import com.airbnb.web.command.MoveCommand;

import com.airbnb.web.constant.Action;

@Component
public class CommandFactory {
	@SuppressWarnings("unused")
	public static Command createCommand(String dir, String action, String page,String pageNumber,String column,String search) {
		Command cmd=null;
	
		if(action==null){
			action=Action.MOVE;
		}
			switch (action) {
			case Action.MOVE:
		    case Action.LOGIN:
			case Action.LOGOUT:
			case Action.JOIN :
			case Action.UPDATE:
			case Action.DETAIL:
			case Action.DELETE:
			     cmd= new MoveCommand(dir, action, page);
			break;
		
			
			default:
				System.out.println("Command Failed!!!!!");break;
			
		}
		return cmd; 
	}
}
