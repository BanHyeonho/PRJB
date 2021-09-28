package prjb.com.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import prjb.com.service.ComService;
import prjb.com.util.HttpUtil;

/**
 * 로드밸런싱 되지않고, 모든톰캣에서 실행되어야 하는 url
 * url생성시 /sub/ url도 함께 생성하여 다른톰캣에서도 실행되도록 처리한다.
 * @author Administrator
 *
 */
@RequestMapping("/broad")
@Controller("BroadController")
public class  BroadController{

	@Autowired
	ComService comService;
	
	private static final Logger logger = LoggerFactory.getLogger(BroadController.class);
	private static final String[] tomcats = {"main", "sub"};
			
	/**
	 * 다국어 갱신
	 */
	@RequestMapping(value = "/setMlg")
	public @ResponseBody Map setMlg(HttpServletRequest request, HttpServletResponse response){
		
		Map<String, Object> resultMap = new HashMap();
		List resultList = new ArrayList();
		for (String tomcat : tomcats) {
			try {
				Map httpParam = new HashMap();
				String url = request.getRequestURL().toString().replaceAll(request.getRequestURI(), "");
				httpParam.put("url", url + "/broad/" + tomcat + "/setMlg");
				httpParam.put("method", RequestMethod.GET);
				Map dataParam = new HashMap();
				dataParam.put("tomcat", tomcat);
				httpParam.put("data", dataParam);
				Map result = HttpUtil.call(httpParam);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		resultMap.put("status", "success");
		return resultMap;
	}
	@RequestMapping(value = "/{tomcat}/setMlg")
	public @ResponseBody Map setMlgExec(@PathVariable("tomcat") String tomcat, HttpServletRequest request, HttpServletResponse response) throws Exception{
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		Map<String, Object> resultMap = new HashMap();
		comService.setMlg();
		resultMap.put("status", "success");
		resultMap.put("url", request.getRequestURI());
		return resultMap;
	}
	
	
	
}
