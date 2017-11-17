package com.airbnb.web.domain;

import org.springframework.stereotype.Component;

import lombok.Data;

@Component @Data
public class ReviewBoard {
	private String
	boardSeq,
	hostSerial,
	reviewStar;
}
