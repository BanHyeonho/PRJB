package prjb.com.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import prjb.com.model.SubtitleTimeCode;
import prjb.com.model.Vtt;

public class SmiUtil {
	
	public static String convert(InputStreamReader isr) {
		
		StringBuilder content = null;
		List<Vtt> list = new ArrayList();
		try {
			//입력 버퍼 생성
			BufferedReader bufReader = new BufferedReader(isr);
			
			content = new StringBuilder("WEBVTT").append("\n").append("\n");
			String line = "";
			boolean startYn = false;
			
			
			while((line = bufReader.readLine()) != null){
				line = line.trim();
				//자막시작
				if (!startYn 
				&& line.toLowerCase().startsWith("<sync")) {
					startYn = true;
                }
				
				if(startYn) {
					
					String start = getStart(line);
					
					//시작
					if( !"".equals(start) ) {
						line = removeTag("sync", line);
						Vtt vtt = new Vtt();
						vtt.setStartTime(start);
						
						if(list.size() > 0) {
							list.get( list.size()-1 ).setEndTime(start);
						}
						list.add(vtt);
						
					}
					
					line = removeTag("p", line);
					line = removeTag("br", line);
					
					String beforeStr = list.get( list.size()-1 ).getText();
					String resultLine = "";
					
					
					if( beforeStr == null 
					|| "".equals(beforeStr)
					) {
						resultLine = line;
					}
					else {
						if("".equals(line)) {
							resultLine = beforeStr + line;
						}
						else {
							resultLine = beforeStr + "\n" + line;
						}
					}
					
					resultLine = resultLine.replaceAll("[\n]{2,}", "\n");
					list.get( list.size()-1 ).setText(resultLine);
				}
			}
			//.readLine()은 끝에 개행문자를 읽지 않는다.            
			bufReader.close();
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		
		for (Vtt vtt : list) {
			if(vtt.getEndTime() == null) {
				break;
			}
			String text = vtt.getText().trim();
			if(!"&nbsp;".equals(text)) {
				content.append("\n").append(vtt.getStartTime()).append(" --> ").append(vtt.getEndTime()).append("\n");
				content.append(text).append("\n");	
			}
			
		}
		
		return content.toString();
	}
	
	public static String getStart(String str) {
		
		if(str.toLowerCase().contains("<sync")) {
			String tmp = str.substring(str.toLowerCase().indexOf("<sync"));
			tmp = tmp.substring(0, tmp.indexOf(">")+1);
			str = tmp.toLowerCase().replace("<sync", "").trim().replace("start", "").trim().replace("=", "").trim().replace(">", "").trim();

			str = new SubtitleTimeCode(Long.parseLong(str)).toString();
		}
		else {
			str = "";
		}		
		
		return str;
	}
	
	public static String removeP(String str) {
		
		if(str.toLowerCase().contains("<p")) {
			String tmp = str.substring(str.toLowerCase().indexOf("<p"));
			tmp = tmp.substring(0, tmp.indexOf(">")+1);
			str = str.replace(tmp, "").trim();
		}
		
		return str;
	}
	public static String removeTag(String type, String str) {
		switch (type) {
		case "br":
			str = str.replaceAll("<br>", "\n").replaceAll("<BR>", "\n");
			break;
		case "p":
			if(str.toLowerCase().contains("<p")) {
				String tmp = str.substring(str.toLowerCase().indexOf("<p"));
				tmp = tmp.substring(0, tmp.indexOf(">")+1);
				str = str.replace(tmp, "").trim();
			}
			break;
		case "sync":
			if(str.toLowerCase().contains("<sync")) {
				String tmp = str.substring(str.toLowerCase().indexOf("<sync"));
				tmp = tmp.substring(0, tmp.indexOf(">")+1);
				str = str.replace(tmp, "").trim();
			}
			break;
		}
		
		return str;
	}
}
