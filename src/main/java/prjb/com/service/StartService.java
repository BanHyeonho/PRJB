package prjb.com.service;

import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class StartService{

	public static Map<String, Map<String,String>> msgMLGKO = null;
	public static Map<String, Map<String,String>> msgMLGEN = null;
	
	@Autowired
	ComService comService;
	
	@PostConstruct
    private void init() throws Exception {
		//다국어전체 초기화
		comService.setMlg();
    }
		
}