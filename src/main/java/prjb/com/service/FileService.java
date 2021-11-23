package prjb.com.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import prjb.com.mapper.ComDao;
import prjb.com.util.ComUtil;

@Service("FileService")
public class FileService {

	@Value("#{config['file_root']}")
	public String file_root;
	
	@Autowired
	ComDao comDao;
	
	
	/**
	 * 파일업로드
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@Transactional(rollbackFor = Exception.class)
	public Object fileUpload(HttpServletRequest request, HttpServletResponse response) throws Exception{

		Map<String, String> result = new HashMap();

		String cId = String.valueOf(request.getSession().getAttribute("COMM_USER_ID"));
		String ip = ComUtil.getAddress(request);
		
		String moduleCode = String.valueOf(request.getParameter("MODULE_CODE"));
		String categoryCode = String.valueOf(request.getParameter("CATEGORY_CODE"));
		String groupId = String.valueOf(request.getParameter("GROUP_ID"));

		Calendar cal = Calendar.getInstance(); // Calendar 객체 얻어오기 ( 시스템의 현재날짜와 시간정보 )

		String year = String.valueOf(cal.get(Calendar.YEAR)); // Calendar 인스턴스에 있는 저장된 필드 값을 가져옴
		String month = String.format("%02d", cal.get(Calendar.MONTH) + 1);

		//파일경로 윈도우 : root/모듈/소스명/년/월 예) C:/develop/files/prjb/ST/ea_draft/2021/05/암호화(20210525112412_test) --확장자는 따로저장
		String filePath = file_root + moduleCode + File.separator + categoryCode +  File.separator + year +  File.separator + month +  File.separator;

		Map param = new HashMap();

		param.put("FILE_PATH", filePath);
		param.put("MODULE_CODE", moduleCode);
		param.put("CATEGORY_CODE", categoryCode);
		param.put("GROUP_ID", groupId);
		param.put("CIP", ip);
		param.put("CID", cId);
		param.put("MIP", ip);
		param.put("MID", cId);

		Map fileMaster = comDao.selectOne("com.S_COMM_FILE_MASTER", param);

		if(fileMaster == null || fileMaster.size() == 0){
			comDao.insert("com.I_COMM_FILE_MASTER", param);
			fileMaster = param;
		}else{
			filePath = (String) fileMaster.get("FILE_PATH");
		}

		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
		List<MultipartFile> fileList = multipartRequest.getFiles("attachedFile");

		/***** 파일읽기 *****/
		for ( MultipartFile attachedFile : fileList) {

			Map p = new HashMap();
			p.put("COMM_FILE_MASTER_ID", fileMaster.get("COMM_FILE_MASTER_ID"));

			long fileSize = attachedFile.getSize();

			String realFileName = attachedFile.getOriginalFilename();
			String fileextension = realFileName.substring(realFileName.lastIndexOf("."));
			String fileName = System.currentTimeMillis() + "_" + realFileName;

			File path = new File(filePath);

			if (!path.exists()) {
				path.mkdirs();
			}

			File file = new File(filePath + fileName);

			try {

				attachedFile.transferTo(file);

				p.put("FILE_NAME", realFileName);
				p.put("FILE_EXTENSION", fileextension);
				p.put("FILE_SIZE", fileSize);
				p.put("FILE_SERVER_NAME", fileName);
				p.put("CIP", ip);
				p.put("CID", cId);
				p.put("MIP", ip);
				p.put("MID", cId);
				p.put("RANDOM_KEY", ComUtil.getRandomKey());
				comDao.insert("I_COMM_FILE_DETAIL", p);
			} catch (IOException e) {
				e.printStackTrace();
				result.put("state", "fail");
			}
		}

		if(!result.containsKey("state")){
			result.put("state", "success");
		}
		return result;
	}
	
	/**
	 * 파일다운로드
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@Transactional(rollbackFor = Exception.class)
	public void fileDownload(HttpServletRequest request, HttpServletResponse response) throws Exception {

		String commFileDetailId = request.getParameter("COMM_FILE_DETAIL_ID");
		String randomKey = request.getParameter("RANDOM_KEY");

		Map param = new HashMap();
		param.put("COMM_FILE_DETAIL_ID", commFileDetailId);
		param.put("RANDOM_KEY", randomKey);

		Map result = comDao.selectOne("com.S_COMM_FILE_DOWN", param);

		if (result == null || result.size() == 0 ) {
			response.setContentType("text/html");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write("<script>alert('can not find a file');</script>");
			return;
		}

		String fileName = String.valueOf(result.get("FILE_SERVER_NAME"));
		File file = new File(String.valueOf(result.get("FILE_PATH")) + fileName);

		if (file.exists() && file.isFile()) {
			response.setContentType("application/octet-stream; charset=utf-8");
			response.setContentLength((int) file.length());
			String browser = ComUtil.getBrowser(request);

			String downFilenm = String.valueOf(result.get("FILE_NAME"));
			downFilenm += (result.get("FILE_EXTENSION") == null ? "" : "." + result.get("FILE_EXTENSION") );
					
			String disposition = ComUtil.getDisposition(downFilenm, browser);
			response.setHeader("Content-Disposition", disposition);
			response.setHeader("Content-Transfer-Encoding", "binary");

			OutputStream out = null;
			FileInputStream fis = null;

			try {
				out = response.getOutputStream();
				fis = new FileInputStream(file);
				FileCopyUtils.copy(fis, out);
			} catch (IOException e) {
				e.printStackTrace();
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

	}
	
	/**
	 * 파일 삭제
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@Transactional(rollbackFor = Exception.class)
	public void fileDelete(HttpServletRequest request, HttpServletResponse response) throws Exception{
		String commFileDetailId = request.getParameter("COMM_FILE_DETAIL_ID");
		String randomKey = request.getParameter("RANDOM_KEY");

		Map param = new HashMap();
		param.put("COMM_FILE_DETAIL_ID", commFileDetailId);
		param.put("RANDOM_KEY", randomKey);

		Map<String, String> result = comDao.selectOne("com.S_COMM_FILE_DOWN", param);

		//DB데이터 삭제
		comDao.delete("com.D_COMM_FILE_DETAIL", param);

		//실제파일 삭제
		String path = result.get("FILE_PATH");
		String fileName = result.get("FILE_SERVER_NAME");
		fileDelete(path, fileName);
		
	}
	public void fileDelete(String path, String fileName) throws Exception {
		File file = new File(path + fileName);
		if( file.exists() ){
			file.delete();
		}
	}
	
}
