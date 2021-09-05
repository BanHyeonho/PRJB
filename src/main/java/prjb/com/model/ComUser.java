package prjb.com.model;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Alias("ComUser")
public class ComUser {
	
	private long comUserId;
	private long comUserSaltId;
	private String loginId; 
	private String pwd;
	private String salt;
	private String userNm; 
	private String useYn; 
	private String cid; 
	private String cdt; 
	private String mid; 
	private String mdt; 
}
