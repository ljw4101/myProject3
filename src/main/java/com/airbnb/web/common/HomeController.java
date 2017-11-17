package com.airbnb.web.common;

import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.airbnb.web.complex.PathFactory;

/**
 * Handles requests for the application home page.
 */
@Controller
@SessionAttributes("path")
public class HomeController {
	
	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
	@RequestMapping("/")
	public String intro(Model model) {
		logger.info("Welcome home! The client  {}." ,"ENTERED!! ");
		model.addAttribute("path", PathFactory.create());
		return "intro";
	}
	@RequestMapping("/home")
	public String home(Model model) {
		logger.info("gmap was  {}." ,"ENTERED!! ");
		model.addAttribute("path", PathFactory.create());
		return "index";
	}
	@RequestMapping("/gmap")
	public String gmap(Model model) {
		logger.info("gmap was  {}." ,"ENTERED!! ");
		model.addAttribute("path", PathFactory.create());
		return "map";
	}
	@RequestMapping("/admin")
	public String admin(Model model) {
		logger.info("admin was  {}." ,"ENTERED!! ");
		model.addAttribute("path", PathFactory.create());
		return "admin";
	}
}
