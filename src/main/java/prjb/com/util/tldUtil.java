package prjb.com.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.taglibs.standard.tag.common.core.Util;

import prjb.com.service.StartService;

/**
 * 
 * @author Administrator
 * JSP el function
 */
public class tldUtil {
	
	/**
	 * 다국어 + XSS 방지
	 * @param param
	 * @return
	 */
	public static String msg(HttpServletRequest request, String param) {
		
		Map<String, Map<String,String>> msgMap = ComUtil.langKoChk(request) ? StartService.msgMLGKO : StartService.msgMLGEN;
		
		if (param == null) {
			return "";
		}
		else if(msgMap.get(param) == null) {
			return param + " : 다국어 미등록";
		}
		param = msgMap.get(param).get("VALUE");
        return Util.escapeXml(param);
	}
	
	/**
	 * 스크립트,CSS 캐시방지
	 * @return
	 */
	public static String jsNow() {
		SimpleDateFormat jsFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		return jsFormat.format(new Date());
	}
	
}
