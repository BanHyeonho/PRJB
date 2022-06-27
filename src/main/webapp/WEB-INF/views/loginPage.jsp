<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="include.jsp" %>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "로그인")}</title>
<meta name="google" content="notranslate">
<script src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>

<style type="text/css">
.socialBtn{
	height: 45px;
	width: 90px;
	max-height: 45px;
	max-width: 90px;
}
#NAVERLoginBtn{
	background-image: url("/img/naver_login_ko.png");
	background-repeat: round;
}
</style>
</head>
<body>
	<input type='hidden' id='publicKey' value='${publicKey}'>
	<div class="background">
		<div class="center-table">
			<form action="#" id='loginForm'>
				<div class="center-table mg-bt-default2" style="height: 0;">
					<span class="title" id="title">
					</span>
				</div>
				<div class="content-panel clearfix pd-default">
					<input type="text" class="input-text font-size-36 mg-default2 input-st1" autofocus tabindex="1" name="LOGIN_ID" require="true" placeholder='${pb:msg(pageContext.request, "아이디")}'>
					<input type="password" class="input-text font-size-36 mg-default2 input-st1" enter-exec='4' tabindex="2" name="PWD" require="true" placeholder='${pb:msg(pageContext.request, "비밀번호")}' >
					
					
					<img class='fl-right mg-rt-default2 btn socialBtn' id='NAVERLoginBtn' tabindex="6">
					<img class='fl-right mg-rt-default2 btn socialBtn' src="/img/kakao_login_ko.png" id='KAKAOLoginBtn' tabindex="5">
					<button type="button" class="font-size-24 fl-right mg-rt-default2 btn btn-st1" tabindex="4" id='loginBtn'>${pb:msg(pageContext.request, "로그인")}</button>
					<button type="button" class="font-size-24 fl-right mg-rt-default2 btn btn-st1" tabindex="3" id='registBtn'>${pb:msg(pageContext.request, "회원가입")}</button>
				</div>
			</form>
		</div>
	</div>
</body>
</html>
