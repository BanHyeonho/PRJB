package prjb.com.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import prjb.com.service.ComService;

/**
 * 로드밸런싱 되지않고, 모든톰캣에서 실행되어야 하는 url
 * @author Administrator
 *
 */
@RequestMapping("/broad")
@Controller("BroadController")
public class  BroadController{

	@Autowired
	ComService comService;
	
	private static final Logger logger = LoggerFactory.getLogger(BroadController.class);
	
	/**
	 * 다국어 갱신
	 */
	@RequestMapping(value = "/setMlg")
	public @ResponseBody Map setMlg(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		Map<String, Object> resultMap = new HashMap();
		
		comService.setMlg();
		resultMap.put("result", "success");
		
		return resultMap;
	}
	
}
