package prjb.com.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Field;
import java.math.BigInteger;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.SecureRandom;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.crypto.Cipher;
import javax.servlet.http.HttpServletRequest;

import org.apache.tomcat.util.codec.binary.Base64;
import org.mozilla.universalchardet.UniversalDetector;
import org.springframework.jdbc.support.JdbcUtils;

public class ComUtil {


	/**
	 * 파일인코딩 정보 리턴
	 * @param file
	 * @return EUC-KR , UTF-8
	 */
	public static String getEncodingType(File file){
		String result = null;
		try {
			byte[] buf = new byte[4096]; 
			FileInputStream fis = new FileInputStream(file); 
			UniversalDetector detector = new UniversalDetector(null); 
			int nread;
			while ((nread = fis.read(buf)) > 0 && !detector.isDone()) { 
				detector.handleData(buf, 0, nread); 
			} 
			detector.dataEnd(); 
			String encoding = detector.getDetectedCharset(); 
			if (encoding != null) {
				result = encoding.toUpperCase();
			} 
			else {
	//			System.out.println("No encoding detected.");
				result = null;
			} 
			detector.reset();
			}
		catch(Exception e) {
			e.getStackTrace();
		}
		return result;
	}
	
	/**
	 * Clob 데이터 저장을 위한 문자열 길이 4000자 단위로 clob데이터로 리턴
	 * @param str
	 * @return
	 */
	public static String getClob(String str) {
		//최대글자수
		int maxSize = 1000;	//최대 4000byte 지만 안전하게 1000글자를 최대로 한다. 글자에따라 byte 사이즈가 다름.
		StringBuffer result = new StringBuffer();
		if(str != null &&
		!str.isEmpty()){
			
            if(str.getBytes().length <= maxSize) {
            	result.append("TO_CLOB('");
            	result.append(str);
            	result.append("')");
            	
            }else{

            	int strLen = str.length();
            	int idx = 0;
            	
            	do {
            		
            		result.append("TO_CLOB('");
                	result.append(str.substring(idx, Math.min(strLen, idx += maxSize ) ));
                	
                	if(idx < strLen) {
                		result.append("') || ");
                	}
                	else {
                		result.append("')");
                	}
            	}while(idx < strLen);
            	
            }
            
            return result.toString();
            
        } else {
            return "null";
        }
	}
	
	/**
	 * 난수발생
	 * @return
	 */
	public static String getRandomKey() {
		
		StringBuffer temp = new StringBuffer();
		Random rnd = new Random();
		
		for (int i = 0; i < 20; i++) {
		    int rIndex = rnd.nextInt(3);
		    switch (rIndex) {
		    case 0:
		        // a-z
		        temp.append((char) ((int) (rnd.nextInt(26)) + 97));
		        break;
		    case 1:
		        // A-Z
		        temp.append((char) ((int) (rnd.nextInt(26)) + 65));
		        break;
		    case 2:
		        // 0-9
		        temp.append((rnd.nextInt(10)));
		        break;
		    }
		}

		return temp.toString();
	}
	
	/**
	 * 브라우저 확인
	 * @param request
	 * @return
	 */
	public static String getBrowser(HttpServletRequest request) {
		String header = request.getHeader("User-Agent");
		if (header.indexOf("MSIE") > -1 || header.indexOf("Trident") > -1)
			return "MSIE";
		else if (header.indexOf("Chrome") > -1)
			return "Chrome";
		else if (header.indexOf("Opera") > -1)
			return "Opera";
		return "Firefox";
	}

	public static String getDisposition(String filename, String browser) throws Exception {
		String dispositionPrefix = "attachment;filename=";
		String encodedFilename = null;
		if (browser.equals("MSIE")) {
			encodedFilename = URLEncoder.encode(filename, "UTF-8").replaceAll("\\+", "%20");
		} else if (browser.equals("Firefox")) {
			encodedFilename = "\"" + new String(filename.getBytes(StandardCharsets.UTF_8), "8859_1") + "\"";
		} else if (browser.equals("Opera")) {
			encodedFilename = "\"" + new String(filename.getBytes(StandardCharsets.UTF_8), "8859_1") + "\"";
		} else if (browser.equals("Chrome")) {
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < filename.length(); i++) {
				char c = filename.charAt(i);
				if(c == ' '){
					sb.append(c);
				}
				else{
					sb.append(URLEncoder.encode("" + c, "UTF-8"));
				}

			}
			encodedFilename = sb.toString();
		}
		return dispositionPrefix + encodedFilename;
	}
	
	/**
	 * 클라이언트 IP 리턴
	 * @param request
	 * @return
	 */
	public static String getAddress(HttpServletRequest request) {
	
		String ip = request.getHeader("X-FORWARDED-FOR") == null ? request.getRemoteAddr() : request.getHeader("X-FORWARDED-FOR");
		
		return ip;
	}
		
	/**
	 * 접속브라우저의 언어설정 첫번째가 한글인지 체크
	 * @param request
	 * @return
	 */
	public static boolean langKoChk(HttpServletRequest request) {
		
		return "KO".equals(request.getHeader("accept-language").substring(0,2).toUpperCase()) ? true : false;
	}
	/**
	 * 카멜케이스를 언더바문자로 변경 
	 * @param camelString
	 * @return
	 */
	public static String getUnderScore(String camelString) {
		String regex = "([a-z])([A-Z]+)";
		String replacement = "$1_$2";
		
		return String.valueOf(nvl(camelString, "")).replaceAll(regex, replacement).toLowerCase();
	}
	
	/**
	 * 언더바문자를 카멜케이스로 변경 
	 * @param camelString
	 * @return
	 */
	public static String getCamelCase(String underScore) {
		
		return JdbcUtils.convertUnderscoreNameToPropertyName(underScore);
	}
	
	/**
	 * nvl 처리
	 * @param str
	 * @param str2
	 * @return
	 */
	public static Object nvl(Object str, Object str2) {
		return str == null ? str2 :  str;
	}
	
	/**
	 * request 파라미터 추출(순서없음)
	 * @param request
	 * @return
	 */
	public static Map getParameterMap(HttpServletRequest request) {
		return getParameterMap(request, null);
	}
	
	/**
	 * request 파라미터 추출
	 * @param request
	 * @param mapType - map타입 : SORT순서있음
	 * @return
	 */
	public static Map getParameterMap(HttpServletRequest request, String mapType) {
		// 파라미터 이름
		Enumeration paramNames = request.getParameterNames();

		// 저장할 맵
		Map paramMap = ("SORT".equals(mapType) ? new LinkedHashMap() : new HashMap());
		// 맵에 저장
		while(paramNames.hasMoreElements()) {
			String name	 = paramNames.nextElement().toString();
			String value = request.getParameter(name);
	
			paramMap.put(name, value);
		}

		// 결과반환
		return paramMap;
	}
	
	/**
	 * RequestBody 추출 
	 * @param request
	 * @return
	 * @throws IOException
	 */
	public static String getBody(HttpServletRequest request){
		 
        String body = null;
        StringBuilder stringBuilder = new StringBuilder();
        BufferedReader bufferedReader = null;
 
        try {
            InputStream inputStream = request.getInputStream();
            if (inputStream != null) {
                bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
                char[] charBuffer = new char[128];
                int bytesRead = -1;
                while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
                    stringBuilder.append(charBuffer, 0, bytesRead);
                }
            } else {
                stringBuilder.append("");
            }
        } catch (IOException e) {
        	e.printStackTrace();
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (IOException e) {
                	e.printStackTrace();
                }
            }
        }
 
        body = stringBuilder.toString();
        return body;
    }

	/**
	 * 암호화키(salt) 생성 
	 */
	public static String getSalt(){
		
		SecureRandom random;
		String salt = null;
		
		try {
			random = SecureRandom.getInstance("SHA1PRNG");
		
			byte[] bytes = new byte[16];
			random.nextBytes(bytes);
			salt = new String(java.util.Base64.getEncoder().encode(bytes));
		
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return salt;
	}
	
	/**
	 * SHA-512 암호화
	 */
	public static String getSHA512(String param, String salt){
		
		MessageDigest md;
		String hex= null;
		
		try {
			md = MessageDigest.getInstance("SHA-512");
			md.reset();
			md.update(salt.getBytes("UTF-8"));
			md.update(param.getBytes("UTF-8"));
			hex = String.format("%0128x", new BigInteger(1, md.digest()));
		
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return hex;
	}
	
	/**
	 * RSA 키생성
	 */
	public static HttpServletRequest getKeyPair(HttpServletRequest request) throws NoSuchAlgorithmException{
		
		KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
		keyPairGenerator.initialize(1024, new SecureRandom());
		
		KeyPair keyPair = keyPairGenerator.genKeyPair();
		
		Key publicKey = keyPair.getPublic();
		Key privateKey = keyPair.getPrivate();
		
		request.getSession().setAttribute("publicKey", java.util.Base64.getEncoder().encodeToString(publicKey.getEncoded()));
		request.getSession().setAttribute("privateKey", java.util.Base64.getEncoder().encodeToString(privateKey.getEncoded()));
		
			
		return request;
	}
	
	/**
	 * RSA 복호화
	 */
	public static String decrypt(String p_privateKey, String val) throws Exception {
	   	 
 		byte[] bPrivateKey = Base64.decodeBase64(p_privateKey.getBytes());
 
 		KeyFactory keyFactory = KeyFactory.getInstance("RSA");
 
 		PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(bPrivateKey);
 		PrivateKey privateKey = keyFactory.generatePrivate(privateKeySpec);
 
 		
 		byte[] blogin_pw = Base64.decodeBase64(val.getBytes());
 		Cipher cipher = Cipher.getInstance("RSA");
 		cipher.init(Cipher.DECRYPT_MODE, privateKey);
 		byte[] blogin_pw2 = cipher.doFinal(blogin_pw);
 		val = new String(blogin_pw2);
 
 		return val;
 
 	}
	
	/**
	 * 클래스 필드 조회
	 */
	public static List<Field> getAllFields( Class<?> targetClass){
		ArrayList result;
		
		for (result = new ArrayList(); null != targetClass; targetClass = targetClass.getSuperclass()) {
			Field[] arr = targetClass.getDeclaredFields();
			if( null != arr) {
				Field[] var3 = arr;
				int var4 = arr.length;
				for (int var5 = 0; var5 < var4; ++var5) {
					Field field = var3[var5];
					result.add(field);
				}
			}
		}
		
		return result;
	}
	
	/**
	 * 빈값체크
	 */
	public static boolean isBlank(CharSequence cs) {
        int strLen;
        if (cs != null && (strLen = cs.length()) != 0) {
            for(int i = 0; i < strLen; ++i) {
                if (!Character.isWhitespace(cs.charAt(i))) {
                    return false;
                }
            }

            return true;
        } else {
            return true;
        }
    }
	
	/**
	 * 클래스의 필드 리턴
	 */
	public static Field getField(Class<?> targetClass, String fieldName) throws NoSuchFieldException {
        if (null == targetClass) {
            throw new NoSuchFieldException("TargetClass is null!");
        } else if (isBlank(fieldName)) {
            throw new NoSuchFieldException("FieldName is blank!");
        } else {
            Class<?> clazz = targetClass;
            Field result = null;

            while(null != clazz) {
                try {
                    result = clazz.getDeclaredField(fieldName);
                    clazz = null;
                } catch (NoSuchFieldException var5) {
                    clazz = clazz.getSuperclass();
                }
            }

            if (null == result) {
                throw new NoSuchFieldException("Can't find such field! Class : " + targetClass + ", Field name : " + fieldName);
            } else {
                return result;
            }
        }
    }
	
}
