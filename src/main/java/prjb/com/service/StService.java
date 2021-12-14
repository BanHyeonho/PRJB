package prjb.com.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
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

@Service("StService")
public class StService {
	
	@Autowired
	ComDao comDao;
	
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
				
			}
			
		}
		
		
		return result;
	}
	
	
}
