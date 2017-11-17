package com.airbnb.web.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.airbnb.web.command.Command;
import com.airbnb.web.domain.Board;
import com.airbnb.web.domain.ReviewBoard;
import com.airbnb.web.mapper.BKMapper;
import com.airbnb.web.mapper.HKMapper;
import com.airbnb.web.mapper.HYMapper;
import com.airbnb.web.mapper.JWMapper;

//serviceImply 안만드는 격 / 형태는 serviceImply / controller에서 호출
@Service
@Transactional
public class TransactionService  {
	private static final Logger logger = LoggerFactory.getLogger(TransactionService.class);
	@Autowired JWMapper jwmapper;
	@Autowired BKMapper bkmapper;
	@Autowired HKMapper hkmapper;
	@Autowired HYMapper hymapper;
	public void add(Object o) {
		logger.info("TransactionService 진입: insert : "+ o.toString());
		jwmapper.insert(o);
		//mapper.count(null);
	}
	
	public void modify(Object o) {
		logger.info("TransactionService 진입: update : "+ o.toString());
		jwmapper.update(o);
	}
	public void remove(Command cmd) {
		logger.info("TransactionService 진입: delete : "+ cmd.toString());
		jwmapper.delete(cmd);;
	}
	public void delete(Command cmd) {
		bkmapper.deleteId(cmd);
		bkmapper.deleteRes(cmd);
	}
	public void resi(Command cmd) {
		logger.info("TransactionService 진입: resi : "+ cmd.toString());
		hkmapper.insert(cmd);
	}
	public void addReview(Board brd, ReviewBoard rvd) {
		logger.info("TransactionService 진입: resi : "+ brd.toString()+ rvd.toString());
		hymapper.insertBoard(brd);
		hymapper.insertReviewBoard(rvd);
	}
	
}