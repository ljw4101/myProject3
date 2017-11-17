package com.airbnb.web.mapper;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.airbnb.web.command.Command;
@Repository
public interface JYMapper {
	public void insert(Object o);
	public List<?> selectList(Object o);
	public Object selectOne (Object o);
	public String count(Object o);
	public void update (Object o);
	public void delete(Object o);
}
