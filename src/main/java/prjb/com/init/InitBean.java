package prjb.com.init;

import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import prjb.com.service.ComService;

@Component
public class InitBean{

	public static Map<String, Map<String,String>> msgMLGKO = null;
	public static Map<String, Map<String,String>> msgMLGEN = null;
	
	@Autowired
	ComService comService;
	
	/**
	 * 의존성 주입후 초기화
	 * @throws Exception
	 */
	@PostConstruct
    private void init() throws Exception {
		//다국어전체 초기화
		comService.setMlg();
    }
		
}