package prjb.com.util;

import java.io.File;

/**
 * File 클래스에 없는 변수들을 추가하기 위한 커스텀 클래스
 * @author Administrator
 *
 */
public class CustomFile extends File{

	private String fileDownName;
	
	public String getFileDownName() {
		return fileDownName;
	}

	public void setFileDownName(String fileDownName) {
		this.fileDownName = fileDownName;
	}

	public CustomFile(String s) {
		super(s);
		// TODO Auto-generated constructor stub
	}

}
