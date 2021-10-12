package prjb.com.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;

import prjb.com.init.InitBean;
import prjb.com.mapper.ComDao;
import prjb.com.util.ComUtil;

@Service("ComService")
public class ComService {
	
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
		param.put("MENU_CODE", request.getParameter("menuCode"));
		param.put("CID", String.valueOf(request.getSession().getAttribute("COMM_USER_ID")));
		param.put("CIP", ComUtil.getAddress(request));
		param.put("LANG_CODE", String.valueOf(request.getSession().getAttribute("LANG_CODE")));
		Map<String, String> map = comDao.selectOne("com.S_MENU_URL", param);
		
		String menuUrl = (map == null ? null : map.get("MENU_URL") );
		//메뉴url이 없는경우
		if(menuUrl == null) {
			mv.setViewName("error/404");
			return mv;
		}
		//메뉴등록
		else if("comm_menuRegist".equals(menuUrl)){
			
			Map<String, Map<String,String>> msgMap = ComUtil.langKoChk(request) ? InitBean.msgMLGKO : InitBean.msgMLGEN;
			List<Map<String, String>> menuLang = new ArrayList();
			Iterator<String> keys = msgMap.keySet().iterator();
	        while( keys.hasNext() ){
	            String key = keys.next();
	            if("1".equals(msgMap.get(key).get("MENU_YN"))) {
	            	
	            	param = new HashMap();
	            	param.put("MLG_CODE", key);
	            	param.put("VALUE", msgMap.get(key).get("VALUE"));
	            	menuLang.add(param);
	            	
	            }
	        }
	        
			mv.addObject("menuLang", menuLang);
		}
		//공통코드
		else if("comm_commCode".equals(menuUrl)){
			
			Map<String, Map<String,String>> msgMap = ComUtil.langKoChk(request) ? InitBean.msgMLGKO : InitBean.msgMLGEN;
			List<Map<String, String>> menuLang = new ArrayList();
			Iterator<String> keys = msgMap.keySet().iterator();
	        while( keys.hasNext() ){
	            String key = keys.next();
	            if("1".equals(msgMap.get(key).get("CODE_YN"))) {
	            	
	            	param = new HashMap();
	            	param.put("MLG_CODE", key);
	            	param.put("VALUE", msgMap.get(key).get("VALUE"));
	            	menuLang.add(param);
	            	
	            }
	        }
	        
			mv.addObject("codeLang", menuLang);
		}
		//그리드관리
		else if("comm_gridManage".equals(menuUrl)){
			
			Map<String, Map<String,String>> msgMap = ComUtil.langKoChk(request) ? InitBean.msgMLGKO : InitBean.msgMLGEN;
			List<Map<String, String>> lang = new ArrayList();
			Iterator<String> keys = msgMap.keySet().iterator();
	        while( keys.hasNext() ){
	            String key = keys.next();
	            if("1".equals(msgMap.get(key).get("GRID_YN"))) {
	            	
	            	param = new HashMap();
	            	param.put("MLG_CODE", key);
	            	param.put("VALUE", msgMap.get(key).get("VALUE"));
	            	lang.add(param);
	            	
	            }
	        }
	        
			mv.addObject("gridLang", lang);
		}
		
		//화면별 그리드 조회
		List gridData = new ArrayList();
		List gridContextData = new ArrayList();
		param = new HashMap();
		param.put("MENU_CODE", request.getParameter("menuCode"));
		List<Map> masterGridList = comDao.selectList("com.S_COMM_GRID_MASTER", param);
		for (Map m : masterGridList) {
			
			Map gridContextMap = comDao.selectOne("com.S_COMM_GRID_CONTEXT_DATA", m);
			gridContextData.add(gridContextMap);
			
			m.put("LANG_CODE", String.valueOf(request.getSession().getAttribute("LANG_CODE")));
			List<Map> detailGridList = comDao.selectList("com.S_GRID_DATA", m);
			gridData.add(detailGridList);
			
			for (Map<String, String> map2 : detailGridList) {
				if("COMBO".equals(map2.get("FIELD_TYPE")) ) {
					
//					if( !"null".equals(String.valueOf(map2.get("QUERY_ID"))) ) {
						map2.put("LANG_CODE", String.valueOf(request.getSession().getAttribute("LANG_CODE")));
						map2.put("USE_YN", "1");
						List<Map> comboPopupParamList = comDao.selectList("com.S_COMM_GRID_COMBO_POPUP", map2);
						Map<String, String> paramMap = new HashMap();
						paramMap.put("LANG_CODE", String.valueOf(request.getSession().getAttribute("LANG_CODE")));
						for (Map<String, String> map3 : comboPopupParamList) {
							paramMap.put(map3.get("PARAM_NAME"), map3.get("PARAM_VALUE"));
						}
						List<Map> comboPopupResult = comDao.selectList(map2.get("QUERY_ID"), paramMap);
						mv.addObject( m.get("GRID_NAME") + "." + map2.get("FIELD") + "_SOURCE", comboPopupResult);
//					}
					
				}
			}
			
		}
		mv.addObject("gridContextData", gridContextData);
		mv.addObject("gridData", gridData);
		
		mv.setViewName("contents/"+ menuUrl.replace("_", "/"));
		
		//메뉴오픈이력
		Map histParam = new HashMap();
		histParam.put("COMM_MENU_ID", map.get("COMM_MENU_ID"));
		histParam.put("COMM_USER_ID", String.valueOf(request.getSession().getAttribute("COMM_USER_ID")));
		histParam.put("CIP", ComUtil.getAddress(request));
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
		String pwd;
		try {
			pwd = ComUtil.decrypt(request.getSession().getAttribute("privateKey").toString(), paramMap.get("PWD"));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new Exception("JAVA-0001");
		}
		
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
		try {
			originPwd = paramMap.get("PWD");
			pwd = ComUtil.decrypt(request.getSession().getAttribute("privateKey").toString(), originPwd);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new Exception("JAVA-0001");
		}
		
		String salt = ComUtil.getSalt();
		String encrytPwd = ComUtil.getSHA512( pwd , salt);
		String ip = ComUtil.getAddress(request);
		
		paramMap.put("SALT", salt);
		paramMap.put("PWD", encrytPwd);
		
		paramMap.put("CIP", ip);
		paramMap.put("MIP", ip);
		try {
			comDao.insert("com.I_COMM_USER", paramMap);
			comDao.insert("com.I_SALT", paramMap);
			paramMap.put("PWD", originPwd);
			result = loginAction(request, paramMap);
		}
		catch (DuplicateKeyException e) {
			result = "duplicatedId";
		}
		catch (Exception e) {
			e.printStackTrace();
			throw new Exception(e.getMessage());
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
	public String save(HttpServletRequest request) throws Exception {
		
		Map<String, Object> paramMap = ComUtil.getParameterMap(request, "SORT");
		
		for ( Map.Entry<String, Object> param : paramMap.entrySet() ) {
			
			String key = param.getKey();
			Object value = param.getValue();
			
			//그리드
			if ( key.endsWith("Grid")) {

				ObjectMapper mapper = new ObjectMapper();
				JsonNode json = mapper.readTree(String.valueOf(value));
				ObjectReader reader = mapper.readerFor(new TypeReference<List>() {});
				List<Map> list = reader.readValue(json);
				
				gridSave(list, request);
			}
			//폼
			else if(key.endsWith("Form")) {
				
			}
			//파일
			else if(key.endsWith("File")) {
				
			}
						
		}
		
		return "success";
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
		List<Map> tableLayout = new ArrayList();
		String whereQuery = "";
		if(param.size() > 0) {
			Map<String, String> m = param.get(0);
			tableNm = m.get("TALBE_NAME");
			queryId = m.get("QUERY_ID");
			
			if("com.COMM_QUERY".equals(queryId)) {
				Map colParam = new HashMap();
				colParam.put("TALBE_NAME", tableNm);
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
					for (Map map : tableLayout) {
						
						map.put("COLUMN_VALUE", "".equals(paramMap.get(map.get("COLUMN_NAME"))) ? null : paramMap.get(map.get("COLUMN_NAME")) );
					}
					paramMap.put("TALBE_NAME", tableNm);
					paramMap.put("TABLE_LAYOUT", tableLayout);
					comDao.insert(gridQueryId, paramMap);
					break;
					
				case "updated":
					gridQueryId = nameSpace + ".U_" + query;
					whereQuery = tableNm + "_ID = " + paramMap.get(tableNm + "_ID");
					paramMap.put("MID", cId);
					paramMap.put("MIP", ip);
					paramMap.put("LANG_CODE", String.valueOf(request.getSession().getAttribute("LANG_CODE")));
					for (Map map : tableLayout) {
						map.put("COLUMN_VALUE", "".equals(paramMap.get(map.get("COLUMN_NAME"))) ? null : paramMap.get(map.get("COLUMN_NAME")) );
					}
					paramMap.put("TALBE_NAME", tableNm);
					paramMap.put("TABLE_LAYOUT", tableLayout);
					paramMap.put("WHERE_QUERY", whereQuery);
					comDao.update(gridQueryId, paramMap);
					break;
					
				case "deleted":
					gridQueryId = nameSpace + ".D_" + query;
					whereQuery = tableNm + "_ID = " + paramMap.get(tableNm + "_ID");
					paramMap.put("TALBE_NAME", tableNm);
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
		
		String cId = String.valueOf(request.getSession().getAttribute("COMM_USER_ID"));
		String ip = ComUtil.getAddress(request);
		Map<String, Object> paramMap = ComUtil.getParameterMap(request);
		
		String tableNm = String.valueOf(paramMap.get("TALBE_NAME"));
		String queryId = String.valueOf(paramMap.get("QUERY_ID"));
		List<Map> tableLayout = null;
		
		//공통쿼리일경우
		if(queryId.endsWith("COMM_QUERY")) {
			Map colParam = new HashMap();
			colParam.put("TALBE_NAME", tableNm);
			tableLayout = comDao.selectList("com.S_COLUMNS", colParam);
		}
		
		//SELECT
		if(queryId.contains(".S_")) {
			
			paramMap.put("CID", cId);
			paramMap.put("LANG_CODE", String.valueOf(request.getSession().getAttribute("LANG_CODE")));
			
			result = comDao.selectList(queryId, paramMap);
			
		}
		//INSERT
		else if ( queryId.contains(".I_") ) {

			paramMap.put("CID", cId);
			paramMap.put("MID", cId);
			paramMap.put("CIP", ip);
			paramMap.put("MIP", ip);
			paramMap.put("LANG_CODE", String.valueOf(request.getSession().getAttribute("LANG_CODE")));
			for (Map map : tableLayout) {
				map.put("COLUMN_VALUE", "".equals(paramMap.get(map.get("COLUMN_NAME"))) ? null : paramMap.get(map.get("COLUMN_NAME")) );
			}
			paramMap.put("TALBE_NAME", tableNm);
			paramMap.put("TABLE_LAYOUT", tableLayout);
			comDao.insert(queryId, paramMap);
				
			result = "success";
		}
		//UPDATE
		else if( queryId.contains(".U_")) {
			
			String whereQuery = tableNm + "_ID = " + paramMap.get(tableNm + "_ID");
			paramMap.put("MID", cId);
			paramMap.put("MIP", ip);
			paramMap.put("LANG_CODE", String.valueOf(request.getSession().getAttribute("LANG_CODE")));
			for (Map map : tableLayout) {
				map.put("COLUMN_VALUE", "".equals(paramMap.get(map.get("COLUMN_NAME"))) ? null : paramMap.get(map.get("COLUMN_NAME")) );
			}
			paramMap.put("TALBE_NAME", tableNm);
			paramMap.put("TABLE_LAYOUT", tableLayout);
			paramMap.put("WHERE_QUERY", whereQuery);
			
			comDao.update(queryId, paramMap);
			
			result = "success";
		}
		//DELETE
		else if( queryId.contains(".D_")) {
			
			String whereQuery = tableNm + "_ID = " + paramMap.get(tableNm + "_ID");
			paramMap.put("TALBE_NAME", tableNm);
			paramMap.put("WHERE_QUERY", whereQuery);
			comDao.delete(queryId, paramMap);
			
			result = "success";
		}
		//PROCEDURE
		else if( queryId.contains(".P_")) {
			
			paramMap.put("CID", cId);
			paramMap.put("MID", cId);
			paramMap.put("CIP", ip);
			paramMap.put("MIP", ip);
			paramMap.put("LANG_CODE", String.valueOf(request.getSession().getAttribute("LANG_CODE")));
			comDao.selectOne(queryId, paramMap);
			
			result = "success";
		}
		
		return result;
	}
}
