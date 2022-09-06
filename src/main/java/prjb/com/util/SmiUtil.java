package prjb.com.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import prjb.com.model.SubtitleTimeCode;
import prjb.com.model.Vtt;

public class SmiUtil {
	
	/**
	 * smi -> vtt 형식으로 변환
	 * @param isr
	 * @return
	 * @throws Exception 
	 */
	public static Map convert(InputStreamReader isr) throws Exception{
		
		Map<String, StringBuilder> contentMap = new HashMap();
		List<Vtt> list = new ArrayList();
		
		//입력 버퍼 생성		
		try (BufferedReader bufReader = new BufferedReader(isr)){
			
			String line = "";
			boolean startYn = false;
			
			while((line = bufReader.readLine()) != null){
				
				//잘못된 태그 수정
				line = tagAdjust(line.trim());
				
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
					
					String lang = getLang(line);
					if(!"".equals(lang)) {
						list.get( list.size()-1 ).setLang(lang);
					}
					
					line = removeTag("p", line);
					line = removeTag("br", line);
					line = removeTag("font", line);
					line = removeTag("i", line);
					line = removeTag("b", line);
					
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
			
		}
		
		for (Vtt vtt : list) {
			if(vtt.getEndTime() == null) {
				break;
			}
			
			String text = removeRemark(vtt.getText()).trim();
			if(!"&nbsp;".equals(text)) {
				
				String lang = vtt.getLang();
				
				if(contentMap.get(lang) == null) {
					StringBuilder content = new StringBuilder("WEBVTT").append("\n").append("\n");
					content.append("\n").append(vtt.getStartTime()).append(" --> ").append(vtt.getEndTime()).append("\n");
					content.append(text).append("\n");
					contentMap.put(lang, content);
				}
				else {
					contentMap.get(lang).append("\n").append(vtt.getStartTime()).append(" --> ").append(vtt.getEndTime()).append("\n");
					contentMap.get(lang).append(text).append("\n");
				}
				
			}
			
		}
		
		return contentMap;
	}
	
	/**
	 * 시작시간 추출
	 * @param str
	 * @return
	 */
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
	
	/**
	 * 자막언어 추출
	 * @param str
	 * @return
	 */
	public static String getLang(String str) {
		if(str.toLowerCase().contains("<p")) {			
			String tmp = str.substring(str.toLowerCase().indexOf("<p"));
			tmp = tmp.substring(0, tmp.indexOf(">")+1);
			str = tmp.toLowerCase().replace("<p", "").trim().replace("class", "").trim().replace("=", "").trim().replace(">", "").replace("cc", "").trim();
		}
		else {
			str = "";
		}		
		
		return str;
	}
	
	/**
	 * 태그제거
	 * @param type
	 * @param str
	 * @return
	 */
	public static String removeTag(String type, String str) {
		
		switch (type) {
		case "sync":
			if(str.toLowerCase().contains("<sync")) {
				String tmp = str.substring(str.toLowerCase().indexOf("<sync"));
				tmp = tmp.substring(0, tmp.indexOf(">")+1);
				str = str.replace(tmp, "").trim();
			}
			break;
		case "p":
			if( str.toLowerCase().contains("<p") ) {
				String tmp = str.substring(str.toLowerCase().indexOf("<p"));
				tmp = tmp.substring(0, tmp.indexOf(">")+1);
				str = str.replace(tmp, "").trim();
			}
			break;
		case "br":
			str = str.replaceAll("<br>", "\n").replaceAll("<BR>", "\n");
			break;
		case "b":
			str = str.replaceAll("<b>", "").replaceAll("</b>", "");			
			break;
		case "i":
			str = str.replaceAll("<i>", "").replaceAll("</i>", "");
			break;
		case "font":
			str = str.replaceAll("</font>", "");
			while( str.toLowerCase().contains("<font") ) {
				String tmp = str.substring(str.toLowerCase().indexOf("<font"));
				tmp = tmp.substring(0, tmp.indexOf(">")+1);
				str = str.replace(tmp, "").trim();
			}
			break;
		}
		
		return str;
	}
	
	/**
	 * 주석제거
	 * @param str
	 * @return
	 */
	public static String removeRemark(String str) {
		String result = null;
		if(str.indexOf("<!--") > -1) {
			do {
				int idx = str.indexOf("<!--");
				int idx2 = str.indexOf("-->") +3;
				str = str.replace( str.substring(idx, idx2), "");
				
				
			}while(str.indexOf("<!--") > -1);
		}
		
		result = str;
		
		return result;
	}
	
	/**
	 * 잘못된 태그 수정
	 * @return
	 */
	public static String tagAdjust(String str) {
		
		String[] sp = str.split("");
		StringBuilder result = new StringBuilder();
		
		boolean open = false;
		for (String s : sp) {
			//태그가 안닫힌경우 --예) <SYNC Start=4864200<P Class=KRCC>&nbsp;
			if("<".equals(s) && open) {
				result.append(">");
				open = false;
			}
			//태그를 열고 공백이 들어간경우 --예) <SYNC Start=4790144>< P Class=KRCC>&nbsp;
			else if(" ".equals(s) && "<".equals(result.toString().substring(result.toString().length() -1)) ) {
				continue;
			}
			else if("<".equals(s)) {
				open = true;
			}
			else if(">".equals(s)) {
				open = false;
			}
			
			result.append(s);
		}
		
		
		return result.toString();
	}
}
