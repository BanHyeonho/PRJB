package prjb.com.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import prjb.com.init.InitBean;
import prjb.com.service.ComService;
import prjb.com.service.OauthService;
import prjb.com.util.ComUtil;


@Controller("ComController")
public class ComController {

	//간편로그인
	private final static String API_STATE_CODE = ComUtil.getRandomKey(10);
	
	@Value("#{commonConfig['KAKAO_REST_API']}")
	private String KAKAO_REST_API;
	@Value("#{commonConfig['KAKAO_REDIRECT_URI']}")
	private String KAKAO_REDIRECT_URI;
		
	@Value("#{commonConfig['NAVER_CLIENT_SECRET']}")
	private String NAVER_CLIENT_SECRET;
	@Value("#{commonConfig['NAVER_CLIENT_ID']}")
	private String NAVER_CLIENT_ID;
	@Value("#{commonConfig['NAVER_REDIRECT_URI']}")
	private String NAVER_REDIRECT_URI;
	
	
	@Autowired
	ComService comService;
	
	@Autowired
	OauthService oauthService;
	
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
		
		m.addAttribute("API_STATE_CODE", API_STATE_CODE);
		
		m.addAttribute("KAKAO_REST_API", KAKAO_REST_API);
		m.addAttribute("KAKAO_REDIRECT_URI", KAKAO_REDIRECT_URI);
		
		m.addAttribute("NAVER_CLIENT_ID", NAVER_CLIENT_ID);
		m.addAttribute("NAVER_REDIRECT_URI", NAVER_REDIRECT_URI);
		
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
		
		HttpSession session = request.getSession();
		
		session.invalidate();
		
		return "redirect:/loginPage";
	}
	
	/**
	 * 메인화면 호출
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String index(HttpServletRequest request, Model m) {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		m.addAttribute("jsLink", "/viewJs/index.js");
		
		m.addAttribute("KAKAO_REST_API", KAKAO_REST_API);
		m.addAttribute("KAKAO_REDIRECT_URI", KAKAO_REDIRECT_URI);
		
		m.addAttribute("NAVER_CLIENT_ID", NAVER_CLIENT_ID);
		m.addAttribute("NAVER_REDIRECT_URI", NAVER_REDIRECT_URI);
		
		m.addAttribute("OAUTH_TYPE", request.getSession().getAttribute("OAUTH_TYPE"));
		
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
	 * 테이블데이터 암호화
	 */
	@RequestMapping(value = "/encrypt", method = RequestMethod.POST)
	public @ResponseBody Map encrypt(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		return comService.tableCrypto(request, true);
	}
	/**
	 * 테이블데이터 복호화
	 */
	@RequestMapping(value = "/decrypt", method = RequestMethod.POST)
	public @ResponseBody Map decrypt(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		return comService.tableCrypto(request, false);
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
