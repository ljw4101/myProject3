package com.airbnb.web.domain;

import org.springframework.stereotype.Component;

import lombok.Data;

@Component @Data
public class Member {
			private String 
			memberId,
			memberPassword,
			name,
			regdate,
			birthdate,
			memberRole;
}
