package com.airbnb.web.domain;

import org.springframework.stereotype.Component;
import lombok.Data;

@Component
@Data
public class Board {
	private String
		boardSeq,
		title,
		contents,
		regdate,
		memberId;
}