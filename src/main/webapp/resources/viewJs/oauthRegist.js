/**
 * 간편 회원가입 화면 
 */
$(document).ready(function () {
	if(!confirm(gf_mlg('연동된_계정이_없습니다_회원가입_하시겠습니까'))){
		location.href = '/';
	}
	
	$('#goBackBtn').on('click', goBack);
	$('#registBtn').on('click', regist);
});

var goBack = function(){
	if(confirm(gf_mlg('뒤로_이동_하시겠습니까'))){
		location.replace('/');	
	}
}

var regist = function(){
	
	var fData = new FormData($('#registForm')[0]);
	fData.set('PWD', gf_securePw( $('#registForm [name=PWD]').val() , $('#publicKey').val() ));
	gf_ajax(fData, function(){
		
		var rs = gf_chkRequire(["registForm"]);
		
		for (var i = 0; i < rs.tags.length; i++) {
			gf_toast(gf_mlg('을(를)_입력하세요', {
				param : $(rs.tags[i]).attr('placeholder')
			}), 'info');
		}
		return rs.result;
		
	}, function(data){
		
		if(data.result == 'success'){
			location.replace('/');
		}
		//아이디중복
		else if( data.result == 'duplicatedId'){
			gf_toast(gf_mlg('이미_존재하는_아이디_입니다'), 'info');
			$('#registForm [name=LOGIN_ID]').focus();
		}
		
	}, null, null, '/oauth/registAction');
}