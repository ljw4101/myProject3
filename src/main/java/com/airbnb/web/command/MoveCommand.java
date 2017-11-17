package com.airbnb.web.command;

public class MoveCommand extends Command{
	public MoveCommand(String dir,String action, String page){
		super.dir=dir;
		super.action=action;
		super.page=page;
		super.page=page;
		super.process(); 
	}
}
