package prjb.com.service;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMethod;

import prjb.com.mapper.ComDao;
import prjb.com.util.ComUtil;
import prjb.com.util.HttpUtil;

@Service("OauthService")
public class OauthService {
	
	@Value("#{commonConfig['KAKAO_REST_API']}")
	private String KAKAO_REST_API;
	@Value("#{commonConfig['KAKAO_REDIRECT_URI']}")
	private String KAKAO_REDIRECT_URI;
	
	@Value("#{commonConfig['NAVER_CLIENT_ID']}")
	private String NAVER_CLIENT_ID;
	@Value("#{commonConfig['NAVER_CLIENT_SECRET']}")
	private String NAVER_CLIENT_SECRET;
	@Value("#{commonConfig['NAVER_REDIRECT_URI']}")
	private String NAVER_REDIRECT_URI;
	
	@Autowired
	ComService comService;
	
	@Autowired
	ComDao comDao;
	
	private static final Logger logger = LoggerFactory.getLogger(OauthService.class);
	
	/**
	 * 간편 회원가입처리
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	@Transactional(rollbackFor = Exception.class)
	public String registAction(HttpServletRequest request) throws Exception{
		
		String registResult = comService.registAction(request);
		
		//간편로그인 계정 연동
		if("success".equals(registResult)) {
			HttpSession session = request.getSession();
			
			String commUserId = String.valueOf(session.getAttribute("COMM_USER_ID"));
			String oauthType = String.valueOf(session.getAttribute("OAUTH_TYPE"));
			String socialId = String.valueOf(session.getAttribute("SOCIAL_ID"));
			
			Map oauthParam = new HashMap();
			oauthParam.put("OAUTH_TYPE", oauthType);
			oauthParam.put("SOCIAL_ID", socialId);
			oauthParam.put("COMM_USER_ID", commUserId);
			oauthParam.put("CID", commUserId);
			oauthParam.put("CIP", ComUtil.getAddress(request));
			comDao.insert("oauth.I_COMM_OAUTH", oauthParam);
			
		}
		
		
		return registResult;
	}
	
	/**
	 * 간편로그인 처리
	 * @param p_type
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public String login(String p_type, HttpServletRequest request) throws Exception{
		
		//1.토큰받기
		String access_token = getToken(p_type, request);
		if(access_token == null) {
			throw new Exception("토큰에러");
		}
		//2.사용자 정보받기
		Map userInfo = getUserInfo(p_type, access_token);
		if(userInfo == null) {
			throw new Exception("사용자 정보에러");
		}
		Map oauthParam = new HashMap();
		
		oauthParam.put("OAUTH_TYPE", p_type);
		
		String sucialId;
		switch (p_type) {
		case "KAKAO":
			sucialId = (String) userInfo.get("id"); 
			break;
			
		case "NAVER":
			sucialId = (String) ((Map)userInfo.get("response")).get("id");
			break;
			
		default:
			throw new Exception("등록되지않은 간편로그인");
		}
		
		oauthParam.put("SOCIAL_ID", sucialId);
		
		Map<String,String> loginResult = comDao.selectOne("oauth.S_COMM_OAUTH", oauthParam);
		
		HttpSession session = request.getSession();
		session.setAttribute(p_type + "_REFRESH_TOKEN", access_token);
		session.setAttribute("OAUTH_TYPE", p_type);
		
		//연동된 아이디가 없음
		if(loginResult == null) {
			
			session.setAttribute("SOCIAL_ID", sucialId);
			return "/oauth/regist";
		}
		else {
			comService.setSession(request, loginResult);
		}
		
		return "/";
	}
	
	//토큰받기
	public String getToken(String p_type, HttpServletRequest request) {
		
		Map httpParam = new HashMap();
		Map headerParam = new HashMap();
		Map bodyParam = new HashMap();
		
		String code = request.getParameter("code");
		String state = request.getParameter("state");
		
		headerParam.put("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		bodyParam.put("grant_type", "authorization_code");
		httpParam.put("method", RequestMethod.POST);
		
		String url = null;
		
		if(request.getLocalPort() == 80 || request.getLocalPort() == 443 ) {
			url = request.getScheme() + "://" + request.getServerName();
		}
		else {
			url = request.getScheme() + "://" + request.getServerName() + ":" + request.getLocalPort();
		}
		
		bodyParam.put("code", code);
		bodyParam.put("state", state);
		
		switch (p_type) {
		case "KAKAO":
			httpParam.put("url", "https://kauth.kakao.com/oauth/token");
			bodyParam.put("client_id", KAKAO_REST_API);
			bodyParam.put("redirect_uri", url + KAKAO_REDIRECT_URI);
			break;
			
		case "NAVER":
			httpParam.put("url", "https://nid.naver.com/oauth2.0/token");
			bodyParam.put("client_id", NAVER_CLIENT_ID);
			bodyParam.put("client_secret", NAVER_CLIENT_SECRET);
			bodyParam.put("redirect_uri", url + NAVER_REDIRECT_URI);			
			break;
			
		default:
			break;
		}
		
		Map tokenResult = HttpUtil.call(httpParam, headerParam, bodyParam);
		
		//토큰받기 오류발생
		if(!"200".equals(String.valueOf( tokenResult.get("responseCode") ))) {
			logger.info("responseCode ::: " + String.valueOf( tokenResult.get("responseCode") ));
			return null;
		}
				
		return String.valueOf( ((Map)tokenResult.get("data")).get("access_token") );
	}
	
	//사용자 조회
	public Map getUserInfo(String p_type, String p_access_token) {
		Map httpParam = new HashMap();
		Map headerParam = new HashMap();
		
		switch (p_type) {
		case "KAKAO":
			httpParam.put("url", "https://kapi.kakao.com/v2/user/me");
			break;
			
		case "NAVER":
			httpParam.put("url", "https://openapi.naver.com/v1/nid/me");		
			break;
			
		default:
			break;
		}
		
		
		httpParam.put("method", RequestMethod.GET);
		headerParam.put("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		headerParam.put("Authorization", "Bearer " + p_access_token );
		
		Map userResult = HttpUtil.call(httpParam, headerParam, null);
		//사용자 조회 오류발생
		if(!"200".equals(String.valueOf( userResult.get("responseCode") ))) {
			logger.info("responseCode ::: " + String.valueOf( userResult.get("responseCode") ));
			return null;
		}
		return (Map)userResult.get("data");
	}
	
	//연결끊기
	public void unlink(String p_type, String p_access_token) {
		Map httpParam = new HashMap();
		Map headerParam = new HashMap();
		
		httpParam.put("method", RequestMethod.POST);
		
		headerParam.put("Content-Type", "application/x-www-form-urlencoded" );
		headerParam.put("Authorization", "Bearer " + p_access_token );
		
		switch (p_type) {
		case "KAKAO":
			httpParam.put("url", "https://kapi.kakao.com/v1/user/unlink");
			break;
			
		default:
			break;
		}
		
		
		HttpUtil.call(httpParam, headerParam, null);
	}
	
	//로그아웃
	public void logout(String p_type, String p_access_token) {
		Map httpParam = new HashMap();
		Map headerParam = new HashMap();
		Map bodyParam = new HashMap();
		
		switch (p_type) {
		case "NAVER":
			httpParam.put("url", "https://nid.naver.com/oauth2.0/token");	
			bodyParam .put("client_id", NAVER_CLIENT_ID );
			bodyParam .put("client_secret", NAVER_CLIENT_SECRET );
			bodyParam .put("access_token", p_access_token );
			bodyParam .put("grant_type", "delete" );
			break;
			
		default:
			break;
		}
				
		httpParam.put("method", RequestMethod.GET);
		headerParam.put("Content-Type", "application/x-www-form-urlencoded" );
		
		HttpUtil.call(httpParam, headerParam, bodyParam);
	}

}
