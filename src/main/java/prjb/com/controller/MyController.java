package prjb.com.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import prjb.com.service.MyService;

@RequestMapping("/my")
@Controller("MyController")
public class MyController {

	@Autowired
	MyService myService;
	
	private static final Logger logger = LoggerFactory.getLogger(MyController.class);
	
	/**
	 * 파일관리 저장
	 * @throws Exception
	 */
	@RequestMapping(value = "/fileManageSave", method = RequestMethod.POST)
	public @ResponseBody Map fileManageSave(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		Map<String, Object> resultMap = new HashMap();
		
		resultMap.put("result", myService.fileManageSave(request));
		
		return resultMap;
	}
	
}
