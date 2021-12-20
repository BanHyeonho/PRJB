package prjb.com.util;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import prjb.com.init.InitBean;

public class FileUtil {

	private final static CryptoUtil CryptoUtil = InitBean.CryptoClass;
	
	
	/**
	 * 파일 인코딩 생성
	 * @param input
	 * @param outputPath
	 * @param fileName
	 * @param fileExtension
	 * @return
	 */
	public static Map fileConvert(String input, String outputPath, String fileName, String fileExtension) {
		
		Map result = new HashMap();

		String serverFileName = System.currentTimeMillis() + "_" + fileName;
		
		long fileSize = 0;
		
		try {
			//암호화
			fileName = CryptoUtil.encrypt(fileName);
			serverFileName = URLEncoder.encode(CryptoUtil.encrypt(serverFileName), "UTF-8") ;
			
			File path = new File(outputPath);
			
			if (!path.exists()) {
				path.mkdirs();
			}
			
			boolean convert = FFmpegUtil.convert(input, outputPath + serverFileName, fileExtension);
			
			if(convert) {
				File file = new File(outputPath + serverFileName);
				fileSize = file.length();
			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result.put("state", "fail");
		}
		
		if(fileSize > 0) {
			result.put("state", "success");	
		}
		else {
			result.put("state", "fail");
		}
		result.put("fileSize", fileSize);
		result.put("fileExtension", fileExtension);
		result.put("fileName", fileName);
		result.put("serverFileName", serverFileName);
		
		return result;
		
	}
	
	/**
	 * 파일생성
	 * @param filePath
	 * @param fileName
	 * @param fileExtension
	 * @param content
	 * @return
	 */
	public static Map fileMake(String filePath, String fileName, String fileExtension, String content) {
		
		Map result = new HashMap();

		String serverFileName = System.currentTimeMillis() + "_" + fileName;
		
		long fileSize = 0;
		
		try {
			//암호화
			fileName = CryptoUtil.encrypt(fileName);
			serverFileName = URLEncoder.encode(CryptoUtil.encrypt(serverFileName), "UTF-8") ;
			
			File path = new File(filePath);
	
			if (!path.exists()) {
				path.mkdirs();
			}
	
			File file = new File(filePath + serverFileName);
			
			// BufferedWriter 와 FileWriter를 조합하여 사용 (속도 향상)
			BufferedWriter fw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), "UTF-8"));

			// 파일안에 문자열 쓰기
			fw.write(content.toString());
			fw.flush();

			// 객체 닫기
			fw.close();
			
			fileSize = file.length();
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result.put("state", "fail");
		}
		
		
		result.put("fileSize", fileSize);
		result.put("fileExtension", fileExtension);
		result.put("fileName", fileName);
		result.put("serverFileName", serverFileName);
		
		result.put("state", "success");
		return result;
		
	}
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

		String fileName = attachedFile.getOriginalFilename();
		String fileExtension = fileName.substring(fileName.lastIndexOf(".") +1);
		String serverFileName = System.currentTimeMillis() + "_" + fileName;
		
		try {
			//암호화
			fileName = CryptoUtil.encrypt(fileName);
			serverFileName = URLEncoder.encode(CryptoUtil.encrypt(serverFileName), "UTF-8") ;
			
			File path = new File(filePath);
	
			if (!path.exists()) {
				path.mkdirs();
			}
	
			File file = new File(filePath + serverFileName);
			attachedFile.transferTo(file);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result.put("state", "fail");
		}
				
		result.put("fileSize", fileSize);
		result.put("fileExtension", fileExtension);
		result.put("fileName", fileName);
		result.put("serverFileName", serverFileName);
		
		result.put("state", "success");
		return result;
	}
	
	/**
	 * 파일다운로드
	 * @param SERVER_FILE_NAME
	 * @param FILE_PATH
	 * @param BROWSER
	 * @throws Exception
	 */
	public static boolean fileDownload(Map<String, String> fileMap, HttpServletResponse response) throws Exception{

		boolean result = false;
		String serverFileName = String.valueOf(fileMap.get("SERVER_FILE_NAME"));
		File file = new File(String.valueOf(fileMap.get("FILE_PATH")) + serverFileName);

		if (file.exists() && file.isFile()) {
			response.setContentType("application/octet-stream; charset=utf-8");
			response.setContentLength((int) file.length());
			
			String browser = fileMap.get("BROWSER");
			String downFileNm = fileMap.get("FILE_NAME");
					
			String disposition = ComUtil.getDisposition(downFileNm, browser);
			response.setHeader("Content-Disposition", disposition);
			response.setHeader("Content-Transfer-Encoding", "binary");

			OutputStream out = null;
			FileInputStream fis = null;

			try {
				out = response.getOutputStream();
				fis = new FileInputStream(file);
				FileCopyUtils.copy(fis, out);
				result = true;
			} catch (IOException e) {
				e.printStackTrace();
				result = false;
			} finally {
				if (fis != null){
					fis.close();
				}
				if(out != null){
					out.flush();
					out.close();
				}
			}
		}
		
		return result;
	}
	/**
	 * 파일 삭제
	 * @param path
	 * @param serverFileName
	 */
	public static void fileDelete(String path, String serverFileName){
		File file = new File(path + serverFileName);
		if( file.exists() ){
			file.delete();
		}
	}
}
