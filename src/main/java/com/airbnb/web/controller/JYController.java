package com.airbnb.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.airbnb.web.domain.Member;
import com.airbnb.web.domain.Reservation;
import com.airbnb.web.domain.Residence;
import com.airbnb.web.mapper.JYMapper;
import com.airbnb.web.service.IGetService;
import com.airbnb.web.service.IListService;
import com.airbnb.web.service.IPostService;

@RestController
public class JYController {
	private static final Logger logger = LoggerFactory.getLogger(JYController.class);
	@Autowired JYMapper jyMapper;
	@Autowired Reservation reservation;
	@Autowired Residence residence;
	@Autowired Member member;
	
	@SuppressWarnings("deprecation")
	@RequestMapping(value="/post/reservation"/*,method=RequestMethod.POST*/)
	public @ResponseBody Map<?,?> addReservation(){
		logger.info("*** JYController :: addReservation {}","진입");
		reservation.setMemberId("dev1@test.com");
		reservation.setHostSerial("host_1");
		reservation.setResPrice("132223");
		reservation.setCheckin(String.valueOf(new Date("11/01/2017")));
		reservation.setCheckout(String.valueOf(new Date("11/02/2017")));
		reservation.setSolddays("1");
		
		new IPostService() {
			@Override
			public void execute(Object o) {
				jyMapper.insert(reservation);
			}
		}.execute(null);
		Map<String,String> map = new HashMap<>();
		map.put("msg", "통신 성공 했습니다.");
		System.out.println("msg : "+ map.get("msg"));
		return map;
	}
	@RequestMapping("/get/room/list")
	public @ResponseBody List<?> roomList(){
		logger.info("*** JYController :: roomList {}","진입");
		return new IListService() {
			@Override
			public List<?> execute(Object o) {
				return jyMapper.selectList(residence);
			}
		}.execute(residence);
	}

	@RequestMapping(value="/login"/*,method=RequestMethod.POST*/)
	public @ResponseBody Map<?,?> login(/*@RequestBody Member member*/) {
		logger.info("*** JYController :: login {}","진입");
		Map<String,Object> map = new HashMap<>();
		Member m = new Member();
		m.setMemberId("dev1@test.com");
		m.setMemberPassword("1");
		member = (Member) new IGetService() {
			@Override
			public Object execute(Object o) {
				return jyMapper.selectOne(m);
			}
		}.execute(m);
		String msg="";
		if(member==null) {
			msg="로그인 실패";
	     }else {
	    	msg="로그인 성공";
	     }
		map.put("member", member);
		map.put("msg", msg);
		
		return map;
	}
	@RequestMapping("/get/room/count")
	public @ResponseBody String roomCount(){
		logger.info("*** JYController :: roomCount {}","진입");
		String count = (String) new IGetService() {
			@Override
			public Object execute(Object o) {
				return jyMapper.count(o);
			}
		}.execute(null);
		System.out.println("Residence Count : "+ count );
		return count;
	}
}
