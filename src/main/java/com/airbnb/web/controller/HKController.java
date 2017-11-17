package com.airbnb.web.controller;
import java.util.HashMap;
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
import com.airbnb.web.mapper.HKMapper;
import com.airbnb.web.service.IGetService;
import com.airbnb.web.service.IListService;
import com.airbnb.web.service.IPostService;
import com.airbnb.web.service.TransactionService;

@RestController
public class HKController {
	private static final Logger logger = LoggerFactory.getLogger(HKController.class);
	@Autowired Command cmd;
	@Autowired HKMapper mapper;
	@Autowired TransactionService tx;
	
	@RequestMapping(value="/get/{cate}/{seq}", method=RequestMethod.POST, consumes="application/json")
	public @ResponseBody Map<?,?> get(@PathVariable String cate, @PathVariable String seq) {
		logger.info("get 진입");
		System.out.println("###### 넘어온 시퀀스 값 : " +seq);
		Map<String,Object> map = new HashMap<>();
		cmd.setSearch(seq);
		map.put("detail", new IGetService() {
			@Override
			public Object execute(Object o) {
				return mapper.selectOne(cmd);
			}
		}.execute(null));
		//ResultMap rm = (ResultMap) map.get("detail");
		return map;
		
	};
	
	@RequestMapping(value="/list/{cate}", method=RequestMethod.POST, consumes="application/json")
	public @ResponseBody Map<?,?> list(@RequestBody Command cmd){
		System.out.println("@@@@ 넘어온 시퀀스 값 : " +cmd.getAction());
		Map<String,Object> map = new HashMap<>();
		
		IListService listService = null;
		IGetService countService = null;
		switch(cmd.getAction()) {
			case "revList":
				listService = (x)->{
					return mapper.selectList(cmd);
				};
				countService = (x)->{
					return mapper.count(cmd);
				};
				map.put("revList", listService.execute(cmd));
				map.put("count", countService.execute(cmd));
				
				break;
			case "revsearch":
				listService = (x)->{
					return mapper.selectList(cmd);
				};
				map.put("searchList", listService.execute(cmd));
				break;
			case "disableDate":
				listService = (x)->{
					return mapper.selectList(cmd);
				};
				map.put("disable", listService.execute(cmd));
				System.out.println(map.get("disable"));
				break;
			case "allRegSelect":
				//페이지네이션
				int theNumberOfPage=0, startPage=0, endPage=0, startRow=0, endRow=0;
				int pageSize=6;
				int blockSize=3;
				int pageNum=Integer.parseInt(cmd.getPage());
				map.put("pageNum", pageNum);
				System.out.println("pageNum "+pageNum);
				
				countService = (x)->{
					return mapper.count(cmd);
				};
				map.put("count", countService.execute(cmd));
				
				int theNumberOfRows=Integer.parseInt((String) map.get("count"));
				System.out.println("숙소 등록 갯수:::"+theNumberOfRows);
				
				theNumberOfPage = (theNumberOfRows%pageSize) == 0? theNumberOfRows/pageSize : theNumberOfRows/pageSize+1;
				
				map.put("totalPage", theNumberOfPage);
				
				startRow =(pageNum-1)*pageSize+1;
				endRow = (pageNum*pageSize);
				cmd.setStartRow(String.valueOf(startRow));
				cmd.setEndRow(String.valueOf(endRow));
				
				startPage = pageNum - ((pageNum-1)%blockSize);
				endPage = (startPage + blockSize-1 <= theNumberOfPage) ? startPage + blockSize-1 : theNumberOfPage;
				map.put("startPage", startPage);
				map.put("endPage", endPage);
				
				listService = (x)->{
					return mapper.selectList(cmd);
				};
				System.out.println("startPage "+startRow);
				System.out.println("endPage "+endRow);
				map.put("allReg", listService.execute(cmd));
				
				
				
				System.out.println(map.get("allReg"));
				System.out.println(map.get("totalPage"));
				break;
		};
		
		return map;
	};
	
	@RequestMapping(value="/post/{cate}", method=RequestMethod.POST, consumes="application/json")
	public @ResponseBody Map<?,?> post(@PathVariable String cate, @RequestBody ResultMap res){
		System.out.println("####post 넘어온 아이디값:"+res.getMemberId());
		Map<String,Object> map = new HashMap<>();
		switch(cate) {
		case "rev":
			int random = (int)((Math.random()*9999999)+1000000);
			String seq = "rev"+String.valueOf(random);
			cmd.setCate(cate);
			cmd.setView(seq);
			cmd.setDir(res.getCheckin());
			cmd.setAction(res.getCheckout());
			cmd.setColumn(res.getAdult());
			cmd.setSearch(res.getTeen());
			cmd.setStartRow(res.getChild());
			cmd.setEndRow(res.getSolddays());
			cmd.setSerial(res.getHostSerial());
			cmd.setPageNumber(res.getMemberId());
			cmd.setPage(res.getResPrice());
			
			new IPostService() {
				@Override
				public void execute(Object o) {
					mapper.insert(cmd);
				}
			}.execute(null);
			map.put("result", "success");
			break;
		case "resi":
			String hostSerial = "ko"+String.valueOf((int)((Math.random()*99999999)+10000000));
			//residence
			cmd.setCate(cate);
			cmd.setCommon("residence");
			cmd.setView(res.getMemberId());
			cmd.setDir(res.getResidenceName());
			cmd.setAction(res.getPrice());
			cmd.setColumn(res.getZipcode());
			cmd.setSearch(hostSerial);
			cmd.setStartRow(res.getResiContent());
			cmd.setEndRow(res.getAddr());
			cmd.setPage(res.getLimit());
			tx.resi(cmd);
			
			//resiopt
			cmd.setCate(cate);
			cmd.setCommon("resiopt");
			cmd.setView(res.getWifi());
			cmd.setDir(res.getBedNum());
			cmd.setAction(res.getPet());
			cmd.setColumn(res.getEssentialItem());
			cmd.setSearch(res.getParking());
			cmd.setStartRow(res.getBathroomNum());
			cmd.setEndRow(res.getTv());
			cmd.setPage(res.getWashingMac());
			cmd.setPageNumber(res.getAirCondi());
			cmd.setKitchen(res.getKitchen());
			cmd.setSerial(hostSerial);
			tx.resi(cmd);
			
			map.put("result", "success");
			break;
		};
		
		return map;
	};

}