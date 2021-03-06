package prjb.com.crypto;

import java.io.UnsupportedEncodingException;
import java.security.Key;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.tomcat.util.codec.binary.Base64;

import prjb.com.util.CryptoUtil;

/**
 * 양방향 암호화 알고리즘인 AES256 암호화를 지원하는 클래스
 */
public final class AES256Util implements CryptoUtil{
	
	private static final String CIPHER_TRANSFORMATION = "AES/CBC/PKCS5Padding";
	private static final String ALGORITHM_AES = "AES";
    private static final String CHARACTER_ENCODING = "UTF-8";
	private static String iv;
	private static Key keySpec;

	/**
	 * 16자리의 키값으로 초기화한다. -키값의 길이는 16자리보다 커야한다.
	 * @throws UnsupportedEncodingException 
	 * 
	 */
	@Override
	public String setKey(String p_key) throws UnsupportedEncodingException{
    	String key = p_key;
    	iv = key.substring(0, 16);
		byte[] keyBytes = new byte[16];
		byte[] b = key.getBytes(CHARACTER_ENCODING);
		int len = (b.length > keyBytes.length ? keyBytes.length : b.length);
		System.arraycopy(b, 0, keyBytes, 0, len);
		keySpec = new SecretKeySpec(keyBytes, ALGORITHM_AES);
		return key;
    }
	
	/**
	 * AES256 으로 암호화 한다.
	 * @param str
	 * @return
	 */
	@Override
	public String encrypt(String str){
		
		String encryptStr = str;
		try {
			if(encryptYn(str)) {
				Cipher c = Cipher.getInstance(CIPHER_TRANSFORMATION);
				c.init(Cipher.ENCRYPT_MODE, keySpec, new IvParameterSpec(iv.getBytes()));
				byte[] encrypted = c.doFinal(str.getBytes(CHARACTER_ENCODING));
				encryptStr = new String(Base64.encodeBase64(encrypted));
			}
		} catch (Exception e) {}
		
		return encryptStr;
	}

	/**
	 * AES256으로 암호화된 txt 를 복호화한다.
	 * @param str
	 * @return
	 */
	@Override
	public String decrypt(String str){
		
		String decryptStr = str;
		try {
			Cipher c = Cipher.getInstance(CIPHER_TRANSFORMATION);
			c.init(Cipher.DECRYPT_MODE, keySpec, new IvParameterSpec(iv.getBytes()));
			byte[] byteStr = Base64.decodeBase64(str.getBytes());
			decryptStr = new String(c.doFinal(byteStr), CHARACTER_ENCODING);
		} catch (Exception e) {}
		
		return decryptStr;
	}
	
	/**
	 * 암호화 가능여부
	 * null 값은 암호화 하지않는다.
	 * 이미 암호화된 데이터는 암호화 하지않는다.
	 * @return
	 */
	private boolean encryptYn(String str) {
		boolean result = true;
		if(str == null) {
			result = false;
		}
		else if(!str.equals(decrypt(str))) {
			result = false;
		}
		return result;
	}
}
