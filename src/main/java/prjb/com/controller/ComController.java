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
import org.springframework.web.servlet.ModelAndView;

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
	 * 개인정보 수정
	 */
	@RequestMapping(value = "/chgPrivacy", method = RequestMethod.POST)
	public @ResponseBody Object chgPrivacy(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		Map<String, String> resultMap = comService.chgPrivacy(request);
		return resultMap;
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
		Map<String, Object> resultMap = new HashMap();
		
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
	
	/**
	 * 파일다운로드
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/fileDownload", method = RequestMethod.GET)
	public void fileDownload(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		comService.fileDown(request, response);
	}
	
	/**
	 * 파일다운로드 로그 / 다운로드 키 생성
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/createDownloadKey", method = RequestMethod.POST)
	public @ResponseBody Map createDownloadKey(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		
		Map<String, Object> resultMap = new HashMap();
				
		resultMap.put("result", comService.fileDownLog(request).get("DOWNLOAD_KEY"));
		
		return resultMap;
	}
	
	/**
	 * 파일 압축 다운로드
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/zipFileDownload", method = RequestMethod.GET)
	public void zipFileDownload(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		comService.zipFileDownload(request, response);
				
	}
	
	/**
	 * 에디터
	 */
	@RequestMapping(value = "/editor", method = RequestMethod.GET)
	public String editor(HttpServletRequest request, Model m) {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		String domain = request.getRequestURL().toString().replace(request.getRequestURI(), "");
		m.addAttribute("domain", domain);
		return "/editor";
	}
	
	/**
	 * 에디터 이미지
	 */
	@RequestMapping(value = "/ckeditor/image", method = RequestMethod.POST)
	public @ResponseBody Map editorImage(HttpServletRequest request) {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		return new HashMap();
	}
	
	/**
	 * 썸네일 생성 후 미리보기
	 */
	@ResponseBody
	@RequestMapping(value = "/thumbnailPreview", method = RequestMethod.GET)
	public void thumbnailPreview(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		comService.thumbnailPreview(request, response);
	}
	
	/**
	 * 파일 미리보기
	 */
	@ResponseBody
	@RequestMapping(value = "/preview", method = RequestMethod.GET)
	public void imgPreview(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		comService.preview(request, response);
	}
	
	/**
	 * LibreOffice 로 pdf 로 변환후 미리보기
	 */
	@ResponseBody
	@RequestMapping(value = "/librePreview", method = RequestMethod.GET)
	public void librePreview(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		comService.librePreview(request, response); 
	}
	
}
