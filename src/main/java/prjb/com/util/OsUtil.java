package prjb.com.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OsUtil {
	
	private static final Logger logger = LoggerFactory.getLogger(OsUtil.class);
	
	public static Map shellCmd(String command){
		Map result = new HashMap();
		
		Process process = null;
        Runtime runtime = Runtime.getRuntime();
        StringBuffer successOutput = new StringBuffer(); // 성공 스트링 버퍼
        StringBuffer errorOutput = new StringBuffer(); // 오류 스트링 버퍼

        
        String msg = null; // 메시지
 
        List<String> cmdList = new ArrayList<String>();
 
        // 운영체제 구분 (window, window 가 아니면 무조건 linux 로 판단)
        if (System.getProperty("os.name").indexOf("Windows") > -1) {
            cmdList.add("cmd");
            cmdList.add("/c");
        } else {
            cmdList.add("/bin/sh");
            cmdList.add("-c");
        }
        // 명령어 셋팅
        cmdList.add(command);
        String[] array = cmdList.toArray(new String[cmdList.size()]);

        try (BufferedReader successBufferReader = new BufferedReader(new InputStreamReader(process.getInputStream(), "UTF-8"));	// 성공 버퍼, shell 실행이 정상 동작했을 경우
    		 BufferedReader errorBufferReader = new BufferedReader(new InputStreamReader(process.getErrorStream(), "UTF-8")); 	// 오류 버퍼, shell 실행시 에러가 발생했을 경우
		){
 
            // 명령어 실행
            process = runtime.exec(array);
 
            while ((msg = successBufferReader.readLine()) != null) {
                successOutput.append(msg + System.getProperty("line.separator"));
            }
 
            while ((msg = errorBufferReader.readLine()) != null) {
                errorOutput.append(msg + System.getProperty("line.separator"));
            }
 
            // 프로세스의 수행이 끝날때까지 대기
            process.waitFor();
 
            // shell 실행이 정상 종료되었을 경우
            if (process.exitValue() == 0) {
            	result.put("state", true);
            	result.put("result", successOutput.toString());
                logger.info("성공 : " + successOutput.toString());
            } 
            // shell 실행이 비정상 종료되었을 경우
            else if(StringUtils.isNotBlank(errorOutput.toString())) {
            	result.put("state", false);
            	result.put("result", errorOutput.toString());
                logger.info("오류 : " + errorOutput.toString());
            }
            // shell 실행이 비정상 종료되었을 경우
            else {
            	result.put("state", false);
            	result.put("result", successOutput.toString());
                logger.info("비정상 종료 : " + successOutput.toString());
            }
 
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
        	process.destroy();
        }

        return result;
	}
	
}
