package prjb.com.util;

import java.io.UnsupportedEncodingException;

public interface CryptoUtil {
		
	public String setKey(String p_key) throws UnsupportedEncodingException;
	
	public String encrypt(String str);
	public String decrypt(String str);
}
