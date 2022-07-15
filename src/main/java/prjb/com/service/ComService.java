package prjb.com.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Future;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import prjb.com.init.InitBean;
import prjb.com.mapper.ComDao;
import prjb.com.util.ComUtil;
import prjb.com.util.CustomFile;
import prjb.com.util.FileUtil;

@Service("ComService")
public class ComService {
	
	@Value("#{config['file_root']}")
	private String fileRoot;
	
	@Value("#{config['libreOffice_path']}")
	private String libreOfficePath;
	
	//간편로그인
	private final String API_STATE_CODE = ComUtil.getRandomKey(10);
		
	@Value("#{commonConfig['NAVER_REDIRECT_URI']}")
	private String NAVER_REDIRECT_URI;
	@Value("#{commonConfig['NAVER_REDIRECT_URI_LINK']}")
	private String NAVER_REDIRECT_URI_LINK;
	
	@Autowired
	ComDao comDao;
	
	@Autowired
	AsyncService asyncService;
	
	private static final Logger logger = LoggerFactory.getLogger(ComService.class);
	
	/**
	 * 메뉴코드로 화면 리턴
	 * @param request
	 * @param mv
	 * @return
	 * @throws Exception 
	 */
	public ModelAndView page(HttpServletRequest request, ModelAndView mv) throws Exception {
		
		Map<String, String> param = new HashMap();
		HttpSession session = request.getSession();
		String cId = String.valueOf(session.getAttribute("COMM_USER_ID"));
		String cIp = ComUtil.getAddress(request);
		String langCode = String.valueOf(session.getAttribute("LANG_CODE"));
		String menuCode = String.valueOf(request.getParameter("menuCode"));
		String menuParam = String.valueOf(request.getParameter("menuParam"));
		
		param.put("MENU_CODE", menuCode);
		param.put("CID", cId);
		param.put("CIP", cIp);
		param.put("LANG_CODE", langCode);
		Map<String, String> map = comDao.selectOne("com.S_MENU_URL", param);
		
		String menuUrl = (map == null ? null : map.get("MENU_URL") );
		String menuId = (map == null ? null : String.valueOf(map.get("COMM_MENU_ID")) );
		String menuUseYn = (map == null ? null : map.get("USE_YN") );
		//메뉴url이 없는경우
		if(menuUrl == null) {
			mv.setViewName("error/404");
			return mv;
		}
		else if("0".equals(menuUseYn)) {
			mv.setViewName("error/401");
			return mv;
		}
		
		//개인정보수정 일경우 카카오 javascript key 필요
		if("my_privacyInfo".equals(menuUrl)) {
			mv.addObject("KAKAO_JAVASCRIPT", InitBean.getKAKAO_JAVASCRIPT());
			
			mv.addObject("API_STATE_CODE", API_STATE_CODE);
			mv.addObject("NAVER_CLIENT_ID", InitBean.getNAVER_CLIENT_ID());
			mv.addObject("NAVER_REDIRECT_URI", NAVER_REDIRECT_URI);
			mv.addObject("NAVER_REDIRECT_URI_LINK", NAVER_REDIRECT_URI_LINK);
			
		}
		
		
		//화면별 파라미터(설정값)
		String pageParam = map.get("ATTRIBUTE2");
		JSONObject pagePramResult = new JSONObject();
		if(pageParam != null) {
			List<String> pageParamList = Arrays.asList(pageParam.split(","));
			for (String pageParamtring : pageParamList) {
				String[] pageParamMap = pageParamtring.split("=");
				if(pageParamMap.length == 2) {
					pagePramResult.put(pageParamMap[0], pageParamMap[1]);
				}
			}
		}
		mv.addObject("pageParam", pagePramResult);
		
		
		menuParam = URLDecoder.decode(menuParam, "UTF-8");
		if(!"null".equals(menuParam)) {
			JSONObject menuPramResult = new JSONObject(menuParam);
			mv.addObject("menuParam", menuPramResult);
		}
		else {
			mv.addObject("menuParam", null);	
		}
						
		//화면별 버튼 조회
		param = new HashMap();
		param.put("CID", cId);
		param.put("COMM_MENU_ID", menuId);
		param.put("LANG_CODE", langCode);
		List<Map> btnListMap = comDao.selectList("com.S_AUTH_MENU_BTN", param);
		List btnList = new ArrayList();
		for ( Map<String, Object> listMap : btnListMap ) {
			JSONObject json = new JSONObject(listMap);
			btnList.add(json);	
		}
		mv.addObject("btnList", btnList);
		
		//화면별 그리드 조회
		List gridData = new ArrayList();
		List gridContextData = new ArrayList();
		param = new HashMap();
		param.put("MENU_CODE", menuCode);
		List<Map> masterGridList = comDao.selectList("com.S_COMM_GRID_MASTER", param);
		for (Map m : masterGridList) {
			
			m.put("CID", cId);
			Map gridContextMap = comDao.selectOne("com.S_COMM_GRID_CONTEXT_DATA", m);
			gridContextData.add(gridContextMap);
			
			m.put("LANG_CODE", langCode);
			List<Map> detailGridList = comDao.selectList("com.S_GRID_DATA", m);
			gridData.add(detailGridList);
			
			for (Map<String, String> map2 : detailGridList) {
				if("COMBO".equals(map2.get("FIELD_TYPE")) ) {
					
					map2.put("LANG_CODE", langCode);
					map2.put("USE_YN", "1");
					List<Map> comboPopupParamList = comDao.selectList("com.S_COMM_GRID_COMBO_POPUP", map2);
					Map<String, String> paramMap = new HashMap();
					paramMap.put("LANG_CODE", langCode);
					for (Map<String, String> map3 : comboPopupParamList) {
						paramMap.put(map3.get("PARAM_NAME"), map3.get("PARAM_VALUE"));
					}
					List<Map> comboPopupResult = comDao.selectList(map2.get("QUERY_ID"), paramMap);
					mv.addObject( m.get("GRID_NAME") + "." + map2.get("FIELD") + "_SOURCE", comboPopupResult);
					
				}
			}
			
		}
		mv.addObject("gridContextData", gridContextData);
		mv.addObject("gridData", gridData);
		mv.addObject("jsLink", "/viewJs/contents/" +  menuUrl.replace("_", "/") + ".js");
		mv.setViewName("contents/"+ menuUrl.replace("_", "/"));
		
		//메뉴오픈이력
		Map histParam = new HashMap();
		histParam.put("COMM_MENU_ID", menuId);
		histParam.put("COMM_USER_ID", cId);
		histParam.put("CIP", cIp);
		comDao.insert("com.I_COMM_MENU_OPEN_HIST", histParam);
		
		return mv;
	}
	
	/**
	 * 메뉴,코드,메시지 다국어 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map> getMlg(Map param) throws Exception {
		List<Map> msgList = comDao.selectList("com.S_COMM_MLG_TYPE", param);
		return msgList;
	}
	/**
	 * 다국어 갱신
	 * @throws Exception
	 */
	public void setMlg() throws Exception {
		
		List<Map> msgList = comDao.selectList("com.S_COMM_MLG", null);
		
		InitBean.msgMLGKO = new HashMap<String, Map<String, String>>();
		InitBean.msgMLGEN = new HashMap<String, Map<String, String>>();
		
		for (Map<String, String> map : msgList) {
			Map<String, String> koMap = new HashMap();	
			Map<String, String> enMap = new HashMap();
			
			koMap.put("VALUE", map.get("MLG_KO"));
			koMap.put("MENU_YN", map.get("MENU_YN"));
			koMap.put("CODE_YN", map.get("CODE_YN"));
			koMap.put("MSG_YN", map.get("MSG_YN"));
			koMap.put("GRID_YN", map.get("GRID_YN"));
			koMap.put("DESCRIPTION", map.get("DESCRIPTION"));
			InitBean.msgMLGKO.put(map.get("MLG_CODE"), koMap);
			
			enMap.put("VALUE", map.get("MLG_EN"));
			enMap.put("MENU_YN", map.get("MENU_YN"));
			enMap.put("CODE_YN", map.get("CODE_YN"));
			enMap.put("MSG_YN", map.get("MSG_YN"));
			enMap.put("GRID_YN", map.get("GRID_YN"));
			enMap.put("DESCRIPTION", map.get("DESCRIPTION"));
			InitBean.msgMLGEN.put(map.get("MLG_CODE"), enMap);
		}
	}

	/**
	 * 비밀번호 체크
	 * @param p_privateKey
	 * @param p_param
	 * @return
	 * @throws Exception 
	 */
	public Map passwordChk(String p_privateKey, Map<String, String> p_param) throws Exception {
		Map<String, String> result = null;
		
		String pwd = ComUtil.decrypt(p_privateKey, p_param.get("PWD"));
		
		Map<String,String> salt = comDao.selectOne("com.S_SALT", p_param);
		
		String shaPwd = ComUtil.getSHA512( pwd , salt == null ? "" : salt.get("SALT") );
		
		p_param.put("PWD", shaPwd);
		p_param.put("USE_YN", "1");
		result = comDao.selectOne("com.S_LOGIN", p_param);
		
		return result;
	}
	/**
	 * 2차 비밀번호 체크
	 * @param p_privateKey
	 * @param p_param ( LOGIN_ID , PWD2 )
	 * @return
	 * @throws Exception 
	 */
	public Map password2Chk(String p_privateKey, Map<String, String> p_param) throws Exception {
		Map<String, String> result = null;
		
		String pwd = ComUtil.decrypt(p_privateKey, p_param.get("PWD2"));
		
		Map<String,String> salt = comDao.selectOne("com.S_SALT", p_param);
		
		String shaPwd2 = ComUtil.getSHA512( pwd , salt.get("SALT2") );
		
		p_param.put("PWD2", shaPwd2);
		result = comDao.selectOne("com.S_PASSWORD2", p_param);
		
		return result;
	}
	/**
	 * 로그인처리
	 * @param request
	 * @param param : 회원가입후 가입한정보로 바로 로그인처리
	 * @return
	 * @throws Exception 
	 */
	@Transactional(rollbackFor = Exception.class)
	public String loginAction(HttpServletRequest request, Map param) throws Exception{
		
		Map<String, String> paramMap = (param == null ? ComUtil.getParameterMap(request) : param);
		
		String result;
		
		Map<String,String> loginResult = passwordChk(request.getSession().getAttribute("privateKey").toString(), paramMap);
				
		if(loginResult == null) {
			result = "chkIdPwd";
		}
		else {
			setSession(request, loginResult);
			result = "success";
		}
		return result;
	}

	/**
	 * 로그인후 세션값 저장
	 * @param session
	 * @param p_param(COMM_USER_ID, LOGIN_ID, USER_NAME, CDT)
	 */
	public void setSession(HttpServletRequest request, Map p_param) {
		HttpSession session = request.getSession();
		
		session.setAttribute("LOGIN_SESSION_YN", "1");
		session.setAttribute("COMM_USER_ID", p_param.get("COMM_USER_ID"));
		session.setAttribute("LOGIN_ID", p_param.get("LOGIN_ID"));
		session.setAttribute("USER_NAME", p_param.get("USER_NAME"));
		session.setAttribute("JOIN_DT", p_param.get("CDT"));
		
		if( ComUtil.langKoChk(request) ) {
			session.setAttribute("LANG_CODE", "KO");	
		}else {
			session.setAttribute("LANG_CODE", "EN");
		}
		
		
		try {
			//로그인 이력 저장
			Map logParam = new HashMap();
			logParam.put("LOGIN_ID", session.getAttribute("LOGIN_ID"));
			logParam.put("COMM_USER_ID", session.getAttribute("COMM_USER_ID"));
			logParam.put("CIP", ComUtil.getAddress(request) );
			comDao.insert("com.I_COMM_LOGIN_LOG", logParam);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	/**
	 * 회원가입처리
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	@Transactional(rollbackFor = Exception.class)
	public String registAction(HttpServletRequest request) throws Exception{
		
		Map<String, String> paramMap = ComUtil.getParameterMap(request);
		
		String result;
		String originPwd;
		String pwd;
		
		originPwd = paramMap.get("PWD");
		pwd = ComUtil.decrypt(request.getSession().getAttribute("privateKey").toString(), originPwd);

		String salt = ComUtil.getSalt();
		String encrytPwd = ComUtil.getSHA512( pwd , salt);
		String ip = ComUtil.getAddress(request);
		
		paramMap.put("SALT", salt);
		paramMap.put("PWD", encrytPwd);
		
		paramMap.put("CIP", ip);
		paramMap.put("MIP", ip);
		try {
			//사용자테이블
			comDao.insert("com.I_COMM_USER", paramMap);
			//패스워드SALT
			comDao.insert("com.I_SALT", paramMap);
			//초기권한(일반사용자/ID:2)
			comDao.insert("com.I_ADD_AUTH_GROUP_USER", paramMap);
			paramMap.put("PWD", originPwd);
			result = loginAction(request, paramMap);
		}
		catch (DuplicateKeyException e) {
			result = "duplicatedId";
		}
		
		return result;
	}

	/**
	 * 개인정보 변경
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	@Transactional(rollbackFor = Exception.class)
	public Map chgPrivacy(HttpServletRequest request) throws Exception{
		
		Map paramMap = ComUtil.getParameterMap(request);
		
		Map result = new HashMap();
		
		HttpSession session = request.getSession();
		String ip = ComUtil.getAddress(request);
		String id = String.valueOf(session.getAttribute("COMM_USER_ID"));
		
		paramMap.put("COMM_USER_ID", id);
		paramMap.put("MID", id);
		paramMap.put("MIP", ip);
		
		String privateKey = session.getAttribute("privateKey").toString();
		
		String oldPwd = String.valueOf(paramMap.get("OLD_PWD"));
		String newPwd = String.valueOf(paramMap.get("NEW_PWD"));
		String pwd2 = String.valueOf(paramMap.get("PWD2"));
		
		//1.비밀번호 변경
		if(!"null".equals(String.valueOf(oldPwd))
		&& !"null".equals(String.valueOf(newPwd))
		) {
			
			//현재패스워드 유효성 검사
			Map oldPwdParam = new HashMap();
			oldPwdParam.put("PWD", oldPwd);
			oldPwdParam.put("LOGIN_ID", session.getAttribute("LOGIN_ID"));
			Map oldResult = passwordChk(privateKey, oldPwdParam);
			
			//현재패스워드 불일치
			if(oldResult == null) {
				result.put("state", "password_wrong");
				return result;
			}
			
			//현재패스워드 변경
			newPwd = ComUtil.decrypt(privateKey, newPwd);

			String salt = ComUtil.getSalt();
			String encrytPwd = ComUtil.getSHA512( newPwd , salt);
			
			paramMap.put("SALT", salt);
			paramMap.put("PWD", encrytPwd);
			
			paramMap.put("TYPE", "PWD1");
			
			comDao.update("com.U_PASSWORD", paramMap);
				
		}
		
		//2. 2차 비밀번호 변경
		if(!"null".equals(String.valueOf(pwd2))
		) {

			//2차 비밀번호 변경
			pwd2 = ComUtil.decrypt(privateKey, pwd2);

			String salt = ComUtil.getSalt();
			String encrytPwd = ComUtil.getSHA512( pwd2 , salt);
			
			paramMap.put("SALT2", salt);
			paramMap.put("PWD2", encrytPwd);
			
			paramMap.put("TYPE", "PWD2");
			
			comDao.update("com.U_PASSWORD", paramMap);
				
		}
		
		//3.개인정보 변경
		String userName = (String)paramMap.get("USER_NAME");
		String email = (String)paramMap.get("EMAIL");
		String nickName = (String)paramMap.get("NICKNAME");
		
		if(paramMap.get("PROFILE_PICTURE") != null) {
			paramMap.put("PROFILE_PICTURE", ((MultipartFile)paramMap.get("PROFILE_PICTURE")).getBytes() );	
		}
		
		paramMap.put("USER_NAME", userName);
		paramMap.put("EMAIL", email);
		paramMap.put("NICKNAME", nickName);
		
		comDao.update("com.U_PRIVACY", paramMap);
				
		result.put("state", "success");
		return result;
	}
	
	/**
	 * 저장(그리드, 폼, 파일)
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	@Transactional(rollbackFor = Exception.class)
	public Map save(HttpServletRequest request) throws Exception {

		Map result = new HashMap();
		
		HttpSession session = request.getSession();
		
		String langCode = String.valueOf(session.getAttribute("LANG_CODE"));
		String cId = String.valueOf(session.getAttribute("COMM_USER_ID"));
		String ip = ComUtil.getAddress(request);
		
		LinkedHashMap<String, Object> paramMap = (LinkedHashMap)ComUtil.getParameterMap(request, "SORT");
		
		List<Map> list = null;
		for ( Map.Entry<String, Object> param : paramMap.entrySet() ) {
			
			String key = param.getKey();
			Object value = param.getValue();
			
			//그리드
			if ( key.endsWith("Grid")) {
				list = ComUtil.StringToList(String.valueOf(value));
				gridSave(list, request);
			}
			//폼
			else if(key.endsWith("Form")) {
				
				Map formMap = new JSONObject(value.toString()).toMap();
				
				
				if(formMap.get("GET_PARAM") != null) {
					
					Map<String, String> getParam = (Map)formMap.get("GET_PARAM");
					for ( Map.Entry<String, String> p : getParam.entrySet() ) {
						String paramKey = p.getKey();
						String[] paramValue = p.getValue().split("[.]");
						formMap.put(paramKey, ((Map)((Map)result.get(paramValue[0])).get("result")).get(paramValue[1]) );
					}
				}

				formMap.put("langCode", langCode);
				formMap.put("ip", ip);
				formMap.put("cId", cId);
				
				result.put(key, ajaxExec(formMap));
			}
			//파일
			else if(key.endsWith("File")) {
				
				Map fileMap = new JSONObject(value.toString()).toMap();
				if(fileMap.get("GET_PARAM") != null) {
					
					Map<String, String> getParam = (Map)fileMap.get("GET_PARAM");
					for ( Map.Entry<String, String> p : getParam.entrySet() ) {
						String paramKey = p.getKey();
						String[] paramValue = p.getValue().split("[.]");
						fileMap.put(paramKey, ((Map)((Map)result.get(paramValue[0])).get("result")).get(paramValue[1]) );
					}
				}
				
				fileMap.put("langCode", langCode);
				fileMap.put("ip", ip);
				fileMap.put("cId", cId);
				fileMap.put("files", key);
				fileSave(request, fileMap);
				
			}
			//파일 삭제
			else if(key.endsWith("FileDel")) {
				
				list = ComUtil.StringToList(String.valueOf(value));
				for (Map map : list) {
					fileDelete(map);
				}
			}	
		}
		
		return result;
	}
	
	/**
	 * 그리드 저장
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	@Transactional(rollbackFor = Exception.class)
	public String gridSave(List<Map> param, HttpServletRequest request) throws Exception{
		
		HttpSession session = request.getSession();
		String cId = String.valueOf(session.getAttribute("COMM_USER_ID"));
		
		String ip = ComUtil.getAddress(request);
		
		String tableNm = "";
		String queryId = "";
		List<Map> tableLayout = null;
		List<Map> columns = null;
		String tablePk = "";
		if(param.size() > 0) {
			Map<String, String> m = param.get(0);
			tableNm = m.get("TABLE_NAME");
			queryId = m.get("QUERY_ID");
			
			if("com.COMM_QUERY".equals(queryId)) {
				Map colParam = new HashMap();
				colParam.put("TABLE_NAME", tableNm);
				tableLayout = comDao.selectList("com.S_COLUMNS", colParam);
			}
			
		}
			
		for (int i = 1; i < param.size(); i++) {
			
			Map paramMap = param.get(i);
			String gridQueryId = queryId;
			String nameSpace = queryId.substring(0,queryId.indexOf("."));
			String query = queryId.substring(queryId.indexOf(".")+1);
			switch (String.valueOf(paramMap.get("gState"))) {
			
				case "inserted":
					gridQueryId = nameSpace + ".I_" + query;
					paramMap.put("CID", cId);
					paramMap.put("MID", cId);
					paramMap.put("CIP", ip);
					paramMap.put("MIP", ip);
					paramMap.put("CDT", "SYSDATE");
					paramMap.put("MDT", "SYSDATE");
					paramMap.put("LANG_CODE", String.valueOf(session.getAttribute("LANG_CODE")));
					
					if(tableLayout != null) {
						columns = new ArrayList();
						for (Map map : tableLayout) {
							if( paramMap.get(map.get("COLUMN_NAME")) != null ) {
								Map m = new HashMap();
								m.put("COLUMN_NAME", map.get("COLUMN_NAME"));
								m.put("COLUMN_VALUE", paramMap.get(map.get("COLUMN_NAME")));
								columns.add(m);
							}
						}
					}
					paramMap.put("TABLE_NAME", tableNm);					
					paramMap.put("TABLE_LAYOUT", columns);
					comDao.insert(gridQueryId, paramMap);
					break;
					
				case "updated":
					gridQueryId = nameSpace + ".U_" + query;
					tablePk = tableNm + "_ID";
					paramMap.put("MID", cId);
					paramMap.put("MIP", ip);
					paramMap.put("MDT", "SYSDATE");
					paramMap.put("LANG_CODE", String.valueOf(session.getAttribute("LANG_CODE")));
					
					if(tableLayout != null) {
						columns = new ArrayList();
						for (Map map : tableLayout) {
							if( paramMap.get(map.get("COLUMN_NAME")) != null ) {
								Map m = new HashMap();
								m.put("COLUMN_NAME", map.get("COLUMN_NAME"));
								m.put("COLUMN_VALUE", paramMap.get(map.get("COLUMN_NAME")));								
								columns.add(m);
							}
						}
					}
					paramMap.put("TABLE_NAME", tableNm);
					paramMap.put("TABLE_LAYOUT", columns);
					paramMap.put("TABLE_PK", tablePk);
					paramMap.put("TABLE_PK_VAL", paramMap.get(tableNm + "_ID"));
					comDao.update(gridQueryId, paramMap);
					break;
					
				case "deleted":
					gridQueryId = nameSpace + ".D_" + query;
					tablePk = tableNm + "_ID";
					paramMap.put("TABLE_NAME", tableNm);
					paramMap.put("TABLE_PK", tablePk);
					paramMap.put("TABLE_PK_VAL", paramMap.get(tableNm + "_ID"));
					comDao.delete(gridQueryId, paramMap);
					break;
			}
		}
			
		
		return "success";
	}
	
	/**
	 * ajax요청처리
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@Transactional(rollbackFor = Exception.class)
	public Object ajax(HttpServletRequest request) throws Exception{
		Object result = null;
		HttpSession session = request.getSession();
		String langCode = String.valueOf(session.getAttribute("LANG_CODE"));
		String cId = String.valueOf(session.getAttribute("COMM_USER_ID"));
		String ip = ComUtil.getAddress(request);
		Map<String, Object> paramMap = ComUtil.getParameterMap(request, "SORT");
		
		String queryId = (String)paramMap.get("QUERY_ID");
		
		//queryId 가 없는경우 멀티ajax
		if(queryId == null) {
			
			result = new HashMap();
			for ( Map.Entry<String, Object> param : paramMap.entrySet() ) {
				String key = param.getKey();
				JSONObject json = new JSONObject(param.getValue().toString());
				Map p = json.toMap();
				
				p.put("langCode", langCode);
				p.put("ip", ip);
				p.put("cId", cId);
				((Map)result).put(key, ajaxExec(p));				
			}
		}
		else {
			
			paramMap.put("langCode", langCode);
			paramMap.put("ip", ip);
			paramMap.put("cId", cId);
			result = ajaxExec(paramMap);
			
		}
		
		return result;
	}
	
	/**
	 * ajax요청처리실행
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@Transactional(rollbackFor = Exception.class)
	public Object ajaxExec(Map<String, Object> paramMap) throws Exception{
		Object result = null;
		Map resultMap = new HashMap();
		
		String queryId = String.valueOf(paramMap.get("QUERY_ID"));
		String tableNm = String.valueOf(paramMap.get("TABLE_NAME"));
		
		String commUserId = String.valueOf(paramMap.get("cId"));
		String langCode = String.valueOf(paramMap.get("langCode"));
		String cId = String.valueOf(paramMap.get("cId"));
		String ip = String.valueOf(paramMap.get("ip"));
		
		List<Map> tableLayout = null;
		List<Map> columns = null;
		
		paramMap.put("COMM_USER_ID", commUserId);
		
		//공통쿼리일경우
		if(queryId.endsWith("COMM_QUERY")) {
			Map colParam = new HashMap();
			colParam.put("TABLE_NAME", tableNm);
			tableLayout = comDao.selectList("com.S_COLUMNS", colParam);
		}
		
		//SELECT
		if(queryId.contains(".S_")) {
			
			paramMap.put("CID", cId);
			paramMap.put("LANG_CODE", String.valueOf(langCode));
			
			result = comDao.selectList(queryId, paramMap);
			
		}
		//INSERT
		else if ( queryId.contains(".I_") ) {

			paramMap.put("CID", cId);
			paramMap.put("MID", cId);
			paramMap.put("CIP", ip);
			paramMap.put("MIP", ip);
			paramMap.put("LANG_CODE", String.valueOf(langCode));
			if(tableLayout != null) {
				columns = new ArrayList();
				for (Map map : tableLayout) {
					if( (tableNm + "_ID").equals(map.get("COLUMN_NAME"))
					|| "CDT".equals(map.get("COLUMN_NAME")) || "MDT".equals(map.get("COLUMN_NAME"))
					|| paramMap.get(map.get("COLUMN_NAME")) != null
					) {
						Map m = new HashMap();
						m.put("COLUMN_NAME", map.get("COLUMN_NAME"));
						m.put("COLUMN_VALUE", paramMap.get(map.get("COLUMN_NAME")));
						columns.add(m);
					}
				}	
			}
			
			paramMap.put("TABLE_NAME", tableNm);
			paramMap.put("TABLE_LAYOUT", columns);
			comDao.insert(queryId, paramMap);
				
			resultMap.put("state", "success");
			resultMap.put("result", paramMap);
			result = resultMap;
		}
		//UPDATE
		else if( queryId.contains(".U_")) {
			
			String tablePk = tableNm + "_ID";
			paramMap.put("MID", cId);
			paramMap.put("MIP", ip);
			paramMap.put("LANG_CODE", String.valueOf(langCode));
			if(tableLayout != null) {
				columns = new ArrayList();
				for (Map map : tableLayout) {
					if( "MDT".equals(map.get("COLUMN_NAME")) 
					 || paramMap.get(map.get("COLUMN_NAME")) != null
					) {
						Map m = new HashMap();
						m.put("COLUMN_NAME", map.get("COLUMN_NAME"));
						m.put("COLUMN_VALUE", paramMap.get(map.get("COLUMN_NAME")));
						columns.add(m);
					}
				}
			}
			paramMap.put("TABLE_NAME", tableNm);
			paramMap.put("TABLE_LAYOUT", columns);
			paramMap.put("TABLE_PK", tablePk);
			paramMap.put("TABLE_PK_VAL", paramMap.get(tableNm + "_ID"));
			comDao.update(queryId, paramMap);
			
			resultMap.put("state", "success");
			resultMap.put("result", paramMap);
			result = resultMap;
		}
		//DELETE
		else if( queryId.contains(".D_")) {
			
			String tablePk = tableNm + "_ID";
			paramMap.put("TABLE_NAME", tableNm);
			paramMap.put("TABLE_PK", tablePk);
			paramMap.put("TABLE_PK_VAL", paramMap.get(tableNm + "_ID"));
			comDao.delete(queryId, paramMap);
			
			resultMap.put("state", "success");
			resultMap.put("result", paramMap);
			result = resultMap;
		}
		//PROCEDURE
		else if( queryId.contains(".P_")) {
			
			paramMap.put("CID", cId);
			paramMap.put("MID", cId);
			paramMap.put("CIP", ip);
			paramMap.put("MIP", ip);
			paramMap.put("LANG_CODE", String.valueOf(langCode));
			resultMap = comDao.selectOne(queryId, paramMap);
			
			resultMap = (resultMap == null) ? new HashMap() : resultMap;
			
			resultMap.put("state", "success");
			result = resultMap;
		}
		
		return result;
	}
	
	/**
	 * 테이블 데이터 암/복호화
	 * @param request
	 * @param type : true-암호화 / false-복호화
	 * @return
	 * @throws Exception
	 */
//	@Transactional(rollbackFor = Exception.class) 최대열기커서수 오류로 인해 트랜잭션 처리하지않는다.
	public Map tableCrypto(HttpServletRequest request, boolean type) throws Exception{
		Map result = new HashMap();
		String tableNm = request.getParameter("TABLE_NAME");
		
		Map colParam = new HashMap();
		colParam.put("TABLE_NAME", tableNm);
		List<Map> columnList = comDao.selectList("com.S_CRYPTO_COLUMNS", colParam);
		
		List<String> encryptArray = InitBean.encryptArray;
		
		List<Map> encryptList = new ArrayList();
		
		boolean noTarget = true;
		for (String item : encryptArray) {
			
			Optional<Map> target = columnList.stream().filter( x -> item.equals(x.get("COLUMN_NAME")) ).findAny();
			
			if (target.isPresent()) {
				noTarget = false;
				encryptList.add(target.get());
	        }
		}

		//암호화대상이 없음
		if(noTarget) {
			result.put("state", "no_target");
			return result;
		}
				
		Map dataParam = new HashMap();
		dataParam.put("TABLE_NAME", tableNm);
		dataParam.put("columnList", encryptList);
		List<Map> tableDataList = comDao.selectList("com.S_ALL_TABLE_SELECT", dataParam);
		
		List<Future> futures = new ArrayList<>();
		//암호화
		//전체데이터를 다시 업데이트해서 자동으로 암호화 적용
		if(type) {
			
			for (Map dataMap : tableDataList) {
				futures.add(tableEncrypt(tableNm, encryptList, dataMap));
			}
			
		}
		//복호화
		//전체데이터컬럼을 _DECRYPT 로 명칭변경후 다시 업데이트하여 복호화적용.
		else {
			for (Map dataMap : tableDataList) {
				futures.add(tableDecrypt(tableNm, encryptList, dataMap));
			}
		}
		
		//쓰레드 동기화
		for (Future future : futures) {
			future.get();
		}
				
		result.put("state", "success");
		return result;
	}
	/**
	 * 테이블 암호화 병렬처리
	 * @param p_tableNm : 테이블명
	 * @param p_encryptList : 암호화컬럼
	 * @param p_dataMap : 데이터
	 * @return
	 */
	public Future<Void> tableEncrypt(String p_tableNm, List<Map> p_encryptList, Map p_dataMap) {
		Future<Void> result = null;
		
		result = asyncService.run(() -> {
			
			Map updateParam = new HashMap();
			List columns = new ArrayList();
			
			for (Map col : p_encryptList) {
				Map m = new HashMap();
				m.put("COLUMN_NAME", col.get("COLUMN_NAME"));
				m.put("COLUMN_VALUE", p_dataMap.get(col.get("COLUMN_NAME")));								
				columns.add(m);
			}
			
			updateParam.put("TABLE_NAME", p_tableNm);
			updateParam.put("TABLE_LAYOUT", columns);
			
			updateParam.put("TABLE_PK", p_tableNm + "_ID");
			updateParam.put("TABLE_PK_VAL", p_dataMap.get(p_tableNm + "_ID"));
			
			try {
				comDao.update("com.U_COMM_QUERY", updateParam);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		});

		return result;
	}
	/**
	 * 테이블 복호화 병렬처리
	 * @param p_tableNm : 테이블명
	 * @param p_encryptList : 암호화컬럼
	 * @param p_dataMap : 데이터
	 * @return
	 */
	public Future<Void> tableDecrypt(String p_tableNm, List<Map> p_encryptList, Map p_dataMap){
		Future<Void> result = null;
		
		result = asyncService.run(() -> {
			
			Map updateParam = new HashMap();
			List columns = new ArrayList();
			
			for (Map col : p_encryptList) {
				Map m = new HashMap();
				m.put("COLUMN_NAME", col.get("COLUMN_NAME"));
				m.put("CRYPTO_VALUE", p_dataMap.get(col.get("COLUMN_NAME")));								
				columns.add(m);
			}
			
			updateParam.put("TABLE_NAME", p_tableNm);
			updateParam.put("TABLE_LAYOUT", columns);
			
			updateParam.put("TABLE_PK", p_tableNm + "_ID");
			updateParam.put("TABLE_PK_VAL", p_dataMap.get(p_tableNm + "_ID"));
			
			try {
				comDao.update("com.U_ALL_TABLE_DECRYPT", updateParam);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		});

		return result;
	}
	
	/**
	 * 파일 저장
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	@Transactional(rollbackFor = Exception.class)
	public void fileSave(HttpServletRequest request,  Map fileMap) throws Exception{
		
		String moduleCode = String.valueOf(fileMap.get("MODULE_CODE"));
		String menuUrl = String.valueOf(fileMap.get("MENU_URL"));
		String groupId = String.valueOf(fileMap.get("GROUP_ID"));
		String langCode = String.valueOf(fileMap.get("langCode"));
		String ip = String.valueOf(fileMap.get("ip"));
		String cId = String.valueOf(fileMap.get("cId"));
		String files = String.valueOf(fileMap.get("files"));

		String filePath = FileUtil.filePath(fileRoot, moduleCode);
			
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
		List<MultipartFile> fileList = multipartRequest.getFiles(files);

		/***** 파일읽기 *****/
		for ( MultipartFile attachedFile : fileList) {
			
			Map<String, String> uploadResult = FileUtil.fileUpload(filePath, attachedFile);
			if("success".equals(uploadResult.get("state"))) {
				
				fileTableInsert(moduleCode, menuUrl, groupId, cId, ip, filePath
								, String.valueOf(uploadResult.get("fileSize"))
								, uploadResult.get("fileExtension")
								, uploadResult.get("fileName")
								, uploadResult.get("serverFileName")
								);
			}
		}
		
	}
	public void fileTableInsert(String moduleCode, String menuUrl, String groupId, String cId, String ip, String filePath
								, String fileSize, String fileExtension, String fileName, String serverFileName) throws Exception {
		
		Map<String, String> fileParam = new HashMap();
		fileParam.put("MODULE_CODE", moduleCode);
		fileParam.put("MENU_URL", menuUrl);
		fileParam.put("GROUP_ID", groupId);
		fileParam.put("CID", cId);
		fileParam.put("CIP", ip);
		fileParam.put("FILE_PATH", filePath);
		fileParam.put("FILE_SIZE", fileSize);
		fileParam.put("FILE_EXTENSION", fileExtension);
		fileParam.put("FILE_NAME_ENCRYPT", fileName);
		fileParam.put("SERVER_FILE_NAME", serverFileName);
		fileParam.put("RANDOM_KEY", ComUtil.getRandomKey());
		
		comDao.insert("com.I_COMM_FILE", fileParam);
	}
	
	/**
	 * 파일다운로드 로그 저장
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public Map fileDownLog(HttpServletRequest request) throws Exception{
				
		Map v_param = new HashMap();
		v_param.put("COMM_USER_ID", String.valueOf(request.getSession().getAttribute("COMM_USER_ID")));
		v_param.put("MODULE_CODE", request.getParameter("MODULE_CODE"));
		v_param.put("MENU_URL", request.getParameter("MENU_URL"));
		v_param.put("CIP", ComUtil.getAddress(request));
		v_param.put("fileData", String.valueOf(request.getParameter("fileData")));
		v_param.put("COMM_FILE_ID", request.getParameter("COMM_FILE_ID"));
		v_param.put("RANDOM_KEY", request.getParameter("RANDOM_KEY"));
		
		return fileDownLog(v_param);
	}
	public Map fileDownLog(Map p_param) throws Exception{
		
		final int keyLenth = 7;
		
		Map param = new HashMap();
		
		param.put("COMM_USER_ID", String.valueOf(p_param.get("COMM_USER_ID")));
		param.put("MODULE_CODE", p_param.get("MODULE_CODE"));
		param.put("MENU_URL", p_param.get("MENU_URL"));
		param.put("CIP", p_param.get("CIP"));
		
		String DOWNLOAD_KEY = ComUtil.getRandomKey(keyLenth) + System.currentTimeMillis();
		
		param.put("DOWNLOAD_KEY", DOWNLOAD_KEY);
		
		List<Map> fileDataList = ComUtil.StringToList( String.valueOf( p_param.get("fileData") ) );

		if(fileDataList != null && fileDataList.size() > 0) {
			param.put("FILE_LIST", fileDataList);
		}
		else {
			param.put("COMM_FILE_ID", p_param.get("COMM_FILE_ID"));
			param.put("RANDOM_KEY", p_param.get("RANDOM_KEY"));
		}
		
//		개발환경에서는 로그를 저장하지 않는다.(로그테이블에 다운로드키가 있기때문에 저장해야한다)
//		if( !"0:0:0:0:0:0:0:1".equals(p_param.get("CIP")) ) {
			//파일다운로드 로그 저장
			comDao.insert("com.I_COMM_FILE_DOWN_LOG", param);	
//		}
		
		return param;
	}
	/**
	 * 파일 다운로드
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	public void fileDown(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		Map param = fileDownLog(request);
		
		Map result = comDao.selectOne("com.S_COMM_FILE_DOWN", param);

		//db에 파일정보가 없을경우
		if (result == null || result.size() == 0 ) {
			response.setContentType("text/html");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write("<script>alert('can not find a file');</script>");
			return;
		}
		
		Map fileMap = new HashMap();
		fileMap.put("FILE_PATH", result.get("FILE_PATH"));
		fileMap.put("SERVER_FILE_NAME", result.get("SERVER_FILE_NAME"));
		fileMap.put("FILE_NAME", result.get("FILE_NAME"));
		fileMap.put("BROWSER", ComUtil.getBrowser(request));
		boolean downResult = FileUtil.fileDownload(fileMap, response);

		//서버에 파일 없을경우		
		if (!downResult) {
			response.setContentType("text/html");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write("<script>alert('can not find a file');</script>");
			return;
		}
		
	}
	
	/**
	 * 파일 압축 다운로드
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	public void zipFileDownload(HttpServletRequest request, HttpServletResponse response) throws Exception{
		final String encodingType = "UTF-8";
		List<File> Files = new ArrayList();
		String zipName = URLDecoder.decode(request.getParameter("zipFileName"), encodingType);
		String downloadKey = URLDecoder.decode(request.getParameter("DOWNLOAD_KEY"), encodingType);
		
		String commUserId = String.valueOf(request.getSession().getAttribute("COMM_USER_ID"));
				
		Map param = new HashMap();
		param.put("COMM_USER_ID", commUserId);
		param.put("DOWNLOAD_KEY", downloadKey);
		
		List<Map> result = comDao.selectList("com.S_COMM_FILE_DOWN", param);
		
		for (Map<String, String> fileMap : result) {
			String path = fileMap.get("FILE_PATH");
			String fileName = fileMap.get("FILE_NAME");
			String fileExtension = fileMap.get("FILE_EXTENSION");
			String serverFileName = fileMap.get("SERVER_FILE_NAME");
			
			CustomFile f = new CustomFile(path + serverFileName);
			f.setFileDownName(fileName);
			Files.add(f);	
		}
				
		FileUtil.zipFileDownload(request, response, zipName, Files);
	}
	
	/**
	 * 파일 삭제
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	@Transactional(rollbackFor = Exception.class)
	public void fileDelete(Map p_param) throws Exception{
		
		Object COMM_FILE_ID = p_param.get("COMM_FILE_ID");
		
		if(COMM_FILE_ID == null) {
			return;
		}
		
		String RANDOM_KEY = String.valueOf(p_param.get("RANDOM_KEY"));
		
		Map param = new HashMap();
		param.put("COMM_FILE_ID", COMM_FILE_ID);
		param.put("RANDOM_KEY", RANDOM_KEY);

		Map<String, String> result = comDao.selectOne("com.S_COMM_FILE_DELETE_INFO", param);
		
		if (result == null || result.size() == 0 ) {
			return;
		}
		else {
			comDao.delete("com.D_COMM_FILE", param);	
		}
		
		Map<String, String> fileChk = comDao.selectOne("com.S_COMM_FILE_DELETE_CHK", result);
		int fileUseCnt = Integer.parseInt(String.valueOf(fileChk.get("CNT")));

		//해당파일을 참조하는 데이터가 있는경우 실파일을 삭제하지 않는다.
		if(fileUseCnt == 0) {
			Map fileMap = new HashMap();
			fileMap.put("FILE_PATH", result.get("FILE_PATH"));
			fileMap.put("SERVER_FILE_NAME", result.get("SERVER_FILE_NAME"));
			FileUtil.fileDelete(result.get("FILE_PATH"), result.get("SERVER_FILE_NAME"));	
		}
		
	}
	
	/**
	 * 파일 읽기
	 * @param response
	 * @param file
	 * @throws Exception
	 */
	public void readFile(HttpServletResponse response, String file) throws Exception{
		
		response.setCharacterEncoding("UTF-8");
//		response.setContentType( "image/gif" );
		
		ServletOutputStream sOs = null;
		
		try (FileInputStream f = new FileInputStream(file);
		){
			
			sOs = response.getOutputStream();
			int length;
			byte[] buffer = new byte[10];
			while ( ( length = f.read( buffer ) ) != -1 ){
				sOs.write( buffer, 0, length );
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			sOs.close();
		}
		
	}
	
	/**
	 * 파일 미리보기
	 *
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	public void preview(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		Map param = fileDownLog(request);
		
		Map fileData = comDao.selectOne("com.S_COMM_FILE_DOWN", param);

		String filePath = String.valueOf(fileData.get("FILE_PATH")) + String.valueOf(fileData.get("SERVER_FILE_NAME"));
		
		readFile(response, filePath);
		
	}
		
	/**
	 * LibreOffice 로 pdf 로 변환 후 미리보기
	 *
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	public void librePreview(HttpServletRequest request, HttpServletResponse response) throws Exception {

		String COMM_FILE_ID = request.getParameter("COMM_FILE_ID");
		String RANDOM_KEY = request.getParameter("RANDOM_KEY");

		Map param = fileDownLog(request);

		Map fileData = comDao.selectOne("com.S_COMM_FILE_DOWN", param);

		String originFile = String.valueOf(fileData.get("FILE_PATH")) + String.valueOf(fileData.get("SERVER_FILE_NAME"));

		String newFilePath = fileRoot + "tmp" + File.separator;

		Map<String, String> fileNames = FileUtil.fileName(String.valueOf(fileData.get("FILE_NAME")));
		String newFileName = fileNames.get("SERVER_FILE_NAME") + ".pdf";

		//pdf파일생성
		FileUtil.makePDF(libreOfficePath, originFile, newFilePath + newFileName);
		
		//생성된 pdf파일 읽기
		readFile(response, newFilePath + newFileName);
		
		//생성했던 pdf파일 삭제
		FileUtil.fileDelete(newFilePath, newFileName);
		
	}
	
	/**
	 * 썸네일 생성 후 미리보기
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	public void thumbnailPreview(HttpServletRequest request, HttpServletResponse response) throws Exception {

		String COMM_FILE_ID = request.getParameter("COMM_FILE_ID");
		String RANDOM_KEY = request.getParameter("RANDOM_KEY");
		
		int WIDTH = Integer.parseInt(ComUtil.valueOfZero(request.getParameter("WIDTH")));
		int HEIGHT = Integer.parseInt(ComUtil.valueOfZero(request.getParameter("HEIGHT")));
		
		Map param = fileDownLog(request);

		Map fileData = comDao.selectOne("com.S_COMM_FILE_DOWN", param);

		String fileExtension = String.valueOf(fileData.get("FILE_EXTENSION")).toLowerCase();
		
		String originFile = String.valueOf(fileData.get("FILE_PATH")) + String.valueOf(fileData.get("SERVER_FILE_NAME"));

		String newFilePath = fileRoot + "tmp" + File.separator;

		Map<String, String> fileNames = FileUtil.fileName(String.valueOf(fileData.get("FILE_NAME")));
		String newFileName = fileNames.get("SERVER_FILE_NAME");

		//썸네일 생성
		FileUtil.makeThumbnail(originFile, newFilePath + newFileName, WIDTH, HEIGHT, fileExtension);
		
		//생성된 파일 읽기
		readFile(response, newFilePath + newFileName);
		
		//생성했던 파일 삭제
		FileUtil.fileDelete(newFilePath, newFileName);
		
	}
	
}
