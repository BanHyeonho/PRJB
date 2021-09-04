package com.model;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Alias("CommMlg")
public class CommMlg {
	
	private long commMlgId;
	private String mlgCd; 
	private String mlgKo;
	private String mlgEn;
	private String description; 
	private String cid; 
	private String cdt; 
	private String mid; 
	private String mdt;
	private String gState;
}
