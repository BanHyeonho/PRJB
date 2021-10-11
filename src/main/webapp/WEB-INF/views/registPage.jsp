<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ include file="include.jsp" %>
<html>
<head>
	<meta charset="UTF-8">
	<title>${pb:msg(pageContext.request, "회원가입")}</title>
	<script type="text/javascript">
	$(document).ready(function () {
		
		
		$('#goBackBtn').on('click', goBack);
		$('#registBtn').on('click', regist);
	});
	var goBack = function(){
		if(confirm('${pb:msg(pageContext.request, "뒤로_이동_하시겠습니까?")}')){
			location.replace('/');	
		}
	}
	
	var regist = function(){
		
		var fData = new FormData($('#registForm')[0]);
		fData.set('PWD', gf_securePw( $('#registForm [name=PWD]').val() , '${publicKey}' ));
		gf_ajax(fData, function(){
			
			var rs = gf_chkRequire(["registForm"]);
			
			for (var i = 0; i < rs.tags.length; i++) {
				gf_toast(gf_msg('${pb:msg(pageContext.request, "을(를)_입력하세요")}', {
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
				gf_toast('${pb:msg(pageContext.request, "이미_존재하는_아이디_입니다")}', 'info');
				$('#registForm [name=LOGIN_ID]').focus();
			}
			
		}, null, null, '/registAction');
	}
	
	</script>
	<style type="text/css">
	
	</style>
</head>
<body>
	<div class="background">
		<div class="center-table">
			<form action="#" id='registForm'>
				<div class="center-table mg-bt-default2" style="height: 0;">
					<label class="title">
					${pb:msg(pageContext.request, "회원가입")}
					</label>
				</div>
				<div class="content-panel clearfix">
					<input type="text" class="input-text font-size-36 mg-default2 input-st1" autofocus tabindex="1" name="LOGIN_ID" require="true" placeholder='${pb:msg(pageContext.request, "아이디")}' >
					<input type="password" class="input-text font-size-36 mg-default2 input-st1" tabindex="2" name="PWD" require="true" placeholder='${pb:msg(pageContext.request, "비밀번호")}' >
					<input type="text" class="input-text font-size-36 mg-default2 input-st1" enter-exec='4' tabindex="3" name="USER_NAME" require="true" placeholder='${pb:msg(pageContext.request, "이름")}' >
					<button type="button" class="font-size-24 fl-right mg-rt-default2 btn btn-st1" tabindex="5" id='goBackBtn'>${pb:msg(pageContext.request, "뒤로")}</button>
					<button type="button" class="font-size-24 fl-right mg-rt-default2 btn btn-st1" tabindex="4" id='registBtn'>${pb:msg(pageContext.request, "가입")}</button>
				</div>
			</form>
		</div>
	</div>
</body>
</html>
