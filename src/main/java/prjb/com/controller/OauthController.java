package prjb.com.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import prjb.com.service.OauthService;

/**
 * oauth 간편로그인
 * @author Administrator
 *
 */
@RequestMapping("/oauth")
@Controller("OauthController")
public class  OauthController{

	@Autowired
	OauthService oauthService;
	
	private static final Logger logger = LoggerFactory.getLogger(OauthController.class);
	
	/**
	 * 간편 회원가입 페이지이동
	 */
	@RequestMapping(value = "/regist", method = RequestMethod.GET)
	public String registPage(HttpServletRequest request, Model m) {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		m.addAttribute("jsLink", "/viewJs/oauthRegist.js");
		return "oauthRegist";
	}
	
	/**
	 * 간편 회원가입 처리
	 */
	@RequestMapping(value = "/registAction", method = RequestMethod.POST)
	public @ResponseBody Object registAction(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		Map<String, String> resultMap = new HashMap();
		
		resultMap.put("result", oauthService.registAction(request));
		
		return resultMap;
	}
	
	/**
	 * 카카오 간편로그인
	 * @throws Exception 
	 */
	@RequestMapping(value = "/login/kakao", method = RequestMethod.GET)
	public String loginKakao(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		
		return "redirect:" + oauthService.login("KAKAO", request);
	}
	
	/**
	 * 네이버 간편로그인
	 * @throws Exception 
	 */
	@RequestMapping(value = "/login/naver", method = RequestMethod.GET)
	public String loginNaver(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		
		return "redirect:" + oauthService.login("NAVER", request);
	}
	
	/**
	 * 간편 로그인 연결해제
	 */
	@RequestMapping(value = "/unlink", method = RequestMethod.POST)
	public @ResponseBody Object unlink(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		
		return oauthService.unlink(request);
	}
	
	/**
	 * 간편 로그인 연결
	 */
	@RequestMapping(value = "/link", method = RequestMethod.POST)
	public @ResponseBody Object link(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		
		return oauthService.link(request);
	}
	
	/**
	 * 간편 로그인 연결(네이버)
	 */
	@RequestMapping(value = "/link/naver", method = RequestMethod.GET)
	public String naverLink(HttpServletRequest request, Model m) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		Map result = oauthService.naverLink(request);
		
		m.addAttribute("state", result.get("state"));
		m.addAttribute("type", "/link/naver");
		return "closePopup";
	}
}
