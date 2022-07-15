package prjb.com.init;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.jasypt.spring31.properties.EncryptablePropertiesPropertySource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Getter;
import prjb.com.service.ComService;
import prjb.com.util.CryptoUtil;

@Component
public class InitBean{

	@Autowired
	private EncryptablePropertiesPropertySource commonConfig;
	
	@Value("#{commonConfig['cryptoClass']}")
	private String className;
	@Value("#{commonConfig['encryptList']}")
	private String encryptList;
	
	private String encryptKey;
	
	private static String KAKAO_JAVASCRIPT;
	private static String KAKAO_REST_API;
	private static String KAKAO_ADMIN;
	
	private static String NAVER_CLIENT_ID;
	private static String NAVER_CLIENT_SECRET;
	
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
        CryptoClass.setKey(encryptKey);
        
        if(encryptList == null) {
        	encryptArray = new ArrayList<String>();
		}else {
			encryptArray = new ArrayList(Arrays.asList( encryptList.split(",")));	
		}
        
    }
    
	/**
	 * 의존성 주입후 초기화
	 * @throws Exception
	 */
	@PostConstruct
    private void init() throws Exception {
		
		encryptKey = (String) commonConfig.getProperty("encryptKey");
		
		KAKAO_JAVASCRIPT = (String) commonConfig.getProperty("KAKAO_JAVASCRIPT");
		KAKAO_REST_API = (String) commonConfig.getProperty("KAKAO_REST_API");
		KAKAO_ADMIN = (String) commonConfig.getProperty("KAKAO_ADMIN");
		NAVER_CLIENT_ID = (String) commonConfig.getProperty("NAVER_CLIENT_ID");
		NAVER_CLIENT_SECRET = (String) commonConfig.getProperty("NAVER_CLIENT_SECRET");
		
		//암호화클래스
		setCryptoClass(className);
		
		//다국어전체 초기화
		comService.setMlg();
    }

	public static String getKAKAO_JAVASCRIPT() {
		return KAKAO_JAVASCRIPT;
	}

	public static String getKAKAO_REST_API() {
		return KAKAO_REST_API;
	}

	public static String getKAKAO_ADMIN() {
		return KAKAO_ADMIN;
	}

	public static String getNAVER_CLIENT_ID() {
		return NAVER_CLIENT_ID;
	}

	public static String getNAVER_CLIENT_SECRET() {
		return NAVER_CLIENT_SECRET;
	}

	
}