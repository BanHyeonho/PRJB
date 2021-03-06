package prjb.com.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Future;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import prjb.com.init.InitBean;
import prjb.com.mapper.ComDao;
import prjb.com.util.ComUtil;
import prjb.com.util.FileUtil;

@Service("MyService")
public class MyService {
		
	@Value("#{config['file_root']}")
	private String fileRoot;
	
	@Autowired
	ComService comService;
	
	@Autowired
	ComDao comDao;
	
	@Autowired
	AsyncService asyncService;
	
	private static final Logger logger = LoggerFactory.getLogger(MyService.class);
	
	
	/**
	 * 파일관리 - 숨김항목 조회
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public Map showFolderView(HttpServletRequest request) throws Exception{
		Map result = new HashMap();
		result.put("state", "success");
		
		Map<String, String> paramMap = ComUtil.getParameterMap(request);
		HttpSession session = request.getSession();
		
		Map pwd2Param = new HashMap();
		pwd2Param.put("LOGIN_ID", session.getAttribute("LOGIN_ID"));
		pwd2Param.put("PWD2", paramMap.get("PWD2"));
		
		Map<String,String> loginResult = comService.password2Chk(session.getAttribute("privateKey").toString(), pwd2Param);
		
		//2차 패스워드 불일치
		if(loginResult == null || "null".equals(String.valueOf(loginResult.get("COMM_USER_ID")))) {
			result.put("state", "chkPwd2");
			return result;
		}
		else {
			
			String titleStr = paramMap.get("TITLE_STR");
			Map searchParam = new HashMap();
			
			searchParam.put("CID", session.getAttribute("COMM_USER_ID"));
			searchParam.put("SHOW_YN", "ALL");
			
			//전체조회
			if(titleStr == null) {
				result.put("result", comDao.selectList("my.S_FILE_MANAGE_TREE", searchParam) );
			}
			//파일명 조회
			else {
				String fileList = "";
				searchParam.put("TITLE_STR", titleStr);
				List<Map> fileItems = comDao.selectList("my.S_FILE_MANAGE_TREE_ITEM", searchParam);
				
				Set<String> fileSet = new HashSet();
				
				for (Map item : fileItems) {
					String[] keyStr = String.valueOf(item.get("KEY_STR")).split("/");
					for(int i = 0; i < keyStr.length; i++) {
						fileSet.add(keyStr[i]);
			        }
				}
				
				if(fileSet.size() > 0) {
					for (String setStr : fileSet) {
						fileList += "/" + setStr;
					}
				}
				else {
					fileList = "-1";
				}
				
				searchParam.put("FILE_LIST", fileList);
				result.put("result", comDao.selectList("my.S_FILE_MANAGE_TREE", searchParam) );
			}	
		}
		
		return result;
	}
	
	/**
	 * 파일관리 저장
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	@Transactional(rollbackFor = Exception.class)
	public Map fileManageSave(HttpServletRequest request) throws Exception {
		
		Map result = new HashMap();
		result.put("failCnt", 0);
		result.put("state", "fail");
		
		final String moduleCode = "MY";
		final String menuUrl = "fileManage";
		final String langCode = String.valueOf(request.getSession().getAttribute("LANG_CODE"));
		final String cId = String.valueOf(request.getSession().getAttribute("COMM_USER_ID"));
		final String ip = ComUtil.getAddress(request);
		
		final String filePath = FileUtil.filePath(fileRoot, moduleCode);
		
		String fileInfo = request.getParameter("fileInfo");
		
		List<Future> futures = new ArrayList<>();
		
		List<Map> fileInfoList = ComUtil.StringToList(String.valueOf(fileInfo));
		
		/**
		 *  1. 파일테이블 데이터삭제
		 *  2. 실제파일저장
		 *  3. 파일관리테이블 저장
		 *  4. 파일테이블 저장  
		 */
		
		//1. 파일테이블 데이터삭제
		String attachedFileDel = request.getParameter("attachedFileDel");
		
		List<Map> deleteList = ComUtil.StringToList(String.valueOf(String.valueOf(attachedFileDel)));
		if( deleteList != null ) {
			
			for (Map map : deleteList) {
				comService.fileDelete(map);
				
				map.put("COMM_USER_ID", cId);
				comDao.delete("my.D_FILE_MANAGE_TREE", map);
			}
		}
		
		int seq = 0;
		
		
		if(fileInfoList.size() > 0) {
			Map seqParam = new HashMap();
			seqParam.put("COMM_USER_ID", cId);
			String parantKey = String.valueOf(fileInfoList.get(0).get("PARENT_KEY_ID"));
			if( !"null".equals(parantKey) ) {
				seqParam.put("PARENT_KEY_ID", parantKey);	
			}
			Map seqMap = comDao.selectOne("my.S_MY_FILE_MANAGE_CNT", seqParam);
			seq = Integer.parseInt(ComUtil.valueOfZero(seqMap.get("SEQ")));
		}
		
		/***** 파일읽기 *****/
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
		Iterator<String> keys = multipartRequest.getFileNames();
		while( keys.hasNext() ){
			Map param = new HashMap();
			param.put("COMM_USER_ID", cId);
			param.put("IP", ip);
			param.put("MODULE_CODE", moduleCode);
			param.put("MENU_URL", menuUrl);
			param.put("SEQ", ++seq);
			
			//쓰레드 병렬처리
			futures.add(asyncFileSave(keys.next(), multipartRequest, fileInfoList, filePath, param, result));
			
	    }
		
		//쓰레드 동기화
		for (Future future : futures) {
			future.get();
		}
		
		
		if(Integer.parseInt(ComUtil.valueOfZero(result.get("failCnt"))) == 0) {
			result.put("state", "success");	
		}
		
		return result;
	}
	
	@Transactional(rollbackFor = Exception.class)
	public Future<Void> asyncFileSave(String key, MultipartHttpServletRequest multipartRequest, List<Map> fileInfoList, String filePath, Map p_param, Map p_result) {

		Future<Void> result = null;
		try {
			result = asyncService.run(() -> {
				
				MultipartFile attachedFile = multipartRequest.getFile(key);
				
		        //2. 실제파일저장
				Map<String, String> uploadResult = FileUtil.fileUpload(filePath, attachedFile);
				if("success".equals(uploadResult.get("state"))) {
				
					String keyId = null;
					String parentKeyId = null;
					
					a:for (int i = 0; i < fileInfoList.size(); i++) {
						Map info = fileInfoList.get(i);
						
						if( key.contains(String.valueOf(info.get("KEY_ID"))) ) {
							keyId = String.valueOf(info.get("KEY_ID"));
							parentKeyId = (String)info.get("PARENT_KEY_ID");
							fileInfoList.remove(i);
							break a;
						}
					}
					
					if(keyId != null) {
						String cId = String.valueOf(p_param.get("COMM_USER_ID"));
						String ip = String.valueOf(p_param.get("IP"));
						String moduleCode = String.valueOf(p_param.get("MODULE_CODE"));
						String menuUrl = String.valueOf(p_param.get("MENU_URL"));
						int seq = Integer.parseInt(ComUtil.valueOfZero(p_param.get("SEQ")));
						
						//3. 파일관리테이블 저장
						Map fileManageParam = new HashMap();
						fileManageParam.put("COMM_USER_ID", p_param.get("COMM_USER_ID"));
						fileManageParam.put("SEQ", seq);
						fileManageParam.put("KEY_ID", keyId);
						fileManageParam.put("TITLE", attachedFile.getOriginalFilename());
						fileManageParam.put("PARENT_KEY_ID", parentKeyId);
						fileManageParam.put("CID", cId);
						fileManageParam.put("CIP", p_param.get("IP"));
						
						try {
							comDao.insert("my.I_FILE_MANAGE_TREE", fileManageParam);
							String groupId = String.valueOf(fileManageParam.get("MY_FILE_MANAGE_ID"));
							
							//4. 파일테이블 저장
							comService.fileTableInsert(moduleCode, menuUrl, groupId, cId, ip, filePath
													, String.valueOf(uploadResult.get("fileSize"))
													, uploadResult.get("fileExtension")
													, uploadResult.get("fileName")
													, uploadResult.get("serverFileName")
													);
						} 
						//에러발생
						catch (Exception e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
							
							p_result.put("failCnt", Integer.parseInt( ComUtil.valueOfZero(p_result.get("failCnt")) ) +1);
						}
						
					}
					else {
						p_result.put("failCnt", Integer.parseInt( ComUtil.valueOfZero(p_result.get("failCnt")) ) +1);
					}
				}
				//실제 파일업로드 실패
				else {
					p_result.put("failCnt", Integer.parseInt( ComUtil.valueOfZero(p_result.get("failCnt")) ) +1);
				}
				
			});
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return result;

	}
}
