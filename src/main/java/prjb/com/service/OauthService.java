package prjb.com.service;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
import prjb.com.util.ModifiableRequest;

@Service("OauthService")
public class OauthService {
	
	//간편로그인
	@Value("#{commonConfig['KAKAO_REST_API']}")
	private String KAKAO_REST_API;
	@Value("#{commonConfig['KAKAO_REDIRECT_URI']}")
	private String KAKAO_REDIRECT_URI;
	@Value("#{commonConfig['KAKAO_ADMIN']}")
	private String KAKAO_ADMIN;
	
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
	 * 간편 로그인 연결(네이버)
	 * @param p_type
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public Map naverLink(HttpServletRequest request) throws Exception{
		
		//1.토큰받기
		Map token = getToken("NAVER", request);
		String access_token = (String)token.get("access_token");
		if(access_token == null) {
//			throw new Exception("토큰에러");
			logger.error("토큰에러");
			Map result = new HashMap();
			result.put("state", "fail");
			result.put("reason", "토큰에러");
			return result;
		}
		
		ModifiableRequest mr = new ModifiableRequest(request);
		mr.setParameter("ACCESS_TOKEN", access_token);
		mr.setParameter("OAUTH_TYPE", "NAVER");
		
		mr.setParameter("REFRESH_TOKEN", (String)token.get("refresh_token"));
		mr.setParameter("EXPIRES_IN", (String)token.get("expires_in"));
		
		//간편 로그인 연결
		return link(mr);
	}
	/**
	 * 간편 로그인 연결
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	@Transactional(rollbackFor = Exception.class)
	public Map link(HttpServletRequest request) throws Exception{
		Map result = new HashMap();
		String oauthType = request.getParameter("OAUTH_TYPE");
		String accessToken = request.getParameter("ACCESS_TOKEN");
		
		String refreshToken = request.getParameter("REFRESH_TOKEN");
		String expiresIn = request.getParameter("EXPIRES_IN");
		String reTokenExpiresIn = request.getParameter("RE_TOKEN_EXPIRES_IN");
		
		
		//사용자 정보받기
		Map userInfo = getUserInfo(oauthType, accessToken);
		
		if(userInfo == null) {
//			throw new Exception("사용자 정보에러");
			logger.error("사용자 정보에러");
			result.put("state", "fail");
			return result;
		}
		
		String commUserId = String.valueOf(request.getSession().getAttribute("COMM_USER_ID"));
		
		String socialId;
		switch (oauthType) {
		case "KAKAO":
			socialId = String.valueOf(userInfo.get("id")); 
			break;
			
		case "NAVER":
			socialId = String.valueOf( ((Map)userInfo.get("response")).get("id") );
			break;
			
		default:
			throw new Exception("등록되지않은 간편로그인");
		}
		
		//토큰저장
		Map saveTokenParam = new HashMap();
		saveTokenParam.put("OAUTH_TYPE", oauthType);
		saveTokenParam.put("ACCESS_TOKEN", accessToken);
		saveTokenParam.put("REFRESH_TOKEN", refreshToken);
		saveTokenParam.put("EXPIRES_IN", expiresIn);
		if(reTokenExpiresIn != null) {
			saveTokenParam.put("RE_EXPIRES_IN", reTokenExpiresIn);	
		}
		saveTokenParam.put("SOCIAL_ID", socialId);
		saveTokenParam.put("CIP", ComUtil.getAddress(request));
		comDao.insert("oauth.I_COMM_OAUTH_TOKEN", saveTokenParam);
		
		//인증 저장
		Map oauthParam = new HashMap();
		oauthParam.put("OAUTH_TYPE", oauthType);
		oauthParam.put("SOCIAL_ID", socialId);
		oauthParam.put("COMM_USER_ID", commUserId);
		oauthParam.put("CID", commUserId);
		oauthParam.put("CIP", ComUtil.getAddress(request));
		comDao.insert("oauth.I_COMM_OAUTH", oauthParam);
		
		result.put("state", "success");
		return result;
	}
	
	/**
	 * 간편 로그인 연결해제
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	@Transactional(rollbackFor = Exception.class)
	public Map unlink(HttpServletRequest request) throws Exception{
		
		Map result = new HashMap();
		result.put("state", "fail");
		//연결된 계정이 2개이상일경우 가능
		//연결된 계정이 1개이면서 패스워드 사용중(COMM_USER.PWD_USE_YN : 1)이면 가능
		//그외는 불가
		String type = request.getParameter("OAUTH_TYPE");
		HttpSession session = request.getSession();
		
		String commUserId = String.valueOf(session.getAttribute("COMM_USER_ID"));
		Map param = new HashMap();
		param.put("COMM_USER_ID", commUserId);
		List<Map> socialList = comDao.selectList("oauth.S_MY_SOCIAL", param);
		
		//연동된 계정이 없음
		if(socialList == null || socialList.size() == 0) {
			result.put("reason", "no_account");
			return result;	
		}
		//연결된 계정이 1개이면서 패스워드 사용중인지 체크
		else if(socialList.size() == 1){
			Map socialMap = socialList.get(0);
			if(!"1".equals( String.valueOf(socialMap.get("PWD_USE_YN")) )) {
				result.put("reason", "no_password");
				return result;
			}
			
			Optional<Map> one =  socialList.stream().filter(x-> type.equals(x.get("OAUTH_TYPE")) ).findAny();
			
			if (one.isPresent()) {
				//연결해제
				unlinkExec(type, String.valueOf(one.get().get("SOCIAL_ID")), commUserId);
	        }
			
			
		}
		//연결된 계정이 2개이상일경우 가능
		else {
			
			Optional<Map> one =  socialList.stream().filter(x-> type.equals(x.get("OAUTH_TYPE")) ).findAny();
			
			if (one.isPresent()) {
				//연결해제
				unlinkExec(type, String.valueOf(one.get().get("SOCIAL_ID")), commUserId);
	        }
			
		}
		
		result.put("state", "success");
		return result;
	}
	
	/**
	 * 간편 로그인 연결해제
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	@Transactional(rollbackFor = Exception.class)
	public void unlinkExec(String p_type, String p_socialId, String p_commUserId) throws Exception{
		
		Map httpParam = new HashMap();
		Map headerParam = new HashMap();
		Map bodyParam = new HashMap();
		
		httpParam.put("method", RequestMethod.POST);
		
		headerParam.put("Content-Type", "application/x-www-form-urlencoded" );
		Map lastToken = null;
		switch (p_type) {
		case "KAKAO":
				httpParam.put("url", "https://kapi.kakao.com/v1/user/unlink");
				headerParam.put("Authorization", "KakaoAK " + KAKAO_ADMIN);
				bodyParam.put("target_id_type", "user_id");
				bodyParam.put("target_id", p_socialId);
			break;
			
		case "NAVER":
			
				//토큰조회
				Map searchParam = new HashMap();
				searchParam.put("OAUTH_TYPE", "NAVER");
				searchParam.put("SOCIAL_ID", p_socialId); 
				lastToken = comDao.selectOne("oauth.S_COMM_OAUTH_TOKEN_LAST", searchParam);
			
				//토큰갱신
				httpParam.put("url", "https://nid.naver.com/oauth2.0/token");
				bodyParam.put("grant_type", "refresh_token");
				bodyParam.put("client_id", NAVER_CLIENT_ID);
				bodyParam.put("client_secret", NAVER_CLIENT_SECRET);
				bodyParam.put("refresh_token", URLEncoder.encode(String.valueOf(lastToken.get("REFRESH_TOKEN")), "UTF-8") );
				Map refreshResult = (Map)HttpUtil.call(httpParam, headerParam, bodyParam).get("data");
				
				httpParam.clear();
				headerParam.clear();
				bodyParam.clear();
				
				String accessToken = (String)(refreshResult).get("access_token");
				
				//토큰삭제
				httpParam.put("url", "https://nid.naver.com/oauth2.0/token");
				headerParam.put("Content-Type", "application/x-www-form-urlencoded" );
				bodyParam.put("grant_type", "delete");
				bodyParam.put("client_id", NAVER_CLIENT_ID);
				bodyParam.put("client_secret", NAVER_CLIENT_SECRET);
				bodyParam.put("access_token", URLEncoder.encode(accessToken, "UTF-8"));
				bodyParam.put("service_provider", "NAVER");
			break;
			
		}
		
		Map unlinkResult = HttpUtil.call(httpParam, headerParam, bodyParam);
		
		//오류발생
//		if(!"200".equals(String.valueOf( unlinkResult.get("responseCode") ))) {
//			logger.info("responseCode ::: " + String.valueOf( unlinkResult.get("responseCode") ));
//			throw new Exception("연결해제 실패");
//		}
		
		//연동데이터 삭제
		Map deleteMap = new HashMap();
		deleteMap.put("OAUTH_TYPE", p_type);
		deleteMap.put("SOCIAL_ID", p_socialId);
		deleteMap.put("COMM_USER_ID", p_commUserId);
		comDao.delete("oauth.D_COMM_OAUTH", deleteMap);
		
	}
	
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
		Map token = getToken(p_type, request);
		String access_token = (String)token.get("access_token");
				
		if(access_token == null) {
//			throw new Exception("토큰에러");
			logger.error("토큰에러");
			return "/";
		}
		//2.사용자 정보받기
		Map userInfo = getUserInfo(p_type, access_token);
		if(userInfo == null) {
//			throw new Exception("사용자 정보에러");
			logger.error("사용자 정보에러");
			return "/";
		}
		Map oauthParam = new HashMap();
		
		oauthParam.put("OAUTH_TYPE", p_type);
		
		String socialId;
		String expiresIn;
		String refreshToken;
		String reTokenExpiresIn = null;
		switch (p_type) {
		case "KAKAO":
			socialId = String.valueOf(userInfo.get("id"));
			
			expiresIn = String.valueOf(token.get("expires_in")); 
			refreshToken = String.valueOf(token.get("refresh_token")); 
			reTokenExpiresIn = String.valueOf(token.get("refresh_token_expires_in")); 
			break;
			
		case "NAVER":
			socialId = String.valueOf( ((Map)userInfo.get("response")).get("id") );
			
			expiresIn = String.valueOf(token.get("expires_in")); 
			refreshToken = String.valueOf(token.get("refresh_token")); 
			
			break;
			
		default:
			throw new Exception("등록되지않은 간편로그인");
		}
		
		//토큰저장
		Map saveTokenParam = new HashMap();
		saveTokenParam.put("OAUTH_TYPE", p_type);
		saveTokenParam.put("ACCESS_TOKEN", access_token);
		saveTokenParam.put("REFRESH_TOKEN", refreshToken);
		saveTokenParam.put("EXPIRES_IN", expiresIn);
		if(reTokenExpiresIn != null) {
			saveTokenParam.put("RE_EXPIRES_IN", reTokenExpiresIn);	
		}
		saveTokenParam.put("SOCIAL_ID", socialId);
		saveTokenParam.put("CIP", ComUtil.getAddress(request));
		comDao.insert("oauth.I_COMM_OAUTH_TOKEN", saveTokenParam);
		
		oauthParam.put("SOCIAL_ID", socialId);
		
		Map<String,String> loginResult = comDao.selectOne("oauth.S_COMM_OAUTH", oauthParam);
		
		HttpSession session = request.getSession();
		
		session.setAttribute("OAUTH_TYPE", p_type);
		
		//연동된 아이디가 없음
		if(loginResult == null) {
			
			session.setAttribute("SOCIAL_ID", socialId);
			return "/oauth/regist";
		}
		else {
			comService.setSession(request, loginResult);
		}
		
		return "/";
	}
	
	//토큰받기
	public Map getToken(String p_type, HttpServletRequest request) {
		
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
				
		return (Map)tokenResult.get("data");
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
