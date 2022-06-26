/**
 * 로그인화면
 */
$(document).ready(function () {
	$('#title').text(location.host);
	$('#loginBtn').on('click', f_login);
	$('#registBtn').on('click', f_regist);
	$('#KAKAOLoginBtn').on('click', f_kakaoLogin);
	
});
var f_regist = function(){
	location.replace('/registPage');
}
/*****************************************************************************************************************************************************************
 * 
 * 로그인
 * 
 *****************************************************************************************************************************************************************/
//로그인
var f_login = function(){
	
	var fData = new FormData($('#loginForm')[0]);
	fData.set('PWD', gf_securePw( $('#loginForm [name=PWD]').val() , $('#publicKey').val() ));
	
	gf_ajax( fData, function(){
		
		var rs = gf_chkRequire(["loginForm"]);
		for (var i = 0; i < rs.tags.length; i++) {
			
			gf_toast(gf_mlg("을(를)_입력하세요", {
				param : $(rs.tags[i]).attr('placeholder')
			}), 'info');
			;
		}
		return rs.result;
		
	}, function(data){
		
		if(data.result == 'success'){
			location.replace('/');
		}
		//아이디, 비밀번호 오류
		else if( data.result == 'chkIdPwd'){
			gf_toast(gf_mlg('아이디_또는_비밀번호가_일치하지_않습니다'), 'info');
			$('#loginForm [name=pwd]').val('');
			$('#loginForm [name=pwd]').focus();
		}
	}, null, null, '/loginAction');
}
//카카오 로그인
var f_kakaoLogin = function(){
	
	location.href = "https://kauth.kakao.com/oauth/authorize"
				+ "?client_id=" + gv_KAKAO_REST_API 
				+ "&redirect_uri=" + gv_KAKAO_REDIRECT_URI
				+ "&response_type=code";
}