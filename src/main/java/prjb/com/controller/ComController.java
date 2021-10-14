package prjb.com.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import prjb.com.service.ComService;
import prjb.com.util.ComUtil;


@Controller("ComController")
public class ComController {

	@Autowired
	ComService comService;
	
	private static final Logger logger = LoggerFactory.getLogger(ComController.class);
	 
	/**
	 * 메인화면
	 */
	@RequestMapping(value = "/main", method = RequestMethod.GET)
	public String main(HttpServletRequest request, Model m) {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		m.addAttribute("jsLink", "/viewJs/contents" + request.getRequestURI() + ".js");
		return "contents/main";
	}
	
	/**
	 * 로그인 페이지이동
	 */
	@RequestMapping(value = "/loginPage", method = RequestMethod.GET)
	public String loginPage(HttpServletRequest request, Model m) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		ComUtil.getKeyPair(request);
		m.addAttribute("jsLink", "/viewJs" + request.getRequestURI() + ".js");
		return "loginPage";
	}
	
	/**
	 * 회원가입 페이지이동
	 */
	@RequestMapping(value = "/registPage", method = RequestMethod.GET)
	public String registPage(HttpServletRequest request, Model m) {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		m.addAttribute("jsLink", "/viewJs" + request.getRequestURI() + ".js");
		return "registPage";
	}
	
	/**
	 * 로그인처리
	 */
	@RequestMapping(value = "/loginAction", method = RequestMethod.POST)
	public @ResponseBody Object loginAction(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		Map<String, String> resultMap = new HashMap();
		
		resultMap.put("result", comService.loginAction(request, null));
		
		return resultMap;
	}
	
	/**
	 * 회원가입 처리
	 */
	@RequestMapping(value = "/registAction", method = RequestMethod.POST)
	public @ResponseBody Object registAction(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		Map<String, String> resultMap = new HashMap();
		
		resultMap.put("result", comService.registAction(request));
		
		return resultMap;
	}
	
	/**
	 * 로그아웃Action
	 */
	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	public String logout(HttpServletRequest request) {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		
		request.getSession().invalidate();
		
		return "redirect:/loginPage";
	}
	
	/**
	 * 메인화면 호출
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String index(HttpServletRequest request, Model m) {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		m.addAttribute("jsLink", "/viewJs/index.js");
		return "index";
	}
	
	/**
	 * 슬릭그리드 예제화면호출
	 */
	@RequestMapping(value = "/slickGridExam", method = RequestMethod.GET)
	public String slickGridExam(HttpServletRequest request) {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		
		
		return "slickGridExam";
	}
	
	/**
	 * 메뉴실행
	 * @throws Exception 
	 */
	@RequestMapping(value = "/page", method = RequestMethod.GET)
	public ModelAndView page(HttpServletRequest request, ModelAndView mv) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		
		return comService.page(request, mv);
	}
	
	/**
	 * 저장
	 * @throws Exception 
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public @ResponseBody Map save(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		Map<String, String> resultMap = new HashMap();
		
		resultMap.put("result", comService.save(request));
		
		return resultMap;
	}

	/**
	 * ajax 요청처리
	 */
	@RequestMapping(value = "/ajax")
	public @ResponseBody Map ajax(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		Map<String, Object> resultMap = new HashMap();
		
		resultMap.put("result", comService.ajax(request));
		
		return resultMap;
	}
	
	
}
