package prjb.com.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;

public class HttpUtil {

	public static Map call(Map param) {
		Map result = new HashMap();
		HttpURLConnection conn = null;
		
		try{
				URL url = new URL(String.valueOf(param.get("url")));
				String method = param.get("method") == null ? "GET" : String.valueOf(param.get("method"));	// POST / GET / PUT / DELETE
				
		        conn = (HttpURLConnection)url.openConnection();
		        conn.setRequestMethod(method);
		        conn.setRequestProperty("Content-Type", "application/json");

		        conn.setDoOutput(true);
		        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));

		        JSONObject json = null;
		        if(param.get("data") != null && param.get("data") instanceof Map) {
		        	json = new JSONObject(param.get("data"));
		        }
		        else {
		        	json = new JSONObject();
		        }
		        
		        bw.write(json.toString());
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
