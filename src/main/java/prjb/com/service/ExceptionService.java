package prjb.com.service;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import prjb.com.init.InitBean;
import prjb.com.util.ComUtil;

@RestControllerAdvice("prjb.com.controller")
public class ExceptionService {

	@ResponseBody
	@ExceptionHandler(Exception.class)
	public Object custom(HttpServletRequest request, HttpServletResponse response, Exception e){
		
		Map<String, Map<String,String>> msgMap = ComUtil.langKoChk(request) ? InitBean.msgMLGKO : InitBean.msgMLGEN;
		Map<String, String> returnMap = new HashMap();
		String errorMsg = e.getMessage();
				
		Iterator<String> keys = msgMap.keySet().iterator();
        a:while( keys.hasNext() ){
            String key = keys.next();
            if("1".equals(msgMap.get(key).get("MSG_YN")) 
            && e.getMessage().contains(key)) {
            	errorMsg =  msgMap.get(key).get("VALUE");
            	break a;
            }
        }
        response.setStatus(9998);
        returnMap.put("errorMsg", errorMsg);
        
		return returnMap;
	}

}
