package prjb.com.init;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import prjb.com.service.ComService;
import prjb.com.util.ComUtil;
import prjb.com.util.CryptoUtil;

@Component
public class InitBean{

	@Value("#{commonConfig['cryptoClass']}")
	private String className;
	
	@Value("#{commonConfig['encrytKey']}")
	private String encrytKey;
	
	@Value("#{commonConfig['encrytList']}")
	private String encrytList;
	
	//암호화
	public static CryptoUtil CryptoClass;
	public static ArrayList<String> encryptArray;
	
	//다국어
	public static Map<String, Map<String,String>> msgMLGKO = null;
	public static Map<String, Map<String,String>> msgMLGEN = null;
	
		
	@Autowired
	ComService comService;
		
    /**
     * 암호화 클래스 주입
     * @param className
     */
    private void setCryptoClass(String className) throws Exception{
    	
        if(className == null){
            return;
        }
        Class<?> dyClass = Class.forName(className);
        Object obj = dyClass.newInstance();
        CryptoClass = (CryptoUtil)obj;
        CryptoClass.setKey(encrytKey);
        
        if(encrytList == null) {
        	encryptArray = new ArrayList<String>();
		}else {
			encryptArray = new ArrayList(Arrays.asList( encrytList.split(",")));	
		}
        
    }
    
	/**
	 * 의존성 주입후 초기화
	 * @throws Exception
	 */
	@PostConstruct
    private void init() throws Exception {
		//암호화클래스
		setCryptoClass(className);
		
		//다국어전체 초기화
		comService.setMlg();
    }

}