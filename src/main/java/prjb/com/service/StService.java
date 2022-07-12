package prjb.com.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Future;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import prjb.com.mapper.ComDao;
import prjb.com.util.ComUtil;
import prjb.com.util.FileUtil;

@Service("StService")
public class StService {
	
	@Value("#{config['file_root']}")
	private String fileRoot;
	
	@Autowired
	ComDao comDao;
	
	@Autowired
	ComService comService;
	
	@Autowired
	AsyncService asyncService;
	
	@Autowired
	ExceptionService exceptionService;
	
	
	private static final Logger logger = LoggerFactory.getLogger(StService.class);
	
	/**
	 * 비디오 스트리밍
	 */
	public ResponseEntity<ResourceRegion> getVideo(HttpHeaders headers, HttpServletRequest request) throws Exception {
		
		String fileInfo = request.getParameter("fileInfo");
		Map fileMap = new JSONObject(fileInfo.toString()).toMap();
		
		String commFileId = String.valueOf(fileMap.get("COMM_FILE_ID"));
		String randomKey = String.valueOf(fileMap.get("RANDOM_KEY"));
		String moduleCode = String.valueOf(fileMap.get("MODULE_CODE"));
		String menuUrl = String.valueOf(fileMap.get("MENU_URL"));
		
		String contextFileId = String.valueOf(request.getServletContext().getAttribute("COMM_FILE_ID"));
		String contextRandomKey = String.valueOf(request.getServletContext().getAttribute("RANDOM_KEY"));
		
		String fileData = null;
		
		if(commFileId.equals(contextFileId)
		&& randomKey.equals(contextRandomKey)
		) {
			fileData = String.valueOf(request.getServletContext().getAttribute("FILE_DATA"));
		}
		else {

			Map logParam = new HashMap();
			logParam.put("COMM_USER_ID", String.valueOf(request.getSession().getAttribute("COMM_USER_ID")));
			logParam.put("MODULE_CODE", moduleCode);
			logParam.put("MENU_URL", menuUrl);
			logParam.put("CIP", ComUtil.getAddress(request));
			logParam.put("COMM_FILE_ID", commFileId);
			logParam.put("RANDOM_KEY", randomKey);
			
			Map param = comService.fileDownLog(logParam);
			Map result = comDao.selectOne("com.S_COMM_FILE_DOWN", param);
			
			if(result == null) {
				request.getServletContext().setAttribute("COMM_FILE_ID", null);
				request.getServletContext().setAttribute("RANDOM_KEY", null);
				request.getServletContext().setAttribute("FILE_DATA", null);
			}
			else {
				request.getServletContext().setAttribute("COMM_FILE_ID", commFileId);
				request.getServletContext().setAttribute("RANDOM_KEY", randomKey);
				
				String filePath = String.valueOf(result.get("FILE_PATH"));
				String fileNm = String.valueOf(result.get("SERVER_FILE_NAME"));
				fileNm = URLEncoder.encode(fileNm, "UTF-8"); //UrlResource 는 파일명에 '%' 가 들어가는경우 오류
				fileData = filePath + fileNm;
				request.getServletContext().setAttribute("FILE_DATA", fileData);
			}
		}

		UrlResource video = new UrlResource("file:" + fileData);
		
//		fileData = "C:\\develop\\files\\prjb\\xy4qMzyV4GHTwnH9SXxS+GXYa82ot+xxH+c+rM98Itycrp+L1+eZPZDMNHBA8x7yxB0SEFoNySo8KDmbjKOZwLD33SXtWMNiKtsXYC7RgyhDddCPFQHGAmtazOOLpmAY";
//		Resource video = new FileSystemResource(fileData);	//속도이슈 때문에 사용하지않음.
		
		ResourceRegion resourceRegion;
		final long chunkSize = 1000000L;
		long contentLength = video.contentLength(); 
		Optional<HttpRange> optional = headers.getRange().stream().findFirst(); 
		HttpRange httpRange;
		
		if (optional.isPresent()){
			httpRange = optional.get();
			long start = httpRange.getRangeStart(contentLength);
			long end = httpRange.getRangeEnd(contentLength);
			long rangeLength = Long.min(chunkSize, end - start + 1);
			resourceRegion = new ResourceRegion(video, start, rangeLength);
		}
		else {
			long rangeLength = Long.min(chunkSize, contentLength);
			resourceRegion = new ResourceRegion(video, 0, rangeLength);
		}
		return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).contentType(MediaTypeFactory.getMediaType(video).orElse(MediaType.APPLICATION_OCTET_STREAM)).body(resourceRegion);
	}
	
	/**
	 * 자막파일
	 */
	public Resource subtitle(HttpServletRequest request) throws Exception {
		
		String subTitleInfo = request.getParameter("subTitleInfo");
		Map subTitleMap = new JSONObject(subTitleInfo.toString()).toMap();
		
		String moduleCode = String.valueOf(subTitleMap.get("MODULE_CODE"));
		String menuUrl = String.valueOf(subTitleMap.get("MENU_URL"));
		String commFileId = String.valueOf(subTitleMap.get("COMM_FILE_ID"));
		String randomKey = String.valueOf(subTitleMap.get("RANDOM_KEY"));
				
		Map logParam = new HashMap();
		logParam.put("COMM_USER_ID", String.valueOf(request.getSession().getAttribute("COMM_USER_ID")));
		logParam.put("MODULE_CODE", moduleCode);
		logParam.put("MENU_URL", menuUrl);
		logParam.put("CIP", ComUtil.getAddress(request));
		logParam.put("COMM_FILE_ID", commFileId);
		logParam.put("RANDOM_KEY", randomKey);
		
		Map param = comService.fileDownLog(logParam);
		
		Map result = comDao.selectOne("com.S_COMM_FILE_DOWN", param);
		
		String filePath = String.valueOf(result.get("FILE_PATH"));
		String fileNm = String.valueOf(result.get("SERVER_FILE_NAME"));				
				
//		fileData = "C:\\develop\\files\\prjb\\eeVnA4fWJgZdxXMFDQF2vTKpzP7UUqBNkax1GXaoDMrblEaC9jlaW6tjm2Ryn19NwU37EePKVjyMmDYzaLP72w%3D%3D";
		
		Resource video = new FileSystemResource(filePath + fileNm);
		
		return video;
	}
	
	/**
	 * 파일변환
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	@Transactional(rollbackFor = Exception.class)
	public Map convert(HttpServletRequest request) throws Exception{
		Map result = new HashMap();
		Map<String, String> paramMap = ComUtil.getParameterMap(request);
		
		final String cId = String.valueOf(request.getSession().getAttribute("COMM_USER_ID"));
		final String ip = ComUtil.getAddress(request);
		
		String ids = String.valueOf(paramMap.get("IDS"));
		
		Map filesParam = new HashMap();
		filesParam.put("ST_FILE_CONVERT_IDS", ids);
		List<Map> convertFiles = comDao.selectList("st.S_ST_FILE_CONVERT_PROCESSING", filesParam);
				
		List<Future> futures = convert(convertFiles, result, cId, ip);
		
		//쓰레드 동기화
//		for (Future future : futures) {
//			future.get();
//		}
		
//		if("null".equals(String.valueOf(result.get("state")))) {
			result.put("state", "success");
//		}
		return result;
	}
	public List<Future> convert(List<Map> convertFiles, Map result, String cId, String ip) {
		List<Future> futures = new ArrayList<>();
		
		for (Map fileInfo : convertFiles) {
			
			Map fileType = new HashMap();
			fileType.put("type", String.valueOf(fileInfo.get("FILE_TYPE")).toUpperCase());
			fileType.put("extension", String.valueOf(fileInfo.get("FILE_EXTENSION")).toLowerCase());
			
			Map param = new HashMap();
			
			param.put("COMM_USER_ID", cId);
			param.put("IP", ip);
			param.put("ST_FILE_CONVERT_ID", String.valueOf(fileInfo.get("ST_FILE_CONVERT_ID")));
			param.put("MODULE_CODE", String.valueOf(fileInfo.get("MODULE_CODE")));
			param.put("GROUP_ID", String.valueOf(fileInfo.get("GROUP_ID")));
			param.put("MENU_URL", String.valueOf(fileInfo.get("MENU_URL")));
			param.put("FILE_NAME", String.valueOf(fileInfo.get("FILE_NAME")));
			param.put("FILE_PATH", String.valueOf(fileInfo.get("FILE_PATH")));
			param.put("SERVER_FILE_NAME", String.valueOf(fileInfo.get("SERVER_FILE_NAME")));
			
			//쓰레드 병렬처리
			futures.add(asyncConvert(result, fileType, param));
			
		}

		return futures;
	}
		
	/**
	 * 파일변환 쓰레드
	 * @param p_result : 결과값
	 * @param p_fileType : 파일구분(자막/영상), 파일확장자
	 * @param p_param : COMM_USER_ID, IP, MODULE_CODE, GROUP_ID, MENU_URL, FILE_NAME, FILE_PATH, SERVER_FILE_NAME
	 * @return
	 */
	@Transactional(rollbackFor = Exception.class)
	public Future<Void> asyncConvert(Map p_result, Map p_fileType, Map p_param) {

		Future<Void> result = asyncService.run(() -> {
			
				String type = String.valueOf(p_fileType.get("type"));
				String extension = String.valueOf(p_fileType.get("extension"));
				
				String resultFileExtension = "SUB".equals(type) ? "vtt" : "mp4";
				String cId = String.valueOf(p_param.get("COMM_USER_ID"));
				String ip = String.valueOf(p_param.get("IP"));
				
				
				String stFileConvertId = String.valueOf(p_param.get("ST_FILE_CONVERT_ID"));
				String originModuleCode = String.valueOf(p_param.get("MODULE_CODE"));
				String originGroupId = String.valueOf(p_param.get("GROUP_ID"));
				String originMenuUrl = String.valueOf(p_param.get("MENU_URL"));
				
				//상태 변경 (진행대기 -> 진행)
				Map fileConvertParam = new HashMap();
				fileConvertParam.put("MID", cId);
				fileConvertParam.put("MIP", ip);
				fileConvertParam.put("ST_FILE_CONVERT_ID", stFileConvertId);
				try {
					fileConvertParam.put("STATE_CODE", "PROCESSING");
					comDao.update("st.U_ST_FILE_CONVERT", fileConvertParam);
				} catch (Exception e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
					return;
				}
				
				
				String fileName = String.valueOf(p_param.get("FILE_NAME"));
				String originFilePath = String.valueOf(p_param.get("FILE_PATH")) + String.valueOf(p_param.get("SERVER_FILE_NAME"));
				        
		  		String filePath = FileUtil.filePath(fileRoot, "ST");
				
				Map<String, String> fileResult = new HashMap();
				
				if("mp4".equals(resultFileExtension)) {
					fileResult = FileUtil.fileConvert(originFilePath, filePath, fileName, resultFileExtension);
				}
				else {
					switch (extension) {
					case "srt":
						fileResult = srtToVtt(originFilePath, filePath, fileName);
						break;
					case "smi":
						fileResult = smiToVtt(originFilePath, filePath, fileName);
						break;
					}
				}
				
				
				try {
					
			        if("success".equals(fileResult.get("state"))) {
			        	
			        	switch (originMenuUrl) {
			        	//파일관리
						case "fileManage":
							Map afterParam = new HashMap();	
							afterParam.put("GROUP_ID", originGroupId);
							afterParam.put("KEY_ID", String.valueOf(System.currentTimeMillis()));
							
							comDao.insert("my.I_ST_FILE_CONVERT_AFTER", afterParam);
							
							originGroupId = String.valueOf(afterParam.get("MY_FILE_MANAGE_ID"));
							break;
						}
			        	
			        	Map<String, String> fileMapping = new HashMap();	
						fileMapping.put("MODULE_CODE", originModuleCode);
						fileMapping.put("GROUP_ID", originGroupId);
						fileMapping.put("MENU_URL", originMenuUrl);
						fileMapping.put("CID", cId);
						fileMapping.put("CIP", ip);
						fileMapping.put("FILE_PATH", filePath);
						fileMapping.put("FILE_SIZE", String.valueOf(fileResult.get("fileSize")));
						fileMapping.put("FILE_EXTENSION", fileResult.get("fileExtension"));
						fileMapping.put("FILE_NAME_ENCRYPT", fileResult.get("fileName"));
						fileMapping.put("SERVER_FILE_NAME", fileResult.get("serverFileName"));
						fileMapping.put("RANDOM_KEY", ComUtil.getRandomKey());
						
						comDao.insert("com.I_COMM_FILE", fileMapping);
						
						fileMapping.put("MID", cId);
						fileMapping.put("MIP", ip);
						fileMapping.put("STATE_CODE", "COMPLETE");
						fileMapping.put("ST_FILE_CONVERT_ID", stFileConvertId);
						comDao.update("st.U_ST_FILE_CONVERT", fileMapping);
					}
			        //변환 실패
			        else {
			        	Map<String, String> fileMapping = new HashMap();
			        	fileMapping.put("MID", cId);
						fileMapping.put("MIP", ip);
						fileMapping.put("STATE_CODE", "FAIL");
						fileMapping.put("ST_FILE_CONVERT_ID", stFileConvertId);
						comDao.update("st.U_ST_FILE_CONVERT", fileMapping);
			        }
				
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			});

		return result;

	}	
	
	/**
	 * srt자막 -> vtt자막
	 * @param p_file : 원본파일
	 * @param p_resultPath : 결과파일경로
	 * @param p_fileName : 결과 파일명
	 * @return
	 */
	public Map srtToVtt(String p_file, String p_resultPath, String p_fileName){
		
		File file = new File(p_file);
	    
		String encoding = ComUtil.getEncodingType(file);
		StringBuilder content = null;
		try {
			//입력 버퍼 생성
			BufferedReader bufReader = new BufferedReader(new InputStreamReader(new FileInputStream(file), encoding));
			
			content = new StringBuilder("WEBVTT").append("\n").append("\n");
			String line = "";
			while((line = bufReader.readLine()) != null){
				if(line.contains("-->")) {
					line = line.replaceAll(",", ".");
				}
				line = line.replaceAll("<i>", "");
				line = line.replaceAll("</i>", "");
				content.append(line).append("\n");
			}
			//.readLine()은 끝에 개행문자를 읽지 않는다.            
			bufReader.close();
			
		}catch(Exception e) {
			
		}
        
        
        return FileUtil.fileMake(p_resultPath, p_fileName, "vtt", content.toString());
		
	}
	
	/**
	 * smi자막 -> vtt자막
	 * @param p_file : 원본파일
	 * @param p_resultPath : 결과파일경로
	 * @param p_fileName : 결과 파일명
	 * @return
	 */
	public Map smiToVtt(String p_file, String p_resultPath, String p_fileName){
		
		File file = new File(p_file);
	    
		String encoding = ComUtil.getEncodingType(file);
		StringBuilder content = null;
		try {
			//입력 버퍼 생성
			BufferedReader bufReader = new BufferedReader(new InputStreamReader(new FileInputStream(file), encoding));
			
			content = new StringBuilder("WEBVTT").append("\n").append("\n");
			String line = "";
			boolean startYn = false;
			while((line = bufReader.readLine()) != null){
				line = line.trim();
				//자막시작
				if (!startYn 
				&& !line.toLowerCase().startsWith("<sync")) {
					startYn = true;
                }
				
				if(startYn) {
					
					if (line.toLowerCase().startsWith("<sync")) {
	                    
						//p태그 제거
						if(line.toLowerCase().contains("<p")) {
							String tmp = line.substring(line.toLowerCase().indexOf("<p"));
							tmp = tmp.substring(0, tmp.indexOf(">")+1 );
							line = line.replace(tmp, "");
						}
						
						
						
	                }
					
					if(line.contains("-->")) {
						line = line.replaceAll(",", ".");
					}
					line = line.replaceAll("<br>", "\n");
					
					content.append(line).append("\n");
				}
			}
			//.readLine()은 끝에 개행문자를 읽지 않는다.            
			bufReader.close();
			
		}catch(Exception e) {
			
		}
        
        
        return FileUtil.fileMake(p_resultPath, p_fileName, "vtt", content.toString());
		
	}
}
