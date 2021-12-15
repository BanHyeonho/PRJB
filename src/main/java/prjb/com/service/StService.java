package prjb.com.service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.OutputStreamWriter;
import java.util.Calendar;
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
	
	private static final Logger logger = LoggerFactory.getLogger(StService.class);
	
	/**
	 * 비디오 스트리밍
	 */
	public ResponseEntity<ResourceRegion> getVideo(HttpHeaders headers, HttpServletRequest request) throws Exception {
		
		String fileInfo = request.getParameter("fileInfo");
		Map fileMap = new JSONObject(fileInfo.toString()).toMap();
		
		String commFileId = String.valueOf(fileMap.get("COMM_FILE_ID"));
		String randomKey = String.valueOf(fileMap.get("RANDOM_KEY"));
		
		String contextFileId = String.valueOf(request.getServletContext().getAttribute("COMM_FILE_ID"));
		String contextRandomKey = String.valueOf(request.getServletContext().getAttribute("RANDOM_KEY"));
		
		String fileData = null;
		
		if(commFileId.equals(contextFileId)
		&& randomKey.equals(contextRandomKey)
		) {
			fileData = String.valueOf(request.getServletContext().getAttribute("FILE_DATA"));
		}
		else {
			Map param = new HashMap();
			param.put("COMM_FILE_ID", commFileId);
			param.put("RANDOM_KEY", randomKey);
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
				fileData = filePath + fileNm;
				request.getServletContext().setAttribute("FILE_DATA", fileData);
			}
		}
				
//		UrlResource video = new UrlResource("file:" + "C:\\develop\\files\\prjb\\testFile");
//		UrlResource video = new UrlResource("file:" + fileData);	//UrlResource 는 파일명에 '%' 가 들어가는경우 오류
//		fileData = "C:\\develop\\files\\prjb\\YFkaZeBp20bb%2Fug5vAlxcE7DgMAe4ur3uNDEwva1L%2BwcSndp1ULuzceiDjsW2Bcy";
		
		Resource video = new FileSystemResource(fileData);
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
							
							break;
					}
					
				}
				//영상
				else {
					
				}
			}
		}
		
		
		return result;
	}
	
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
		
//		String fileData = "C:\\Users\\Administrator\\Desktop\\자막\\";
//		fileData += "YGvmlXnwFvyW%2FSCvnBBMQPBc2rMhAlh%2Bb5M1xvg5wu5AF61NDS1WgAvX3eYQLADan%2Fdfr%2FSD7%2F%2Bs0kzUGPHpLg%3D%3D";
		
		File file = new File(fileData);
	    
		String encoding = ComUtil.getEncodingType(file);
//	    String content = FileUtils.readFileToString(file, encoding);
		
        //입력 스트림 생성
        FileReader filereader = new FileReader(file);
        //입력 버퍼 생성
        BufferedReader bufReader = new BufferedReader(filereader);
        
        
        StringBuilder content = new StringBuilder("WEBVTT").append("\n").append("\n");
        String line = "";
        while((line = bufReader.readLine()) != null){
            System.out.println(line);
            if(line.contains("-->")) {
            	line = line.replaceAll(",", ".");
            }
            line = line.replaceAll("<i>", "");
            line = line.replaceAll("</i>", "");
            content.append(line).append("\n");
        }
        //.readLine()은 끝에 개행문자를 읽지 않는다.            
        bufReader.close();
        
        //파일경로 윈도우 : root/모듈/소스명/년/월 예) C:/develop/files/prjb/ST/2021/05/31/암호화(20210525112412_test) --확장자는 따로저장
  		Calendar cal = Calendar.getInstance(); // Calendar 객체 얻어오기 ( 시스템의 현재날짜와 시간정보 )
  		String year = String.valueOf(cal.get(Calendar.YEAR)); // Calendar 인스턴스에 있는 저장된 필드 값을 가져옴
  		String month = String.format("%02d", cal.get(Calendar.MONTH) + 1);
  		String day = String.format("%02d", cal.get(Calendar.DATE));
  		String filePath = fileRoot + moduleCode + File.separator + year +  File.separator + month +  File.separator + day +  File.separator;
  		
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
