package com.airbnb.web.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.airbnb.web.command.Command;
import com.airbnb.web.command.ResultMap;
import com.airbnb.web.domain.Member;
import com.airbnb.web.domain.Reservation;
import com.airbnb.web.mapper.BKMapper;
import com.airbnb.web.service.IGetService;
import com.airbnb.web.service.IListService;
import com.airbnb.web.service.IPostService;
import com.airbnb.web.service.IPutService;
import com.airbnb.web.service.TransactionService;

@RestController
public class BKController {
	private static final Logger logger = LoggerFactory.getLogger(BKController.class);
	@Autowired Member mem;
	@Autowired BKMapper mapper;
	@Autowired Reservation rev;
	@Autowired Command cmd;
	@Autowired TransactionService tx;
	
	@RequestMapping(value = "/get/login", method = RequestMethod.POST)
	public @ResponseBody Map<?, ?> put(@RequestBody Member mem) {
		logger.info("BKController::::: BKController {}", "컨트롤러진입" + mem.getMemberId() +" / "+ mem.getMemberPassword());
		Map<String, Object> map = new HashMap<>();
		Command cmd = new Command();
		String result = "";
		
		cmd.setAction(mem.getMemberId());
		cmd.setColumn(mem.getMemberPassword());
		
		map.put("list", new IGetService() {
			@Override
			public Object execute(Object o) {
				return mapper.selectOne(cmd);
			}
		}.execute(cmd));
		
		if(map.get("list") != null) {
			result  = "success";
			map.put("user", mem.getMemberId());
		}else {
			result  = "fail";
		};
		map.put("msg", result);
		
		return map;
	}
	
	@RequestMapping(value = "/get/insert", method = RequestMethod.POST)
	public @ResponseBody void insert(@RequestBody Member mem) {
		logger.info("BKController::::: insert {}", "인서트");
		Map<String, Object> map = new HashMap<>();
		System.out.println("email : " + mem.getMemberId() + "비번 : " + mem.getMemberPassword());
		System.out.println("이름 : " + mem.getName() + "생일 : " + mem.getBirthdate());
		
		Command cmd = new Command();
		cmd.setAction(mem.getMemberId());
		cmd.setDir(mem.getName());
		cmd.setPageNumber(mem.getBirthdate());
		cmd.setColumn(mem.getMemberPassword());
			new IPostService() {  
			@Override
			public void execute(Object o) {
				mapper.insert(cmd);
			}
		}.execute(cmd);
	}
	@RequestMapping(value = "/get/search", method = RequestMethod.POST)
	public @ResponseBody Map<?, ?> search(@RequestBody Member mem) {
		logger.info("BKController::::: 서치!!!! {}", "컨트롤러진입");
		System.out.println("id : " + mem.getMemberId());
		Map<String, Object> map = new HashMap<>();
		Command cmd = new Command();
		cmd.setAction(mem.getMemberId());
		String result;
		Member m = (Member) new IGetService() {

			@Override
			public Object execute(Object o) {
				// TODO Auto-generated method stub
				return mapper.selectSearch(cmd);
			}
		}.execute(cmd);

		if (m == null) {
			result = "success";
		} else {
			result = "fail";
		}
       
		
		map.put("msg", result);
		

		return map;
	}
	@RequestMapping(value="/get/update" ,method = RequestMethod.POST)
	public @ResponseBody void update(@RequestBody Member mem){
		logger.info("BKController::::: 업데이트!!! {}", "컨트롤러진입");
		System.out.println("id : " + mem.getMemberId());
		Command cmd = new Command();
		cmd.setAction(mem.getMemberId());
		String a=mem.getBirthdate()+mem.getName();
		cmd.setColumn(a);
		
		System.out.println("aaaaaaaaa"+a);
		new IPutService() {
			
			@Override
			public void execute(Object o) {
			mapper.update(cmd);
			}
			
		}.execute(cmd);
		
	}
		
	@RequestMapping(value="/get/delete" ,method = RequestMethod.POST)
	public @ResponseBody void delete(@RequestBody Member mem){
		logger.info("BKController::::: 탈퇴!!! {}", "컨트롤러진입");
		System.out.println("id : " + mem.getMemberId());
		Command cmd = new Command();
		cmd.setAction(mem.getMemberId());
		tx.delete(cmd);
		System.out.println("트랜잭션 성공");
	}
	@RequestMapping(value = "/get/rev", method = RequestMethod.POST)
	public @ResponseBody List<?> selectList(@RequestBody Member mem) {
		logger.info("BKController::::: 예약리스트!!!! {}", "컨트롤러진입");
		cmd.setAction(mem.getMemberId());
		
		 @SuppressWarnings("unchecked")
		List<ResultMap> list=(List<ResultMap>) new IListService() {
			
			@Override
			public List<?> execute(Object o) {
				// TODO Auto-generated method stub
				return mapper.selectList(cmd);
			}
		}.execute(cmd); 
		
		System.out.println(list.toString());	
		
		return list;
	}	
	
}