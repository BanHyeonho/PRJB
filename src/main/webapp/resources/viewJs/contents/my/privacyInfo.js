/**
 * 개인정보수정 
 */
let currentType;
const defaultProfileImg = '../img/default_profile.png';

$(document).ready(function() {
	
	$('.menu-div').on('click', f_tabClick);
	$('#removePwd2').on('click', f_removePwd2);
	$('#profileBtn').on('click', function(){
		$('#PROFILE_PICTURE').trigger('click');
	});
	$('#profileDelBtn').on('click', f_removeProfile);
	
	$('#PROFILE_PICTURE').on('change', function(e){
		
		if(e.currentTarget.files.length > 0
		&& e.currentTarget.files[0].type.indexOf('image/') > -1
		){
			
			var reader = new FileReader();
		    reader.onload = function(e2) {
		    	document.getElementById('PROFILE_PICTURE_PREVIEW').src = e2.target.result;
	    	};
		    reader.readAsDataURL(e.currentTarget.files[0]);
		}
		else{
			$('#PROFILE_PICTURE').val('');
		}
				
	});
	
	$('#KAKAO_YN').on('change', f_social_connect);
	$('#NAVER_YN').on('change', f_social_connect);
	
	$('.menu-div:eq(0)').trigger('click');
	
	Kakao.init(gv_KAKAO_JAVASCRIPT);
});

var f_tabClick = function(e){
	e.preventDefault();
    e.stopPropagation();
    
    if(currentType == $(e.currentTarget).attr('id')){
    	return;
    }
    
	$('.selected-menu').removeClass('selected-menu');
	$('.content-area').hide();
	$(e.currentTarget).addClass('selected-menu');
	$('#' + $(e.currentTarget).attr('id') + 'Container').show();
	
	f_search();
}
var f_removePwd2 = function(){
	if(confirm(gf_mlg('2차_비밀번호를_삭제_하시겠습니까'))){
		
		gf_ajax({
			QUERY_ID : 'com.U_REMOVE_PWD2'
		}
		, null
		, function(data){
			gf_toast(gf_mlg('2차_비밀번호가_삭제_되었습니다'), 'success');
			
			f_searchPrivacy('removePwd2');
		});
		
	}
}
var f_removeProfile = function(){
	if(confirm(gf_mlg('프로필_사진을_삭제_하시겠습니까'))){
		
		gf_ajax({
			QUERY_ID : 'my.U_REMOVE_PROFILE'
		}
		, null
		, function(data){
			gf_toast(gf_mlg('삭제_되었습니다'), 'success');
			f_searchPrivacy('removeProfile');
		});
		
	}
}
/*****************************************************************************************************************************************************************
 * 
 * 조회
 * 
 *****************************************************************************************************************************************************************/
var f_search = function(){
	var type =  $('.selected-menu').attr('id');
	currentType = type;
	
	switch (currentType) {
	case 'privacy':
		f_searchPrivacy('search');
		break;
	case 'social':
		f_searchSocial();
		break;
	}
	
}
var f_searchPrivacy = function(type){
	gf_ajax({
				QUERY_ID : 'my.S_MY_PRIVACY'
			}
			, null
			, function(data){
				
				if(data.result[0].PWD_USE_YN == '1'){
					$('.pwd-use').show();
				}
				else{
					$('.pwd-use').hide();
				}
				
				//단순조회
				if(type == 'search'){
					f_clear();
					gf_setFormData(data.result[0]);
					
					if(gf_nvl($('#PROFILE_PICTURE_PREVIEW').attr('src'), '') == ''){
						$('#PROFILE_PICTURE_PREVIEW').attr('src', defaultProfileImg);
					}
					
					if(data.result[0].PWD2_YN == '1'){
						$('#PWD2_STATE').show();
					}
				}
				//2차비밀번호 삭제 후
				else if(type == 'removePwd2'){
					$('#MODIFY_DATE').text(data.result[0]['MODIFY_DATE']);
					$('#PWD2_STATE').hide();
				}
				//프로필사진 삭제 후
				else if(type == 'removeProfile'){
					$('#MODIFY_DATE').text(data.result[0]['MODIFY_DATE']);
					$('#PROFILE_PICTURE').val('');
					$('#PROFILE_PICTURE_PREVIEW').attr('src', defaultProfileImg);
				}
			});
}

var f_searchSocial = function(){
	//연동여부
	gf_ajax({
		QUERY_ID : 'oauth.S_MY_SOCIAL'
	}
	, null
	, function(data){
		$('.connect-yn').prop('checked', false);
		if(data.result.length > 0){
			$.each(data.result, function(idx, item){
				$('#socialContainer input[name=' + item.OAUTH_TYPE + ']').prop('checked', true);
			});
		}
		
	});
	
	//연동 계정조회
	gf_ajax({
		QUERY_ID : 'oauth.S_MY_SOCIAL_IDS'
	}
	, null
	, function(data){
		$('table[name=ID_LIST] tr').remove();
		if(data.result.length > 0){
//			console.log(data.result);
			$.each(data.result, function(idx, item){
				
				var tr = $('<tr>');
				var idTd = $('<td style="text-align: right; vertical-align: middle; width:50%;">').addClass('pd-default2 font-size-24');
				if(gv_loginId == item.LOGIN_ID){
					idTd.append($('<span>').addClass('font-size-24').text(item.LOGIN_ID));
				}
				else{
					idTd.append($('<span onclick="f_change_login(\'' + item.LOGIN_ID + '\')">').addClass('font-size-24 id-change-link').text(item.LOGIN_ID));
				}
				tr.append(idTd);
				
				var switchTd = $('<td class="pd-default2" style="text-align: left; vertical-align: middle; width:50%;">'
								+'<input type="checkbox" class="form-switch" oauth_type="'+ item.OAUTH_TYPE + '" login_id="' + item.LOGIN_ID +'" onchange="f_change_repYn(this);" id="'+ item.OAUTH_TYPE + '_' + item.LOGIN_ID +'" name="'+ item.OAUTH_TYPE + '_CHECK">'
								+'<label for="'+ item.OAUTH_TYPE + '_' + item.LOGIN_ID +'" class="switch_label">'
								+'<span class="onf_btn"></span>'
								+'</label>'
								+'</td>');				
				tr.append(switchTd);
				
				$('#' + item.OAUTH_TYPE + '_ID_LIST').append(tr);
				
				if(item.REP_YN == '1'){
					$('#' + item.OAUTH_TYPE + '_' + item.LOGIN_ID ).prop('checked', true);					
				}
			});
			
		}
		
	});
	
}
var f_change_login = function(p_login_id){
	if(confirm('계정(' + p_login_id + ')_로_로그인하시겠습니까')){
		
		gf_ajax({
			LOGIN_ID : p_login_id
		}
		, null
		, function(data){
//			if(data.state == 'success'){
				parent.location.href='/';
//			}
			
		}, null, null, '/oauth/reLogin');
		
	}
}
var f_change_repYn = function(me){

	var oauth_type = $(me).attr('oauth_type');
	var login_id = $(me).attr('login_id');
	
	if($(me).is(':checked')){
		gf_ajax({
			QUERY_ID : 'oauth.U_MY_SOCIAL_REP_YN',
			OAUTH_TYPE : oauth_type,
			LOGIN_ID : login_id,
		}
		, null
		, function(data){
			gf_toast(gf_mlg("대표계정이_변경되었습니다"), 'success');
			f_searchSocial();
		});
	}
	else{
		$(me).prop('checked', true);
	}
//	
}

var f_clear = function(){
	$('#PWD2_STATE').hide();
	$('#privacyContainer input').val('');
	
}
/*****************************************************************************************************************************************************************
 * 
 * 저장
 * 
 *****************************************************************************************************************************************************************/
var f_save = function(){
	switch (currentType) {
	case 'privacy':
		f_savePrivacy();
		break;
//	case 'social':
//		f_saveSocial();
//		break;
	}
}
var f_savePrivacy = function(){
	var fData = new FormData($('#privacyForm')[0]);
	
	gf_ajax(fData
			, function(){
				var rs = gf_chkRequire(["privacyForm"]);
				for (var i = 0; i < rs.tags.length; i++) {
					gf_toast(gf_mlg("을(를)_입력하세요", {
						param : $('[for=' + $(rs.tags[i]).attr('id') + ']').text()
					}), 'info');
					return false;
				}
				
				//현재 비밀번호를 입력하세요.
				if(gf_nvl($('#NEW_PWD').val(), '').length != ''
				&& gf_nvl($('#OLD_PWD').val(), '').length == ''
				){
					gf_toast(gf_mlg("현재_비밀번호를_입력하세요"), 'info');
					rs.result = false;
				}
				//새 비밀번호가 일치하지 않습니다.
				else if($('#NEW_PWD').val() != $('#NEW_PWD_CHK').val()){
					gf_toast(gf_mlg("새_비밀번호가_일치하지_않습니다"), 'info');
					rs.result = false;
				}
				else if( gf_nvl($('#OLD_PWD').val(), '') == '' 
					  || gf_nvl($('#NEW_PWD').val(), '') == ''
					  || gf_nvl($('#NEW_PWD_CHK').val(), '') == ''
					  ){
					fData.delete('OLD_PWD');
					fData.delete('NEW_PWD');
					fData.delete('NEW_PWD_CHK');
				}
				else{
					fData.set('OLD_PWD', gf_securePw( $('#OLD_PWD').val() , $('#publicKey').val() ));
					fData.set('NEW_PWD', gf_securePw( $('#NEW_PWD').val() , $('#publicKey').val() ));
				}
				
				//2차비밀번호
				if( gf_nvl($('#PWD2').val(), '') != '' ){
					fData.set('PWD2', gf_securePw( $('#PWD2').val() , $('#publicKey').val() ));	
				}
				
				//이미지
				if($('#PROFILE_PICTURE').get(0).files.length > 0){
					fData.set('PROFILE_PICTURE', $('#PROFILE_PICTURE').get(0).files[0] );
				}
				
				gf_delFormData(fData);
				return rs.result;
			}
			, function(data){
				
				//성공
				if(data.state == 'success'){
					gf_toast(gf_mlg('저장_되었습니다'), 'success');
					f_search();
				}
				//현재패스워드 불일치
				else if(data.state == 'password_wrong'){
					gf_toast(gf_mlg("현재_비밀번호가_일치하지_않습니다"), 'info');
				}
				
			}, null, null, '/chgPrivacy');
	
}
/*****************************************************************************************************************************************************************
 * 
 * 간편로그인 Oauth
 * 
 *****************************************************************************************************************************************************************/
//간편로그인 연결 / 연결끊기
var f_social_connect = function(e){
	
	var target = $(e.currentTarget);
	
	var type = target.attr('name');
	var checked = target.is(':checked');
	
	if(checked){
		if(confirm(gf_mlg('계정을_연결_하시겠습니까'))){
			target.prop('checked', false);
			f_social_link(type, target);
		}
		else{
			target.prop('checked', false);
		}
	}
	else{
		if(confirm(gf_mlg('계정_연결을_해제_하시겠습니까'))){
			target.prop('checked', true);
			f_social_unlink(type, target);
		}
		else{
			target.prop('checked', true);	
		}
		
	}
}
//연결 끊기
var f_social_unlink = function(p_oauth_type, p_target){
	gf_ajax({
				OAUTH_TYPE : p_oauth_type
			}
			, null
			, function(data){
				console.log(data);
				if(data.state == 'success'){
					gf_toast(gf_mlg('연결해제_되었습니다'), 'success');
					f_searchSocial();
				}
				else{
					//연결된 계정이 없음
					if(data.reason == 'no_account'){
						gf_toast(gf_mlg('연결된_계정이_없습니다'), 'info');	
					}
					//패스워드생성후 가능
					else if(data.reason == 'no_password'){
						gf_toast(gf_mlg('비밀번호가_사용_중이지_않습니다'), 'info');
					}
					
				}
			}, null, null, '/oauth/unlink');
}
//연결
var f_social_link = function(p_oauth_type, p_target){
	switch (p_oauth_type) {
	case 'KAKAO':
		Kakao.Auth.login({
			  success: function(response) {
			    gf_ajax({
			    	OAUTH_TYPE : 'KAKAO',
					ACCESS_TOKEN : response.access_token,
					REFRESH_TOKEN : response.refresh_token,
					EXPIRES_IN : response.expires_in,
					RE_TOKEN_EXPIRES_IN : response.refresh_token_expires_in
				}
				, null
				, function(data){
					if(data.state == 'success'){
						gf_toast(gf_mlg('연결_되었습니다'), 'success');
						f_searchSocial();
					}
				}, null, null, '/oauth/link');
			    
			  },
			  fail: function(error) {
			    console.log(error);
			  },
			});
		break;
	case 'NAVER':
		
		var url = "https://nid.naver.com/oauth2.0/authorize"
				+ "?response_type=code"
				+ "&state=" + encodeURI(gv_API_STATE_CODE)		
				+ "&client_id=" + gv_NAVER_CLIENT_ID 
				+ "&redirect_uri=" + gv_NAVER_REDIRECT_URI_LINK
				;
		var title = "네이버계정연결";
		var status = "toolbar=no,scrollbars=no,resizable=yes,status=no,menubar=no,width=580, height=700, top=0,left=0"; 
		  
		window.open(url,title,status); 
	  	
		break;
	}
}

