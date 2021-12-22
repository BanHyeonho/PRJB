package prjb.com.service;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import prjb.com.init.InitBean;
import prjb.com.mapper.ComDao;
import prjb.com.util.ComUtil;
import prjb.com.util.ErrorLogException;

@RestControllerAdvice("prjb.com.controller")
public class ExceptionService {

	@Autowired
	ComDao comDao;
	
	@ResponseBody
	@ExceptionHandler(Exception.class)
	public Object custom(HttpServletRequest request, HttpServletResponse response, Exception e){
		e.printStackTrace();
		
		Throwable cause = e.getCause();
        if(e.getCause() instanceof ErrorLogException){
        	Map logParam = new HashMap();
    		logParam.put("ERROR_LOCATION", e.getCause().getMessage());
    		logParam.put("ERROR_MSG", e.getMessage());
    		logParam.put("CID", request.getSession().getAttribute("COMM_USER_ID"));
    		logParam.put("CIP", ComUtil.getAddress(request));
        	insertErrorLog(logParam);
        }
		
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

	/**
	 * 에러발생시 로그저장
	 * @param p_param
	 */
	public void insertErrorLog(Map p_param) {
		try {
    		comDao.insert("com.I_ERROR_LOG_HISTORY", p_param);
    	}catch(Exception x) {
    		x.printStackTrace();
    	}
	}
}
