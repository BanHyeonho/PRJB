package prjb.com.model;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Alias("comMlg")
public class ComMlg {
	
	private long comMlgId;
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
