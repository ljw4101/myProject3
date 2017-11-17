package com.airbnb.web.command;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import com.airbnb.web.constant.Extension;
import com.airbnb.web.constant.Path;

import lombok.Data;

@Lazy
@Component
public class Command {
protected String dir,action, page,pageNumber,search,view,column,startRow,endRow,kitchen,serial,cate,common;

	public String getDir() {
	return dir;
}

public void setDir(String dir) {
	this.dir = dir;
}

public String getAction() {
	return action;
}

public void setAction(String action) {
	this.action = action;
}

public String getPage() {
	return page;
}

public void setPage(String page) {
	this.page = page;
}

public String getPageNumber() {
	return pageNumber;
}

public void setPageNumber(String pageNumber) {
	this.pageNumber = pageNumber;
}

public String getSearch() {
	return search;
}

public void setSearch(String search) {
	this.search = search;
}

public String getView() {
	return view;
}

public void setView(String view) {
	this.view = view;
}

public String getColumn() {
	return column;
}

public void setColumn(String column) {
	this.column = column;
}

public String getStartRow() {
	return startRow;
}

public void setStartRow(String startRow) {
	this.startRow = startRow;
}

public String getEndRow() {
	return endRow;
}

public void setEndRow(String endRow) {
	this.endRow = endRow;
}

public String getKitchen() {
	return kitchen;
}

public void setKitchen(String kitchen) {
	this.kitchen = kitchen;
}

public String getSerial() {
	return serial;
}

public void setSerial(String serial) {
	this.serial = serial;
}

public String getCate() {
	return cate;
}

public void setCate(String cate) {
	this.cate = cate;
}

public String getCommon() {
	return common;
}

public void setCommon(String common) {
	this.common = common;
}

	public void process() {
		/*VIEW�� �����ش�*/
		this.view=(dir.equals("home"))?
				"/WEB-INF/view/common/home.jsp":
			Path.VIEW+dir+Path.SEPARATOR+page+Extension.JSP;
		System.out.println("�̵�������:"+this.view);
	}

}
