package prjb.com.util;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.util.*;

public class ModifiableRequest extends HttpServletRequestWrapper{

	HashMap params;
	List<MultipartFile> fileList;

	/** * @param request */
	public ModifiableRequest(HttpServletRequest request) {
		super(request);
		this.params = new HashMap(request.getParameterMap());

		//org.apache.catalina.connector.RequestFacade : MultipartHttpServletRequest 캐스팅불가
		if(!"org.apache.catalina.connector.RequestFacade".equals(request.getClass().getName())){
			MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
			this.fileList = multipartRequest.getFiles("File");
		}

	}

	/** * @param request */
	public ModifiableRequest(HttpServletRequest request, String saveName) {
		super(request);
		this.params = new HashMap(request.getParameterMap());

		//org.apache.catalina.connector.RequestFacade : MultipartHttpServletRequest 캐스팅불가
		if(!"org.apache.catalina.connector.RequestFacade".equals(request.getClass().getName())){
			MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
			this.fileList = multipartRequest.getFiles(saveName + "_File");
		}
	}

	public List<MultipartFile> getFileList(){
		return fileList;
	}
	/*
	 * (non-Javadoc) * @see
	 * javax.servlet.ServletRequest#getParameter(java.lang.String)
	 */

	public String getParameter(String name) {
		String returnValue = null;
		String[] paramArray = getParameterValues(name);
		if (paramArray != null && paramArray.length > 0) {
			returnValue = paramArray[0];
		}
		return returnValue;
	}

	/* (non-Javadoc) * @see javax.servlet.ServletRequest#getParameterMap() */ 
	public Map getParameterMap() {
		return Collections.unmodifiableMap(params);
	}

	/* (non-Javadoc) * @see javax.servlet.ServletRequest#getParameterNames() */ 
	public Enumeration getParameterNames() {
		return Collections.enumeration(params.keySet());
	}

	/*
	 * (non-Javadoc) * @see
	 * javax.servlet.ServletRequest#getParameterValues(java.lang.String)
	 */ 
	public String[] getParameterValues(String name) {
		String[] result = null;
		String[] temp = (String[]) params.get(name);
		if (temp != null) {
			result = new String[temp.length];
			System.arraycopy(temp, 0, result, 0, temp.length);
		}
		return result;
	}

	/**
	 * * Sets the a single value for the parameter. Overwrites any current values.
	 * * @param name Name of the parameter to set * @param value Value of the
	 * parameter.
	 */
	public void setParameter(String name, String value) {
		String[] oneParam = { value };
		setParameter(name, oneParam);
	}

	/**
	 * * Sets multiple values for a parameter. * Overwrites any current values.
	 * * @param name Name of the parameter to set * @param values String[] of
	 * values.
	 */
	public void setParameter(String name, String[] values) {
		params.put(name, values);
	}
	
	public void removeParameter(String name) {
		params.remove(name);
	}
	
	public void clearParameters() {
		params.clear();
	}
	
}
