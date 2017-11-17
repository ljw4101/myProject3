package com.airbnb.web.domain;

import org.springframework.stereotype.Component;
import lombok.Data;

@Component @Data
public class BoardCate {
	private String
		cateSeq,
		boardSeq,
		cateName,
		cateLevel;
}