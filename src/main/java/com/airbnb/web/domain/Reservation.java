package com.airbnb.web.domain;

import org.springframework.stereotype.Component;

import lombok.Data;

@Component @Data
public class Reservation {
	private String
	rsvSeq,
	checkin,
	checkout,
	regdate,
	adult,
	teen,
	child,
	solddays,
	hostSerial,
	memberId,
	resPrice
;
}
