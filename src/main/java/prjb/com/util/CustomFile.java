package prjb.com.util;

import java.io.File;

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
