package prjb.com.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.json.JSONObject;

public class HttpUtil {

	/**
	 * http 요청
	 * @param p_param(url-String, method-String)
	 * @param p_header(contentType-String...) setRequestProperty
	 * @param body() write
	 * @return
	 */
	public static Map call(Map p_param, Map p_header, Map p_body) {
		Map result = new HashMap();
		HttpURLConnection conn = null;
		
		try{
				URL url = new URL(String.valueOf(p_param.get("url")));
				String method = p_param.get("method") == null ? "GET" : String.valueOf(p_param.get("method"));	// POST / GET / PUT / DELETE
				
		        conn = (HttpURLConnection)url.openConnection();
		        conn.setRequestMethod(method);
		        
		        if(p_header == null) {
		        	conn.setRequestProperty("Content-Type", "application/json");
		        }
		        else {
		        	Iterator<String> keys = p_header.keySet().iterator();
		            while( keys.hasNext() ){

		                String key = keys.next();                
		                conn.setRequestProperty(key, (String) p_header.get(key));
		                
		            }
		        }
		        
		        conn.setDoOutput(true);
		        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
		        
		        StringBuilder dataString = new StringBuilder();           
	            
		        if(p_body != null) {
		        	
		            Iterator<String> keys = p_body.keySet().iterator();
		            int idx = 0;
		            while( keys.hasNext() ){

		                String key = keys.next();

		                if(idx == 0) {
		                	dataString.append(key + "=" + p_body.get(key));
		                }
		                else {
		                	dataString.append("&" + key + "=" + p_body.get(key));
		                }
		                ++idx;
		            }
		        }
		        else {
		        	dataString.append("");
		        }
	            bw.write(dataString.toString());
	            
		        bw.flush();
		        bw.close();

		        //HTTP 응답 코드 수신 
		        int responseCode = conn.getResponseCode();
		        if(responseCode == 200) {

		        	//서버에서 보낸 응답 데이터 수신 받기
		        	BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			        StringBuilder sb = new StringBuilder();
	                String line = "";
	                while ((line = br.readLine()) != null) {
	                    sb.append(line);
	                }
	                br.close();
	                JSONObject responseJson = new JSONObject(sb.toString());
	                result.put("data", responseJson.toMap());
	                
		        }
		        System.out.println(String.valueOf(p_param.get("url")) + " ::: responseCode ::: " + responseCode);
		        result.put("responseCode", responseCode);

		    }catch(Exception e) {
		          e.printStackTrace();
		    }finally {
		    	if(conn != null) {
		    		conn.disconnect();	
		    	}
			}
		
		return result;
	}
	
}
