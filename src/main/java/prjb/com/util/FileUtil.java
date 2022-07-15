package prjb.com.util;

import java.awt.image.BufferedImage;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.imgscalr.Scalr;
import org.jodconverter.core.DocumentConverter;
import org.jodconverter.core.office.OfficeException;
import org.jodconverter.core.office.OfficeManager;
import org.jodconverter.local.LocalConverter;
import org.jodconverter.local.office.LocalOfficeManager;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import com.google.common.io.Files;

import net.lingala.zip4j.io.outputstream.ZipOutputStream;
import net.lingala.zip4j.model.ZipParameters;
import prjb.com.init.InitBean;

public class FileUtil {

	private final static CryptoUtil CryptoUtil = InitBean.CryptoClass;
	
	/**
	 * 파일저장경로
	 * @return
	 */
	public static String filePath(String fileRoot, String moduleCode) {
		//파일경로 윈도우 : root/모듈/소스명/년/월 예) C:/develop/files/prjb/ST/2021/05/31/암호화(20210525112412_test) --확장자는 따로저장
		Calendar cal = Calendar.getInstance(); // Calendar 객체 얻어오기 ( 시스템의 현재날짜와 시간정보 )
		String year = String.valueOf(cal.get(Calendar.YEAR)); // Calendar 인스턴스에 있는 저장된 필드 값을 가져옴
		String month = String.format("%02d", cal.get(Calendar.MONTH) + 1);
		String day = String.format("%02d", cal.get(Calendar.DATE));
		
		if(!fileRoot.contains(File.separator)) {
			fileRoot += File.separator;
		}
		
		String filePath = fileRoot + moduleCode + File.separator + year +  File.separator + month +  File.separator + day +  File.separator;
		
		return filePath;
	}
	
	/**
	 * 파일명 생성
	 * @param p_fileName
	 * @return
	 * @throws Exception
	 */
	public static Map fileName(String p_fileName) throws Exception {
		Map result = new HashMap();
		
		String serverFileName = "";
		String fileName = "";
		
		//파일명에 /,\ 가 들어가면 안된다.(폴더경로로 인식하기때문)
//		do {
//			serverFileName = System.currentTimeMillis() + "_" + p_fileName.replaceAll(" ", "");
//			serverFileName = URLEncoder.encode(serverFileName, "UTF-8");
//			serverFileName = CryptoUtil.encrypt(serverFileName);
//			
//		}while(serverFileName.contains("/") || serverFileName.contains("\\"));
		
		serverFileName = System.currentTimeMillis() + "_" + ComUtil.getRandomKey(10);
		serverFileName = URLEncoder.encode(serverFileName, "UTF-8");
		
		//암호화
		fileName = CryptoUtil.encrypt(p_fileName);
		
		result.put("FILE_NAME", fileName);
		result.put("SERVER_FILE_NAME", serverFileName);
		
		return result;
	}
	
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

		fileName =  fileName.substring(0, fileName.lastIndexOf(".")) + "." + fileExtension;
		
		String serverFileName = "";
		
		long fileSize = 0;
		
		try {
			
			Map<String, String> fileNames = fileName(fileName);
			serverFileName = fileNames.get("SERVER_FILE_NAME");
			fileName = fileNames.get("FILE_NAME");
			
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

		fileName =  fileName.substring(0, fileName.lastIndexOf(".")) + "." + fileExtension;
		
		String serverFileName = "";
		
		long fileSize = 0;
		
		try {
			
			Map<String, String> fileNames = fileName(fileName);
			serverFileName = fileNames.get("SERVER_FILE_NAME");
			fileName = fileNames.get("FILE_NAME");
						
			File path = new File(filePath);
	
			if (!path.exists()) {
				path.mkdirs();
			}
	
			File file = new File(filePath + serverFileName);

			// BufferedWriter 와 FileWriter를 조합하여 사용 (속도 향상)
			try(BufferedWriter fw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), "UTF-8"));){
				// 파일안에 문자열 쓰기
				fw.write(content.toString());
				fw.flush();
			}
			
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
		String serverFileName = "";
		
		try {
			
			Map<String, String> fileNames = fileName(fileName);
			serverFileName = fileNames.get("SERVER_FILE_NAME");
			fileName = fileNames.get("FILE_NAME");
						
			File path = new File(filePath);
	
			if (!path.exists()) {
				path.mkdirs();
			}
	
			File file = new File(filePath + serverFileName);
			attachedFile.transferTo(file);
			
			result.put("fileSize", fileSize);
			result.put("fileExtension", fileExtension);
			result.put("fileName", fileName);
			result.put("serverFileName", serverFileName);
			
			result.put("state", "success");
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result.put("state", "fail");
		}
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

		final String contentType = "application/octet-stream; charset=utf-8";
		
		boolean result = false;
		String serverFileName = String.valueOf(fileMap.get("SERVER_FILE_NAME"));
		File file = new File(String.valueOf(fileMap.get("FILE_PATH")) + serverFileName);

		if (file.exists() && file.isFile()) {
			response.setContentType(contentType);
			response.setContentLength((int) file.length());
			
			String browser = fileMap.get("BROWSER");
			String downFileNm = fileMap.get("FILE_NAME");
					
			String disposition = ComUtil.getDisposition(downFileNm, browser);
			response.setHeader("Content-Disposition", disposition);
			response.setHeader("Content-Transfer-Encoding", "binary");

			try (OutputStream out = response.getOutputStream();
				FileInputStream fis = new FileInputStream(file);
			){
				FileCopyUtils.copy(fis, out);
				result = true;
				out.flush();
			} catch (IOException e) {
				e.printStackTrace();
				result = false;
			}
			
		}
		
		return result;
	}
	
	/**
	 * 파일 압축하여 다운로드
	 * @param request
	 * @param response
	 * @param files
	 */
	public static void zipFileDownload(HttpServletRequest request, HttpServletResponse response, String zipFileName, List<File> files) throws Exception{
		final String contentType = "application/zip; charset=utf-8";
		final byte[] buff = new byte[4096];
		int readLen = 0;
		
		ZipParameters parameters = new ZipParameters();
		response.setContentType(contentType);
		
		String disposition = ComUtil.getDisposition(zipFileName + ".zip", ComUtil.getBrowser(request));
		response.setHeader("Content-Disposition", disposition);
	
		try( ZipOutputStream zos = new ZipOutputStream(response.getOutputStream()) ){
			
			for (File file : files) {
				String fileDownName = ((CustomFile)file).getFileDownName();
				
				parameters.setFileNameInZip(fileDownName == null ? file.getName() : fileDownName);
				zos.putNextEntry(parameters);
				try( InputStream is = new FileInputStream(file) ){
					while ( (readLen = is.read(buff)) != -1 ) {
						zos.write(buff, 0, readLen);
					}
				}
				zos.closeEntry();
			}
			
		}
		catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		
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
	
	/**
	 * 파일 복사
	 * @return
	 */
	public static void fileCopy(String oldFile, String newFilePath, String newFileName){

		File orgFile = new File(oldFile);

		File dir = new File(newFilePath);
		/***** 해당 디렉토리의 존재여부를 확인 *****/
		if (!dir.exists()) {
			// 없다면 생성
			dir.mkdirs();
		}
		File tmpFile = new File(newFilePath + newFileName);

		try {
			Files.copy(orgFile, tmpFile);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
	
	/**
	 * pdf변환
	 * @param libreOffice_path
	 * @param originFile
	 * @param resultFile
	 * @throws Exception
	 */
	public static void makePDF(String libreOffice_path, String originFile, String resultFile) throws Exception {
		
		OfficeManager officeManager = LocalOfficeManager.builder().officeHome(libreOffice_path).build();
		DocumentConverter converter = LocalConverter.builder().officeManager(officeManager).build();
		
		System.out.println("officeManager start");
		officeManager.start();

		try {
			System.out.println("convert start");
			
			//파일명에 확장자가 없는경우 자동으로 붙여준다.
			int fileNmLenth = resultFile.length();
			if( fileNmLenth < 4
			|| !".pdf".equals( resultFile.substring( fileNmLenth-4 ).toLowerCase() )
			) {
				resultFile = resultFile + ".pdf";
			}
			
			File excelFile = new File(originFile);
			File pdfFile = new File(resultFile);
			converter.convert(excelFile).to(pdfFile).execute();
			
			System.out.println("convert end");
		}
		finally {
			officeManager.stop();
		}
		
	}
	
	/**
	 * 썸네일 생성
	 * @param originFile
	 * @param resultFile
	 * @throws Exception
	 */
	public static void makeThumbnail(String originFile, String resultFile, int thumbWidth, int thumbHeight, String fileExtension) throws Exception {
		
		// 저장된 원본파일로부터 BufferedImage 객체를 생성
		BufferedImage originalImage = ImageIO.read(new File(originFile));
		
		BufferedImage thumbImage;

		//세로기준 자동조절
		if(thumbWidth == 0) {
			thumbImage = Scalr.resize(originalImage, Scalr.Method.AUTOMATIC, Scalr.Mode.FIT_TO_HEIGHT, thumbHeight);
		}
		//가로기준 자동조절		
		else if(thumbHeight == 0) {
			thumbImage = Scalr.resize(originalImage,  Scalr.Method.AUTOMATIC, Scalr.Mode.FIT_TO_WIDTH, thumbWidth);
		}
		else {
			thumbImage = Scalr.resize(originalImage, thumbWidth, thumbHeight);
		}
		
		File thumbFile = new File(resultFile);
		
		ImageIO.write(thumbImage, "gif", thumbFile);
		
	}
	
}
