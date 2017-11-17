package com.airbnb.web.controller;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.airbnb.web.command.Command;
import com.airbnb.web.command.ResultMap;
import com.airbnb.web.domain.Board;
import com.airbnb.web.domain.Reservation;
import com.airbnb.web.mapper.JWMapper;
import com.airbnb.web.service.IDeleteService;
import com.airbnb.web.service.IGetService;
import com.airbnb.web.service.IListService;
import com.airbnb.web.service.TransactionService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


@RestController
public class JWController {
	private static final Logger logger = LoggerFactory.getLogger(JWController.class);
	@Autowired JWMapper mapper;
	@Autowired Command cmd;
	@Autowired TransactionService tx;
	
	@RequestMapping(value="/jw/post/{cate}", method=RequestMethod.POST, consumes="application/json")
	public @ResponseBody Map<?, ?> post(@RequestBody Board board, @PathVariable String cate){
		logger.info("board JWController post {}","진입");
		Map<String, Object> map = new HashMap<>();
		String bo_seq = "bo"+String.valueOf((int)((Math.random()*999999999)+100000000));
		String cate_seq = String.valueOf((int)((Math.random()*99999)+10000));
			
		//board
		cmd.setDir(cate);					//table
		cmd.setPageNumber(bo_seq);			//bo_seq
		cmd.setPage(board.getTitle()); 		//title
		cmd.setView(board.getContents()); 	//content
		tx.add(cmd);
		System.out.println("board: "+cmd.getView()+"/"+cmd.getPage()+"/"+cmd.getDir()+"/"+cmd.getPageNumber());
		
		//boardcate
		cmd.setDir("boardcate");			//table
		cmd.setSearch(cate_seq); 			//cate_seq
		cmd.setView(board.getMemberId()); 	//cate_val
		cmd.setPage(board.getRegdate()); 	//cate_level
		tx.add(cmd);
		System.out.println("boardcate: "+cmd.getView()+"/"+cmd.getPage()+"/"+cmd.getDir()+"/"+cmd.getPageNumber());
		
		map.put("result", "success");
		return map;
	}
	
	
	@RequestMapping("/jw/list/{cate}/{param}/{page}")
	public @ResponseBody Map<?, ?> list(@PathVariable String cate, @PathVariable String param, @PathVariable String page){
		logger.info("JWController 진입: list : "+cate);
		Map<String, Object> map = new HashMap<>();
		
		String search = (param.equals("x"))?"%%":"%"+param+"%";
		switch(cate) {
			case "board":
				int pageBlock = 2;
				String endR = String.valueOf(1 * (Integer.parseInt(page)*pageBlock));
				String startR = (page.equals("1"))?"1":String.valueOf(Integer.parseInt(endR)+1);
				
				cmd.setDir(cate);
				cmd.setSearch(search);
				cmd.setStartRow(startR);
				cmd.setEndRow(endR);
				
				System.out.println(cmd.getDir()+"/"+cmd.getSearch()+"/"+cmd.getStartRow()+"/"+cmd.getEndRow());

				map.put("list", new IListService() {
					@Override
					public List<?> execute(Object o) {
						return mapper.selectList(cmd);
					}
				}.execute(cmd));
				
				System.out.println(map.get("list"));
				break;
			case "residence":		
				
				cmd.setDir(cate);
				cmd.setSearch(search);
				System.out.println(cmd.getDir()+"/"+cmd.getSearch());

				map.put("list", new IListService() {
					@Override
					public List<?> execute(Object o) {
						return mapper.selectList(cmd);
					}
				}.execute(cmd));
				
				System.out.println(map.get("list"));
				break;
			case "combo":				
				map.put("combobox", new IListService() {
					@Override
					public List<?> execute(Object o) {
						return mapper.comboList(cmd);
					}
				}.execute(cmd));
				
				System.out.println(map.get("combobox"));
				break;
		}
		
		map.put("result", "success");
		return map;
	}
	
	
	@RequestMapping("/jw/rev/{cate}/{param1}/{param2}/{param3}")
	public @ResponseBody Map<?, ?> revList (@PathVariable String cate, @PathVariable String param1, @PathVariable String param2, @PathVariable String param3){
		logger.info("JWController 진입: rev :"+ cate + " / " + param1 + " / " + param2 + " / " + param3);
		Map<String, Object> map = new HashMap<>();

		switch(cate) {
			case "rsvList":
				cmd.setDir(cate);
				cmd.setSearch(param1+"@"+param2+"."+param3);
				
				map.put("list", new IListService() {
					@Override
					public List<?> execute(Object o) {
						return mapper.selectList(cmd);
					}
				}.execute(cmd));
				
				System.out.println(map.get("list"));
				break;
			case "hresiList":
				cmd.setDir(cate);
				cmd.setSearch(param1+"@"+param2+"."+param3);
				
				map.put("list", new IListService() {
					@Override
					public List<?> execute(Object o) {
						return mapper.selectList(cmd);
					}
				}.execute(cmd));
				
				System.out.println(map.get("list"));
				break;
		}
		
		
		map.put("result", "success");
		return map;
	};
	
	
	@RequestMapping("/jw/list/chart/{cate}")
	public @ResponseBody JSONObject chart(@PathVariable String cate){
		Map<String, Object> map = new HashMap<>();
		JSONObject data = new JSONObject();
		JSONObject jsonObj = new JSONObject();
		JSONObject jOb1 = new JSONObject();
		JSONObject jOb2 = new JSONObject();
		JSONObject jOb3 = new JSONObject();
		JSONObject jOb4 = new JSONObject();
		JSONArray ajaxArr = new JSONArray();
		JSONArray colArr = new JSONArray();
		JSONArray rowArr = new JSONArray();
		
		cmd.setDir(cate);
		switch (cate) {
			case "column":
				jOb1.put("type", "string");
				jOb1.put("label", "month");
				jOb2.put("type", "number");
				jOb2.put("label", "2015");
				jOb3.put("type", "number");
				jOb3.put("label", "2016");
				jOb4.put("type", "number");
				jOb4.put("label", "2017");
				
				colArr.add(jOb1);
				colArr.add(jOb2);
				colArr.add(jOb3);
				colArr.add(jOb4);
				data.put("cols", colArr);
				
				@SuppressWarnings("unchecked") 
				ArrayList<ResultMap> arrColumn = (ArrayList<ResultMap>) new IListService() {
					@Override
					public List<?> execute(Object o) {
						return mapper.chartCol(cmd);
					}
				}.execute(cmd);
				
				for(int i=0; i<arrColumn.size();i++) {	
					jOb1 = new JSONObject();
					jOb2 = new JSONObject();
					jOb3 = new JSONObject();
					jOb4 = new JSONObject();
					rowArr = new JSONArray();
					
					String temp1= (arrColumn.get(i).getBlyearSales()==null)?"0":arrColumn.get(i).getBlyearSales();
					String temp2= (arrColumn.get(i).getLyearSales()==null)?"0":arrColumn.get(i).getLyearSales();
					String temp3= (arrColumn.get(i).getTyearSales()==null)?"0":arrColumn.get(i).getTyearSales();
					
					System.out.println("Column: "+arrColumn.get(i).getBlyearSales()+"/"+temp1+" || "+arrColumn.get(i).getLyearSales()+"/"+temp2+" || "+arrColumn.get(i).getTyearSales()+"/"+temp3);
						
					jOb1.put("v", arrColumn.get(i).getColMonth()+"월");
					jOb2.put("v", Integer.parseInt(temp1));
					jOb3.put("v", Integer.parseInt(temp2));
					jOb4.put("v", Integer.parseInt(temp3));
					rowArr.add(jOb1);
					rowArr.add(jOb2);
					rowArr.add(jOb3);
					rowArr.add(jOb4);
					jsonObj.put("c", rowArr);
					ajaxArr.add(jsonObj);
				}
				
				data.put("rows", ajaxArr);
				System.out.println("column: "+data);
				break;
	
			case "line":		
				jOb1.put("type", "string");
				jOb1.put("label", "year");
				jOb2.put("type", "number");
				jOb2.put("label", "사용자수");
				colArr.add(jOb1);
				colArr.add(jOb2);
				data.put("cols", colArr);
				
				//data
				@SuppressWarnings("unchecked") 
				ArrayList<ResultMap> arrline = (ArrayList<ResultMap>) new IListService() {
					@Override
					public List<?> execute(Object o) {
						return mapper.chartLine(cmd);
					}
				}.execute(cmd);
				
				for(int i=0; i<arrline.size();i++) {
					jOb1 = new JSONObject();
					jOb2 = new JSONObject();
					rowArr = new JSONArray();
					
					String temp= (arrline.get(i).getColCount()==null)?"0":arrline.get(i).getColCount();
					
					System.out.println("line: "+arrline.get(i).getColYear()+"/"+temp);
					
					jOb1.put("v", String.valueOf(arrline.get(i).getColYear()));
					jOb2.put("v", Integer.parseInt(temp));
					rowArr.add(jOb1);
					rowArr.add(jOb2);
					jsonObj.put("c", rowArr);
		
					ajaxArr.add(jsonObj);
				}
				
				data.put("rows", ajaxArr);
				System.out.println("line: "+data);
				break;
			case "geo":		
				//지역 맵핑
				Map<String, String> reginMap = new HashMap<>();
				reginMap.put("서울특별시", "KR-11");
				reginMap.put("부산광역시", "KR-26");
				reginMap.put("전라북도", "KR-45");
				reginMap.put("경상북도", "KR-47");
				reginMap.put("제주특별자치도", "KR-49");
				
				jOb1.put("type", "string");
				jOb1.put("label", "City");
				jOb2.put("type", "number");
				jOb2.put("label", "숙소수");
				colArr.add(jOb1);
				colArr.add(jOb2);
				data.put("cols", colArr);
				
				//data
				@SuppressWarnings("unchecked") 
				ArrayList<ResultMap> arrgeo = (ArrayList<ResultMap>) new IListService() {
					@Override
					public List<?> execute(Object o) {
						return mapper.chartgeo(cmd);
					}
				}.execute(cmd);
				
				for(int i=0; i<arrgeo.size();i++) {
					jOb1 = new JSONObject();
					jOb2 = new JSONObject();
					rowArr = new JSONArray();
					
					String temp= (arrgeo.get(i).getColCount()==null)?"0":arrgeo.get(i).getColCount();
					System.out.println("geo: "+arrgeo.get(i).getColCount()+"/"+temp);
					
					jOb1.put("v", reginMap.get(arrgeo.get(i).getColArea()));
					jOb1.put("f", arrgeo.get(i).getColArea());
					jOb2.put("v", Integer.parseInt(temp));
					rowArr.add(jOb1);
					rowArr.add(jOb2);
					jsonObj.put("c", rowArr);
		
					ajaxArr.add(jsonObj);
				}
				
				data.put("rows", ajaxArr);
				System.out.println("geo: "+data);
				break;
		}
		
		map.put("result", "success");
		return data;
	}
	
	@RequestMapping(value="/jw/get/{cate}", method=RequestMethod.POST, consumes="application/json")
	public @ResponseBody Map<?, ?> get(@RequestBody Board board, @PathVariable String cate){
		logger.info("JWController 진입: getDetail : "+cate);
		Map<String, Object> map = new HashMap<>();
		
		switch(cate) {
			case "board":
				cmd.setColumn(board.getTitle());
				cmd.setSearch(board.getBoardSeq());
				cmd.setDir(cate);
				System.out.println(cmd.getColumn()+"/"+cmd.getSearch()+"/"+cmd.getDir());
	
				map.put("detail", new IGetService() {
					@Override
					public Object execute(Object o) {
						return mapper.selectOne(cmd);
					}
				}.execute(cmd));
				
				System.out.println(map.get("detail"));
				break;
		}
		
		map.put("result", "success");
		return map;
	}
	
	@RequestMapping("/jw/get/dash")
	public @ResponseBody Map<?, ?> getDashBoard(){
		logger.info("JWController 진입: getDashBoard");
		Map<String, Object> map = new HashMap<>();

		cmd.setDir("dashboard");
		map.put("data", new IGetService() {
			@Override
			public Object execute(Object o) {
				return mapper.selectOne(cmd);
			}
		}.execute(cmd));
		
		System.out.println("dashboard: "+map.get("data"));	
		map.put("result", "success");
		return map;
	}
	
	
	@RequestMapping(value="/jw/put/{cate}", method=RequestMethod.POST, consumes="application/json")
	public @ResponseBody Map<?, ?> put(@RequestBody Board board, @PathVariable String cate){
		logger.info("JWController 진입: put : "+cate);
		Map<String, Object> map = new HashMap<>();
		
		//board
		cmd.setDir(cate);					//table
		cmd.setPageNumber(board.getBoardSeq());	  //bo_seq
		cmd.setPage(board.getTitle()); 		//title
		cmd.setView(board.getContents()); 	//content
		tx.modify(cmd);
		System.out.println("board: "+cmd.getView()+"/"+cmd.getPage()+"/"+cmd.getDir()+"/"+cmd.getPageNumber());
		
		//boardcate
		cmd.setDir("boardcate");			//table
		cmd.setView(board.getMemberId()); 	//cate_val
		cmd.setPage(board.getRegdate()); 	//cate_level
		tx.modify(cmd);
		System.out.println("boardcate: "+cmd.getView()+"/"+cmd.getPage()+"/"+cmd.getDir()+"/"+cmd.getPageNumber());
		map.put("result", "success");
		
		return map;
	}
	
	@RequestMapping(value="/jw/delete/{cate}", method=RequestMethod.POST, consumes="application/json")
	public @ResponseBody Map<?, ?> delete(@RequestBody Board board, @PathVariable String cate){
		logger.info("JWController 진입: delete : "+cate);
		Map<String, Object> map = new HashMap<>();
		
		switch(cate) {
			case "board":
				//board
				cmd.setDir(cate);	//table
				cmd.setSearch(board.getBoardSeq());	//board_seq
				tx.remove(cmd);
				System.out.println("board: "+cmd.getSearch()+"/"+cmd.getDir());
				
				//boardcate
				cmd.setDir("boardcate");//table
				tx.remove(cmd);
				System.out.println("boardcate"+cmd.getSearch()+"/"+cmd.getDir());
				
				map.put("result", "success");
				
				break;
			case "residence":
				cmd.setDir(cate);
				cmd.setSearch(board.getBoardSeq());
				
				new IDeleteService() {
					@Override
					public void execute(Object o) {
						mapper.delete(cmd);
						map.put("result", "success");
					}
				}.execute(cmd);
				break;
		}
		return map;
	}
	
	@RequestMapping(value="/jw/rsv/delete/rsvDel", method=RequestMethod.POST, consumes="application/json")
	public @ResponseBody Map<?, ?> delete(@RequestBody Reservation rsv){
		logger.info("JWController 진입: reservation delete : ");
		Map<String, Object> map = new HashMap<>();
		
		cmd.setDir("reservation");
		cmd.setSearch(rsv.getRsvSeq());
		System.out.println("reservation: "+cmd.getDir()+"/"+cmd.getSearch());
		
		new IDeleteService() {
			@Override
			public void execute(Object o) {
				mapper.delete(cmd);
				map.put("result", "success");
			}
		}.execute(cmd);
		return map;
	}
}
