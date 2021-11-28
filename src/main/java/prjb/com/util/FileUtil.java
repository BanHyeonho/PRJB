package prjb.com.util;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public class FileUtil {

	/**
	 * 파일업로드
	 * @param request
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public static Map fileUpload(String filePath, MultipartFile attachedFile){
		
		Map result = new HashMap();
		
		long fileSize = attachedFile.getSize();

		String realFileName = attachedFile.getOriginalFilename();
		String fileExtension = realFileName.substring(realFileName.lastIndexOf("."));
		String fileName = System.currentTimeMillis() + "_" + realFileName;

		//암호화
		fileName = CryptoUtil.encrypt(fileName); 
		
		File path = new File(filePath);

		if (!path.exists()) {
			path.mkdirs();
		}

		File file = new File(filePath + fileName);
		
		try {
			attachedFile.transferTo(file);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result.put("state", "fail");
		}
		
		
		result.put("fileSize", fileSize);
		result.put("fileExtension", fileExtension);
		result.put("fileName", realFileName);
		result.put("serverFileName", fileName);
		
		result.put("state", "success");
		return result;
	}
}
