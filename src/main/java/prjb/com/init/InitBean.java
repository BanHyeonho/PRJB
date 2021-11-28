package prjb.com.init;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import prjb.com.service.ComService;
import prjb.com.util.CryptoUtil;

@Component
public class InitBean{

	//암호화변수
	public static CryptoUtil CryptoClass;
	private static String key;
	private static String[] encryptList;
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
    @Value("#{commonConfig['cryptoClass']}")
    private void setCryptoClass(String className) throws Exception{
    	
        if(className == null){
            return;
        }
        Class<?> dyClass = Class.forName(className);
        Object obj = dyClass.newInstance();
        CryptoClass = (CryptoUtil)obj;
    }
    
	/**
	 * 16자리의 키값으로 초기화한다. -키값의 길이는 16자리보다 커야한다.
	 * @throws UnsupportedEncodingException 
	 * 
	 */
	@Value("#{commonConfig['encrytKey']}")
	private void setKey(String p_key) throws UnsupportedEncodingException{
		key = CryptoClass.setKey(p_key);
    }

	@Value("#{commonConfig['encrytList']}")
	private void setList(String encrytList){
		if(encrytList == null) {
			encryptArray = new ArrayList<String>();
		}else {
			encryptList = encrytList.split(",");
			encryptArray = new ArrayList(Arrays.asList(encryptList));	
		}
    }
	
	/**
	 * 의존성 주입후 초기화
	 * @throws Exception
	 */
	@PostConstruct
    private void init() throws Exception {
			
		//다국어전체 초기화
		comService.setMlg();
    }
		
}