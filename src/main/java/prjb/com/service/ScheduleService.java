package prjb.com.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import prjb.com.mapper.ComDao;

@Service("ScheduleService")
public class ScheduleService {

	@Autowired
	ComDao comDao;
	
	@Autowired
	StService stService;
	
	@Autowired
	ExceptionService exceptionService;
	
	private static final Logger logger = LoggerFactory.getLogger(ScheduleService.class);
	
	//매일 오전1시에 실행
	@Scheduled(cron = "0 0 1 * * *")
	public void fileConvert() throws Exception {
		logger.info("ScheduleService.fileConvert() START");
		
		final String groupId = "112";	//변환된파일이 저장될 게시글 ID
		
		Map listParam = new HashMap();
		listParam.put("SCHEDULE_CODE", "WAIT");
		List<Map> convertList = comDao.selectList("com.S_COMM_FILE_SCHEDULE", listParam);
		
		convertList.parallelStream().forEach(convertFile->{
//		convertList.forEach(convertFile->{
			
			String COMM_FILE_ID = String.valueOf(convertFile.get("COMM_FILE_ID"));
			String RANDOM_KEY = String.valueOf(convertFile.get("RANDOM_KEY"));
			Map param = new HashMap();
			param.put("CID", "0");
			param.put("CIP", "SERVER");
			param.put("COMM_FILE_ID", COMM_FILE_ID);
			param.put("RANDOM_KEY", RANDOM_KEY);
			
			logger.info("ScheduleService.fileConvert().parallelStream COMM_FILE_ID : " + COMM_FILE_ID);
			
			try {
				
				Map fileChk = comDao.selectOne("com.S_COMM_FILE_DOWN", param);
				
				if("WAIT".equals(String.valueOf(fileChk.get("SCHEDULE_CODE")))) {
					//상태 변경(대기->진행중)
					param.put("SCHEDULE_CODE", "PROCESSING");
					comDao.update("com.U_COMM_FILE_SCHEDULE", param);
					convertFile.put("moduleCode", "BD");
					convertFile.put("cId", "0");
					convertFile.put("ip", "SERVER");
					Map convertResult = stService.mediaConvertExec(convertFile, groupId);

					if("success".equals(String.valueOf(convertResult.get("state")))) {
						//상태 변경(진행중->완료)
						param.put("SCHEDULE_CODE", "COMPLETE");						
					}
					else {
						//상태 변경(진행중->실패)				
						param.put("SCHEDULE_CODE", "FAIL");
					}
					comDao.update("com.U_COMM_FILE_SCHEDULE", param);
				}
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();

				//상태 변경(진행중->실패)				
				try {
					param.put("SCHEDULE_CODE", "FAIL");
					comDao.update("com.U_COMM_FILE_SCHEDULE", param);
				} catch (Exception e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				
				//에러로그
				Map logParam = new HashMap();
	    		logParam.put("ERROR_LOCATION", "ScheduleService.fileConvert()");
	    		logParam.put("ERROR_MSG", e.getMessage());
	    		logParam.put("CID", "0");
	    		logParam.put("CIP", "SERVER");
	    		exceptionService.insertErrorLog(logParam);
			}
		});		
	}
	
}
