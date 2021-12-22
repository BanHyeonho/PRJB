package prjb.com.service;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;

import prjb.com.init.InitBean;
import prjb.com.mapper.ComDao;
import prjb.com.util.ComUtil;
import prjb.com.util.FileUtil;

@Service("ComService")
public class ComService {
	
	@Value("#{config['file_root']}")
	private String fileRoot;
	
	@Autowired
	ComDao comDao;
		
	/**
	 * 메뉴코드로 화면 리턴
	 * @param request
	 * @param mv
	 * @return
	 * @throws Exception 
	 */
	public ModelAndView page(HttpServletRequest request, ModelAndView mv) throws Exception {
		
		Map<String, String> param = new HashMap();
		String cId = String.valueOf(request.getSession().getAttribute("COMM_USER_ID"));
		String cIp = ComUtil.getAddress(request);
		String langCode = String.valueOf(request.getSession().getAttribute("LANG_CODE"));
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
		
		String pwd = ComUtil.decrypt(request.getSession().getAttribute("privateKey").toString(), paramMap.get("PWD"));
		
		Map<String,String> salt = comDao.selectOne("com.S_SALT", paramMap);
		
		String shaPwd = ComUtil.getSHA512( pwd , salt == null ? "" : salt.get("SALT") );
		
		paramMap.put("PWD", shaPwd);
		paramMap.put("USE_YN", "1");
		
		Map<String,String> loginResult = comDao.selectOne("com.S_LOGIN", paramMap);
				
		if(loginResult == null) {
			result = "chkIdPwd";
		}
		else {
			request.getSession().setAttribute("LOGIN_SESSION_YN", "1");
			request.getSession().setAttribute("COMM_USER_ID", loginResult.get("COMM_USER_ID"));
			request.getSession().setAttribute("LOGIN_ID", loginResult.get("LOGIN_ID"));
			request.getSession().setAttribute("USER_NAME", loginResult.get("USER_NAME"));
			request.getSession().setAttribute("JOIN_DT", loginResult.get("CDT"));
			
			if( ComUtil.langKoChk(request) ) {
				request.getSession().setAttribute("LANG_CODE", "KO");	
			}else {
				request.getSession().setAttribute("LANG_CODE", "EN");
			}
			
			result = "success";
		}
		return result;
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
	 * 저장(그리드, 폼, 파일)
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	@Transactional(rollbackFor = Exception.class)
	public Map save(HttpServletRequest request) throws Exception {

		Map result = new HashMap();
		String langCode = String.valueOf(request.getSession().getAttribute("LANG_CODE"));
		String cId = String.valueOf(request.getSession().getAttribute("COMM_USER_ID"));
		String ip = ComUtil.getAddress(request);
		
		Map<String, Object> paramMap = ComUtil.getParameterMap(request, "SORT");
		
		ObjectMapper mapper = null;
		JsonNode json = null;
		ObjectReader reader = null;
		List<Map> list = null;
		for ( Map.Entry<String, Object> param : paramMap.entrySet() ) {
			
			String key = param.getKey();
			Object value = param.getValue();
			
			//그리드
			if ( key.endsWith("Grid")) {

				mapper = new ObjectMapper();
				json = mapper.readTree(String.valueOf(value));
				reader = mapper.readerFor(new TypeReference<List>() {});
				list = reader.readValue(json);
				gridSave(list, request);
			}
			//폼
			else if(key.endsWith("Form")) {
				
				Map formMap = new JSONObject(value.toString()).toMap();
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
				
				mapper = new ObjectMapper();
				json = mapper.readTree(String.valueOf(value));
				reader = mapper.readerFor(new TypeReference<List>() {});
				list = reader.readValue(json);
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
		
		String cId = String.valueOf(request.getSession().getAttribute("COMM_USER_ID"));
		
		String ip = ComUtil.getAddress(request);
		
		String tableNm = "";
		String queryId = "";
		List<Map> tableLayout = null;
		List<Map> columns = null;
		String whereQuery = "";
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
					paramMap.put("LANG_CODE", String.valueOf(request.getSession().getAttribute("LANG_CODE")));
					
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
					whereQuery = tableNm + "_ID = " + paramMap.get(tableNm + "_ID");
					paramMap.put("MID", cId);
					paramMap.put("MIP", ip);
					paramMap.put("LANG_CODE", String.valueOf(request.getSession().getAttribute("LANG_CODE")));
					
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
					paramMap.put("WHERE_QUERY", whereQuery);
					comDao.update(gridQueryId, paramMap);
					break;
					
				case "deleted":
					gridQueryId = nameSpace + ".D_" + query;
					whereQuery = tableNm + "_ID = " + paramMap.get(tableNm + "_ID");
					paramMap.put("TABLE_NAME", tableNm);
					paramMap.put("WHERE_QUERY", whereQuery);
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
		
		String langCode = String.valueOf(request.getSession().getAttribute("LANG_CODE"));
		String cId = String.valueOf(request.getSession().getAttribute("COMM_USER_ID"));
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
		
		String langCode = String.valueOf(paramMap.get("langCode"));
		String cId = String.valueOf(paramMap.get("cId"));
		String ip = String.valueOf(paramMap.get("ip"));
		
		List<Map> tableLayout = null;
		List<Map> columns = null;
		
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
					if( paramMap.get(map.get("COLUMN_NAME")) != null ) {
						Map m = new HashMap();
						m.put("COLUMN_NAME", map.get("COLUMN_NAME"));
						m.put("COLUMN_VALUE", paramMap.get(map.get("COLUMN_NAME")));
						columns.add(m);
					}
				}	
			}
			
			paramMap.put("TABLE_NAME", tableNm);
			paramMap.put("TABLE_LAYOUT", tableLayout);
			comDao.insert(queryId, paramMap);
				
			resultMap.put("state", "success");
			resultMap.put("result", paramMap);
			result = resultMap;
		}
		//UPDATE
		else if( queryId.contains(".U_")) {
			
			String whereQuery = tableNm + "_ID = " + paramMap.get(tableNm + "_ID");
			paramMap.put("MID", cId);
			paramMap.put("MIP", ip);
			paramMap.put("LANG_CODE", String.valueOf(langCode));
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
			paramMap.put("TABLE_LAYOUT", tableLayout);
			paramMap.put("WHERE_QUERY", whereQuery);
			
			comDao.update(queryId, paramMap);
			
			resultMap.put("state", "success");
			resultMap.put("result", paramMap);
			result = resultMap;
		}
		//DELETE
		else if( queryId.contains(".D_")) {
			
			String whereQuery = tableNm + "_ID = " + paramMap.get(tableNm + "_ID");
			paramMap.put("TABLE_NAME", tableNm);
			paramMap.put("WHERE_QUERY", whereQuery);
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
	 * 파일 저장
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	@Transactional(rollbackFor = Exception.class)
	public void fileSave(HttpServletRequest request,  Map fileMap) throws Exception{
		
		String moduleCode = String.valueOf(fileMap.get("MODULE_CODE"));
		String groupId = String.valueOf(fileMap.get("GROUP_ID"));
		String langCode = String.valueOf(fileMap.get("langCode"));
		String ip = String.valueOf(fileMap.get("ip"));
		String cId = String.valueOf(fileMap.get("cId"));
		String files = String.valueOf(fileMap.get("files"));

		//파일경로 윈도우 : root/모듈/소스명/년/월 예) C:/develop/files/prjb/ST/2021/05/31/암호화(20210525112412_test) --확장자는 따로저장
		Calendar cal = Calendar.getInstance(); // Calendar 객체 얻어오기 ( 시스템의 현재날짜와 시간정보 )
		String year = String.valueOf(cal.get(Calendar.YEAR)); // Calendar 인스턴스에 있는 저장된 필드 값을 가져옴
		String month = String.format("%02d", cal.get(Calendar.MONTH) + 1);
		String day = String.format("%02d", cal.get(Calendar.DATE));
		String filePath = fileRoot + moduleCode + File.separator + year +  File.separator + month +  File.separator + day +  File.separator;
				
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
		List<MultipartFile> fileList = multipartRequest.getFiles(files);

		/***** 파일읽기 *****/
		for ( MultipartFile attachedFile : fileList) {
			
			Map<String, String> uploadResult = FileUtil.fileUpload(filePath, attachedFile);
			if("success".equals(uploadResult.get("state"))) {
				
				Map<String, String> fileParam = new HashMap();
				fileParam.put("MODULE_CODE", moduleCode);
				fileParam.put("GROUP_ID", groupId);
				fileParam.put("CID", cId);
				fileParam.put("CIP", ip);
				fileParam.put("FILE_PATH", filePath);
				fileParam.put("FILE_SIZE", String.valueOf(uploadResult.get("fileSize")));
				fileParam.put("FILE_EXTENSION", uploadResult.get("fileExtension"));
				fileParam.put("FILE_NAME_ENCRYPT", uploadResult.get("fileName"));
				fileParam.put("SERVER_FILE_NAME", uploadResult.get("serverFileName"));
				fileParam.put("RANDOM_KEY", ComUtil.getRandomKey());
				
				comDao.insert("com.I_COMM_FILE", fileParam);
			}
		}
		
	}
	/**
	 * 파일 다운로드
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	@Transactional(rollbackFor = Exception.class)
	public void fileDown(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		Map param = new HashMap();
		param.put("COMM_FILE_ID", request.getParameter("COMM_FILE_ID"));
		param.put("RANDOM_KEY", request.getParameter("RANDOM_KEY"));

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
	 * 파일 삭제
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	@Transactional(rollbackFor = Exception.class)
	public void fileDelete(Map p_param) throws Exception{
		
		String COMM_FILE_ID = String.valueOf(p_param.get("COMM_FILE_ID"));
		String RANDOM_KEY = String.valueOf(p_param.get("RANDOM_KEY"));
		
		Map param = new HashMap();
		param.put("COMM_FILE_ID", COMM_FILE_ID);
		param.put("RANDOM_KEY", RANDOM_KEY);

		Map<String, String> result = comDao.selectOne("com.S_COMM_FILE_DOWN", param);
		
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
}
