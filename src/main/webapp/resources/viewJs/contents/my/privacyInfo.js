/**
 * 개인정보수정 
 */
let currentType;
const defaultProfileImg = '../img/default_profile.png';

$(document).ready(function() {
	console.log($('#publicKey').val());
	$('.menu-div').on('click', f_tabClick);
	$('#removePwd2').on('click', f_removePwd2);
	$('#profileBtn').on('click', function(){
		$('#PROFILE_PICTURE').trigger('click');
	});
	
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
	
	
	
	$('.menu-div:eq(0)').trigger('click');
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
				else if(type == 'removePwd2'){
					$('#MODIFY_DATE').text(data.result[0]['MODIFY_DATE']);
					$('#PWD2_STATE').hide();
				}				
			});
}

var f_searchSocial = function(){
	
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
	case 'social':
		f_saveSocial();
		break;
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
					;
				}
				
				//현재 비밀번호를 입력하세요.
				if(gf_nvl($('#NEW_PWD').val(), '').length != ''
				&& gf_nvl($('#OLD_PWD').val(), '').length == ''
				){
					rs.result = false;
				}
				//새 비밀번호가 일치하지 않습니다.
				if($('#NEW_PWD').val() != $('#NEW_PWD_CHK').val()){
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
var f_saveSocial = function(){
	
}