package prjb.com.context;

import java.io.IOException;
import java.io.Reader;
import java.util.Enumeration;
import java.util.Properties;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.ibatis.io.Resources;

/**
 * ServletContext 로드시 경로설정
 * @author Administrator
 *
 */
public class PrjbServletContextListener implements ServletContextListener{

	public PrjbServletContextListener(){}

	/**
	 * ServletContext load
	 */
	@Override
	public void contextInitialized(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		ServletContext sc = sce.getServletContext();
		String location = sc.getInitParameter("vmOptionFilePath");
		
        Properties properties = new Properties();
        
        try {
            Reader reader = Resources.getResourceAsReader(location);
            properties.load(reader);
            
            Enumeration e = properties.propertyNames();
    		
    		while(e.hasMoreElements()) {
    			String key = (String)e.nextElement();
    			String value = properties.getProperty(key);
    			System.setProperty(key, value);
    			sc.log("::: Set System Property -> " + key + " = " + value);
    		}
    		
        } catch (IOException e) {
            e.printStackTrace();
        }
        
	}
	
	/**
	 * ServletContext unload
	 */
	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		ServletContextListener.super.contextDestroyed(sce);
	}

}
