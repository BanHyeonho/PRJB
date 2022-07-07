package prjb.com.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

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
	
	//매일 오전1시에 실행(초 분 시 일 월 요일 년도)
//	@Scheduled(cron = "0 0 1 * * *")
	@Scheduled(cron = "0 10 * * * *")
	@Transactional(isolation=Isolation.SERIALIZABLE)
	public void fileConvert() throws Exception {
		logger.info("ScheduleService.fileConvert() START");
		
		List<Map> convertList = comDao.selectList("st.S_ST_FILE_CONVERT_PROCESSING", null);
		
		stService.convert(convertList, new HashMap(), "-1", "SERVER");
				
		logger.info("ScheduleService.fileConvert() END");
		
	}
	
}
