package com.model;

import org.apache.ibatis.type.Alias;

import com.encryt.Encrypt;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Alias("CommUser")
public class CommUser {
	
	private long commUserId;
	private long commUserSaltId;
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
