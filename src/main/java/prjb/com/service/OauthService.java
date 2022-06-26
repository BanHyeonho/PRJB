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
	
	public String login(String p_type, HttpServletRequest request) throws Exception{
		
		//1.토큰받기
		String access_token = getToken(request);

		//2.사용자 정보받기
		Map userInfo = getUserInfo(access_token);
		
		Map oauthParam = new HashMap();
		
		oauthParam.put("OAUTH_TYPE", p_type);
		oauthParam.put("SOCIAL_ID", userInfo.get("id"));
		Map<String,String> loginResult = comDao.selectOne("oauth.S_COMM_OAUTH", oauthParam);
		
		HttpSession session = request.getSession();
		//연동된 아이디가 없음
		if(loginResult == null) {
			
			session.setAttribute("OAUTH_TYPE", p_type);
			session.setAttribute("SOCIAL_ID", userInfo.get("id"));
			session.setAttribute(p_type + "_REFRESH_TOKEN", access_token);
			
			return "/oauth/regist";
		}
		else {
			comService.setSession(request, loginResult);
			session.setAttribute("OAUTH_TYPE", p_type);
			
		}
		
		return "/";
	}
	
	//토큰받기
	public String getToken(HttpServletRequest request) {
		
		Map httpParam = new HashMap();
		Map headerParam = new HashMap();
		Map bodyParam = new HashMap();
		
		String code = request.getParameter("code");
		
		httpParam.put("url", "https://kauth.kakao.com/oauth/token");
		httpParam.put("method", RequestMethod.POST);
		
		headerParam.put("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		
		bodyParam.put("grant_type", "authorization_code");
		bodyParam.put("client_id", KAKAO_REST_API);
		
		String url = null;
		if("80".equals(request.getLocalPort()) || "443".equals(request.getLocalPort())) {
			url = request.getScheme() + "://" + request.getServerName();
		}
		else {
			url = request.getScheme() + "://" + request.getServerName() + ":" + request.getLocalPort();
		}
		bodyParam.put("redirect_uri", url + KAKAO_REDIRECT_URI);
		bodyParam.put("code", code);
		
		Map tokenResult = HttpUtil.call(httpParam, headerParam, bodyParam);
		
		//토큰받기 오류발생
		if(!"200".equals(String.valueOf( tokenResult.get("responseCode") ))) {
			logger.info("responseCode ::: 200");
			return null;
		}
				
		return String.valueOf( ((Map)tokenResult.get("data")).get("access_token") );
	}
	
	//사용자 조회
	public Map getUserInfo(String p_access_token) {
		Map httpParam = new HashMap();
		Map headerParam = new HashMap();
		
		httpParam.put("url", "https://kapi.kakao.com/v2/user/me");
		httpParam.put("method", RequestMethod.GET);
		
		headerParam.put("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		headerParam.put("Authorization", "Bearer " + p_access_token );
		
		Map userResult = HttpUtil.call(httpParam, headerParam, null);
		//사용자 조회 오류발생
		if(!"200".equals(String.valueOf( userResult.get("responseCode") ))) {
			logger.info("responseCode ::: 200");
			return null;
		}
		return (Map)userResult.get("data");
	}
	
	//연결끊기
	public void unlink(String p_access_token) {
		Map httpParam = new HashMap();
		Map headerParam = new HashMap();
		
		httpParam.put("url", "https://kapi.kakao.com/v1/user/unlink");
		httpParam.put("method", RequestMethod.POST);
		
		headerParam.put("Content-Type", "application/x-www-form-urlencoded" );
		headerParam.put("Authorization", "Bearer " + p_access_token );
		
		HttpUtil.call(httpParam, headerParam, null);
	}
	
//	//로그아웃
//	public void logout(String p_access_token) {
//		Map httpParam = new HashMap();
//		Map headerParam = new HashMap();
//		Map bodyParam = new HashMap();
//		
//		//일반로그아웃
////		httpParam.put("url", "https://kapi.kakao.com/v1/user/logout");
////		httpParam.put("method", RequestMethod.POST);
////		
////		headerParam.put("Content-Type", "application/x-www-form-urlencoded" );
////		headerParam.put("Authorization", "Bearer " + p_access_token );
////		
////		HttpUtil.call(httpParam, headerParam, null);
////		
////		httpParam.clear();
////		headerParam.clear();
////		bodyParam.clear();
//		
//		httpParam.put("url", "https://kauth.kakao.com/oauth/logout");
//		httpParam.put("method", RequestMethod.GET);
//		
//		headerParam.put("Content-Type", "application/x-www-form-urlencoded" );
//		
//		bodyParam .put("client_id", KAKAO_REST_API );
//		bodyParam .put("logout_redirect_uri", "http://localhost:8080/logout");
//		
//		HttpUtil.call(httpParam, headerParam, bodyParam);
//	}

}
