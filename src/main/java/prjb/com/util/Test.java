package prjb.com.util;

public class Test {

	public static void main(String[] args) {
		String test = "test.avi";
		
		System.out.println(test);
		System.out.println(test.indexOf(".")+1);
		System.out.println(test.lastIndexOf(".")+1);
		System.out.println(test.substring(0, test.lastIndexOf(".")));
		
//		String text = "<SYNC Start=47674><P Class=KRCC>\r\n" + 
//				"멕시코, 익스텐코\r\n" + 
//				"<SYNC Start=51469><P Class=KRCC>&nbsp;\r\n" + 
//				"<SYNC Start=73648><P Class=KRCC>\r\n" + 
//				"닉, 안타까운 일이긴 해도<br>\r\n" + 
//				"우리가 올 건 없잖아요\r\n" + 
//				"<SYNC Start=76517><P Class=KRCC>&nbsp;";
////		System.out.println(text);
//		text = text.replaceAll("<br>", "\n");
//		System.out.println(text);
//		text = removeTag(text);
//		System.out.println(text);
	}

	public static String removeTag(String str) {
		StringBuilder result = new StringBuilder();
		String[] strSp = str.split("");
		boolean appendYn = true;
		for (int i = 0; i < strSp.length; i++) {
			String s = strSp[i];
			if("<".equals(s)) {
				appendYn = false;
			}
			else if(">".equals(s)){
				appendYn = true;
			}
			else if(appendYn){
				result.append(s);
			}
		}
		return result.toString();
	}
	public static String SyscChg(String str) {
		StringBuilder result = new StringBuilder();
		String[] strSp = str.split("");
		boolean appendYn = true;
		for (int i = 0; i < strSp.length; i++) {
			String s = strSp[i];
			if("<".equals(s)) {
				appendYn = false;
			}
			else if(">".equals(s)){
				appendYn = true;
			}
			else if(appendYn){
				result.append(s);
			}
		}
		return result.toString();
	}
}
