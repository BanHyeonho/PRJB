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

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
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

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;

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
		final String moduleCode = "ST";
		
		final String cId = String.valueOf(request.getSession().getAttribute("COMM_USER_ID"));
		final String ip = ComUtil.getAddress(request);
		
		ObjectMapper mapper = mapper = new ObjectMapper();
		JsonNode json = mapper.readTree(String.valueOf(paramMap.get("CONVERT_FILES")));
		ObjectReader reader = mapper.readerFor(new TypeReference<List>() {});
		List<Map> convertFiles = reader.readValue(json);
		
		final String groupId = paramMap.get("GROUP_ID");
		
		for (Map fileInfo : convertFiles) {
			String fileExtension = String.valueOf(fileInfo.get("FILE_EXTENSION")).toLowerCase();
			String fileType = String.valueOf(fileInfo.get("FILE_TYPE")).toUpperCase();
			
			
			//web에서 바로 실행가능한 파일이므로, 변환하지않고 매핑정보만 추가한다. COMM_FILE 에 데이터만 추가.
			if("mp4".equals(fileExtension)
			|| "vtt".equals(fileExtension)) {
				Map param = new HashMap();
				param.put("CIP", ip);
				param.put("CID", cId);
				param.put("COMM_FILE_ID", fileInfo.get("COMM_FILE_ID"));
				param.put("MODULE_CODE", moduleCode);
				param.put("GROUP_ID", groupId);       
				comDao.insert("st.I_FILE_MAPPING_COPY", param);
			}
			//인코딩작업 필요
			else {
				//자막
				if("SUB".equals(fileType)) {
					
					switch (fileExtension) {
						case "srt":
							srtConvert(request, fileInfo, groupId);
							break;
						case "smi":
							smiConvert(request, fileInfo, groupId);
							break;
					}
					
				}
				//영상
				else {
					mediaConvert(request, fileInfo, groupId);
				}
			}
		}
		
		
		return result;
	}
	
	/**
	 * 영상 -> mp4파일
	 * @param request
	 * @param param
	 * @param groupId
	 * @throws Exception
	 */
	@Transactional(rollbackFor = Exception.class)
	public void mediaConvert(HttpServletRequest request, Map param, String groupId) throws Exception{
		
		final String cId = String.valueOf(request.getSession().getAttribute("COMM_USER_ID"));
		final String ip = ComUtil.getAddress(request);
		final String commFileId = String.valueOf(param.get("COMM_FILE_ID"));
		final String randomKey = String.valueOf(param.get("RANDOM_KEY"));
		
		Map fileParam = new HashMap();
		fileParam.put("COMM_FILE_ID", commFileId);
		fileParam.put("RANDOM_KEY", randomKey);
		Map fileInfo = comDao.selectOne("com.S_COMM_FILE_DOWN", fileParam);
				
		fileInfo.put("cId", cId);
		fileInfo.put("ip", ip);
		fileInfo.put("moduleCode", "ST");
		mediaConvertExec(fileInfo, groupId);
		
	}
	
	/**
	 * 영상 -> mp4파일 변환실행부
	 * @param request
	 * @param param
	 * @param groupId
	 * @throws Exception
	 */
	@Transactional(rollbackFor = Exception.class)
	public Map mediaConvertExec(Map fileInfo, String groupId) throws Exception{
		Map result = new HashMap();
		result.put("state", "fail");
		final String fileExtension = "mp4";
		final String moduleCode = String.valueOf(fileInfo.get("moduleCode"));
		final String cId = String.valueOf(fileInfo.get("cId"));
		final String ip = String.valueOf(fileInfo.get("ip"));
		String fileNm = String.valueOf(fileInfo.get("FILE_NAME"));
		
		String fileData = String.valueOf(fileInfo.get("FILE_PATH")) + String.valueOf(fileInfo.get("SERVER_FILE_NAME"));
		        
  		String filePath = FileUtil.filePath(fileRoot, moduleCode);
  		
        Map<String, String> fileResult = FileUtil.fileConvert(fileData, filePath, fileNm, fileExtension);
        
        if("success".equals(fileResult.get("state"))) {
			
			Map<String, String> fileMapping = new HashMap();
			fileMapping.put("MODULE_CODE", moduleCode);
			fileMapping.put("GROUP_ID", groupId);
			fileMapping.put("CID", cId);
			fileMapping.put("CIP", ip);
			fileMapping.put("FILE_PATH", filePath);
			fileMapping.put("FILE_SIZE", String.valueOf(fileResult.get("fileSize")));
			fileMapping.put("FILE_EXTENSION", fileResult.get("fileExtension"));
			fileMapping.put("FILE_NAME_ENCRYPT", fileResult.get("fileName"));
			fileMapping.put("SERVER_FILE_NAME", fileResult.get("serverFileName"));
			fileMapping.put("RANDOM_KEY", ComUtil.getRandomKey());
			
			comDao.insert("com.I_COMM_FILE", fileMapping);
			result.put("state", "success");
		}
        
        
        return result;
	}
	
	/**
	 * srt자막 -> vtt자막
	 * @param request
	 * @param param
	 * @param groupId
	 * @throws Exception
	 */
	@Transactional(rollbackFor = Exception.class)
	public void srtConvert(HttpServletRequest request, Map param, String groupId) throws Exception{
		
		final String moduleCode = "ST";
		final String cId = String.valueOf(request.getSession().getAttribute("COMM_USER_ID"));
		final String ip = ComUtil.getAddress(request);
		final String commFileId = String.valueOf(param.get("COMM_FILE_ID"));
		final String randomKey = String.valueOf(param.get("RANDOM_KEY"));
		
		Map fileParam = new HashMap();
		fileParam.put("COMM_FILE_ID", commFileId);
		fileParam.put("RANDOM_KEY", randomKey);
		Map fileInfo = comDao.selectOne("com.S_COMM_FILE_DOWN", fileParam);
		
		String fileNm = String.valueOf(fileInfo.get("FILE_NAME"));
		
		String fileData = String.valueOf(fileInfo.get("FILE_PATH")) + String.valueOf(fileInfo.get("SERVER_FILE_NAME"));
		
		File file = new File(fileData);
	    
		String encoding = ComUtil.getEncodingType(file);
		
        //입력 버퍼 생성
        BufferedReader bufReader = new BufferedReader(new InputStreamReader(new FileInputStream(file), encoding));
        
        StringBuilder content = new StringBuilder("WEBVTT").append("\n").append("\n");
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
        
  		String filePath = FileUtil.filePath(fileRoot, moduleCode);
  		
        Map<String, String> fileResult = FileUtil.fileMake(filePath, fileNm, "vtt", content.toString());
		
        if("success".equals(fileResult.get("state"))) {
			
			Map<String, String> fileMapping = new HashMap();
			fileMapping.put("MODULE_CODE", moduleCode);
			fileMapping.put("GROUP_ID", groupId);
			fileMapping.put("CID", cId);
			fileMapping.put("CIP", ip);
			fileMapping.put("FILE_PATH", filePath);
			fileMapping.put("FILE_SIZE", String.valueOf(fileResult.get("fileSize")));
			fileMapping.put("FILE_EXTENSION", fileResult.get("fileExtension"));
			fileMapping.put("FILE_NAME_ENCRYPT", fileResult.get("fileName"));
			fileMapping.put("SERVER_FILE_NAME", fileResult.get("serverFileName"));
			fileMapping.put("RANDOM_KEY", ComUtil.getRandomKey());
			
			comDao.insert("com.I_COMM_FILE", fileMapping);
		}
	}
	
	/**
	 * smi자막 -> vtt자막
	 * @param request
	 * @param param
	 * @param groupId
	 * @throws Exception
	 */
	@Transactional(rollbackFor = Exception.class)
	public void smiConvert(HttpServletRequest request, Map param, String groupId) throws Exception{
		
		final String moduleCode = "ST";
		final String cId = String.valueOf(request.getSession().getAttribute("COMM_USER_ID"));
		final String ip = ComUtil.getAddress(request);
		final String commFileId = String.valueOf(param.get("COMM_FILE_ID"));
		final String randomKey = String.valueOf(param.get("RANDOM_KEY"));
		
		Map fileParam = new HashMap();
		fileParam.put("COMM_FILE_ID", commFileId);
		fileParam.put("RANDOM_KEY", randomKey);
		Map fileInfo = comDao.selectOne("com.S_COMM_FILE_DOWN", fileParam);
		
		String fileNm = String.valueOf(fileInfo.get("FILE_NAME"));
		
		String fileData = String.valueOf(fileInfo.get("FILE_PATH")) + String.valueOf(fileInfo.get("SERVER_FILE_NAME"));
		
//		String fileData = "C:\\develop\\files\\prjb\\아이언 맨 1.smi";
		
		File file = new File(fileData);
	    
		String encoding = ComUtil.getEncodingType(file);
		
        //입력 버퍼 생성
        BufferedReader bufReader = new BufferedReader(new InputStreamReader(new FileInputStream(file), encoding));
        
        StringBuilder content = new StringBuilder("WEBVTT").append("\n").append("\n");
        String line = "";
        List<String> subtitleList = new ArrayList();
        boolean headYn = true;
        boolean startYn = true;
        int titleIdx = 0;
        while((line = bufReader.readLine()) != null){
        	
        	//헤더
        	if(headYn) {
        		if(line.trim().indexOf(".") == 0) {
        			subtitleList.add(line.trim().substring(0, line.indexOf("{")));
            	}
        		else if(line.toUpperCase().contains("<BODY>")) {
        			headYn = false;
        		}
        	}
        	//바디
        	else {
        		//한,영 자막 같이있는경우
        		if(subtitleList.size() > 1) {
        			
        			if(line.contains(subtitleList.get(titleIdx))) {
        				
        				if(startYn) {
        					
        				}
        				System.out.println(line);
        				String text = line;
        				
        				text.replaceAll("<br>", "\n");
        				text = removeTag(text);
        				
            			content.append(text).append("\n");
        				
        			}
        			else {
        				titleIdx++;
//        				if(line.contains(subtitleList.get(titleIdx))) {
//            				
//            			}
        			}
        			
        		}
        		//자막 1개만 있는경우
        		else {
        			
//        			content.append(line).append("\n");
        		}	
        	}
        }
        System.out.println(content.toString());
        //.readLine()은 끝에 개행문자를 읽지 않는다.            
        bufReader.close();
        
//  	String filePath = FileUtil.filePath(fileRoot, moduleCode);
//  		
//        Map<String, String> fileResult = FileUtil.fileMake(filePath, fileNm, "vtt", content.toString());
//		
//        if("success".equals(fileResult.get("state"))) {
//			
//			Map<String, String> fileMapping = new HashMap();
//			fileMapping.put("MODULE_CODE", moduleCode);
//			fileMapping.put("GROUP_ID", groupId);
//			fileMapping.put("CID", cId);
//			fileMapping.put("CIP", ip);
//			fileMapping.put("FILE_PATH", filePath);
//			fileMapping.put("FILE_SIZE", String.valueOf(fileResult.get("fileSize")));
//			fileMapping.put("FILE_EXTENSION", fileResult.get("fileExtension"));
//			fileMapping.put("FILE_NAME_ENCRYPT", fileResult.get("fileName"));
//			fileMapping.put("SERVER_FILE_NAME", fileResult.get("serverFileName"));
//			fileMapping.put("RANDOM_KEY", ComUtil.getRandomKey());
//			
//			comDao.insert("com.I_COMM_FILE", fileMapping);
//		}
	}
	public String removeTag(String str) {
		StringBuilder result = new StringBuilder();
		String[] strSp = str.split("");
		boolean appendYn = true;
		for (int i = 0; i < strSp.length; i++) {
			String s = strSp[i];
			if("<".equals(s)) {
				appendYn = false;
			}
			else if(">".equals(s)){
				appendYn = true;
			}
			else if(appendYn){
				result.append(s);
			}
		}
		return result.toString();
	}
	
	/**
	 * 자막내용 추출
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	public Map subTitleContent(HttpServletRequest request) throws Exception{
		Map result = new HashMap();
		Map<String, String> paramMap = ComUtil.getParameterMap(request);
		
		final String cId = String.valueOf(request.getSession().getAttribute("COMM_USER_ID"));
		final String ip = ComUtil.getAddress(request);
		final String randomKey = paramMap.get("RANDOM_KEY");
		final String commFileId = paramMap.get("COMM_FILE_ID");
		
		Map param = new HashMap();
		param.put("COMM_FILE_ID", commFileId);
		param.put("RANDOM_KEY", randomKey);
		Map fileInfo = comDao.selectOne("com.S_COMM_FILE_DOWN", param);
		
		String filePath = String.valueOf(fileInfo.get("FILE_PATH"));
		String fileNm = String.valueOf(fileInfo.get("SERVER_FILE_NAME"));				
		String fileData = filePath + fileNm;
		
//		String fileData = "C:\\Users\\Administrator\\Desktop\\자막\\";
//		fileData += "YGvmlXnwFvyW%2FSCvnBBMQPBc2rMhAlh%2Bb5M1xvg5wu5AF61NDS1WgAvX3eYQLADan%2Fdfr%2FSD7%2F%2Bs0kzUGPHpLg%3D%3D";
		File file = new File(fileData);
	    
		String encoding = ComUtil.getEncodingType(file);
	    String content = FileUtils.readFileToString(file, encoding);
	    
	    result.put("result", content);
	    
		return result;
	}
	
}
