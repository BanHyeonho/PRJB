package com.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.service.CommService;
import com.util.CommUtil;

@Controller("CommController")
public class CommController {

	@Autowired
	CommService commService;
	
	private static final Logger logger = LoggerFactory.getLogger(CommController.class);
	 
	/**
	 * 메인화면
	 */
	@RequestMapping(value = "/main", method = RequestMethod.GET)
	public String main(HttpServletRequest request) {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		
		return "contents/main";
	}
	
	/**
	 * 로그인 페이지이동
	 */
	@RequestMapping(value = "/loginPage", method = RequestMethod.GET)
	public String loginPage(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		
		CommUtil.getKeyPair(request);
		
		return "loginPage";
	}
	
	/**
	 * 회원가입 페이지이동
	 */
	@RequestMapping(value = "/registPage", method = RequestMethod.GET)
	public String registPage(HttpServletRequest request) {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
				
		return "registPage";
	}
	
	/**
	 * 로그인처리
	 */
	@RequestMapping(value = "/loginAction", method = RequestMethod.POST)
	public @ResponseBody Object loginAction(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		Map<String, String> resultMap = new HashMap();
		
		resultMap.put("result", commService.loginAction(request, null));
		
		return resultMap;
	}
	
	/**
	 * 회원가입 처리
	 */
	@RequestMapping(value = "/registAction", method = RequestMethod.POST)
	public @ResponseBody Object registAction(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		Map<String, String> resultMap = new HashMap();
		
		resultMap.put("result", commService.registAction(request));
		
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
	public String index(HttpServletRequest request) {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		
		
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
		
		return commService.page(request, mv);
	}
	
	/**
	 * 저장
	 * @throws Exception 
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public @ResponseBody Map save(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		Map<String, String> resultMap = new HashMap();
		
		resultMap.put("result", commService.save(request));
		
		return resultMap;
	}

	/**
	 * ajax 요청처리
	 */
	@RequestMapping(value = "/ajax")
	public @ResponseBody Map ajax(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		Map<String, Object> resultMap = new HashMap();
		
		resultMap.put("result", commService.ajax(request));
		
		return resultMap;
	}
	
	/**
	 * 다국어 갱신
	 */
	@RequestMapping(value = "/setMlg")
	public @ResponseBody Map setMlg(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		Map<String, Object> resultMap = new HashMap();
		
		commService.setMlg();
		resultMap.put("result", "success");
		
		return resultMap;
	}
	
}
