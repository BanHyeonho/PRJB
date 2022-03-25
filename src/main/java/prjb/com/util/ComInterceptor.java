package prjb.com.util;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import prjb.com.init.InitBean;

public class ComInterceptor extends HandlerInterceptorAdapter {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		// TODO Auto-generated method stub
		String requestURI = request.getRequestURI();
		String loginSessionYn = String.valueOf(request.getSession().getAttribute("LOGIN_SESSION_YN"));
		
		//80포트가 아닌 다른포트로 접근시 80포트로 이동시켜 로드밸런싱 한다.
		if(!"localhost".equals(request.getServerName()) && request.getLocalPort() != 80) {
			response.sendRedirect(request.getScheme() + "://" + request.getServerName() + ":80" + requestURI);
			return true;
		}
		
//		//로그인 상태가 아니면서 특정 url 접근시 허용하지 않는다.
		//비로그인 상태
		if( !"1".equals(loginSessionYn) ) {
			
			switch (requestURI) {
				case "/registPage":
					return true;
				case "/registAction":
					return true;
				case "/loginPage":
					return true;
				case "/loginAction":
					return true;
				case "/":
					response.sendRedirect("/loginPage");
					break;
				default:
					response.sendError(9999);
					break;
			}
			return false;
		}
		//로그인한 상태
		else {
			
			switch (requestURI) {
				case "/loginPage":
					response.sendRedirect("/");
					return false;
				case "/registPage":
					response.sendRedirect("/");
					return false;
				case "/loginAction":
					response.sendError(9999);
					break;
				case "/registAction":
					response.sendError(9999);
					break;
				default:
					break;
			}
			
		}
		
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		
		String requestURI = request.getRequestURI();
		//로그아웃이 아닐때 다국어 메시지 셋팅
		if(!"/logout".equals(requestURI)) {
			Map<String, Map<String,String>> msgMap = ComUtil.langKoChk(request) ? InitBean.msgMLGKO : InitBean.msgMLGEN;
			
			if(modelAndView != null) {
				String lang = new ObjectMapper().writeValueAsString(msgMap);
				modelAndView.addObject("MLG", lang);	
			}	
		}
		
	}
	
}
