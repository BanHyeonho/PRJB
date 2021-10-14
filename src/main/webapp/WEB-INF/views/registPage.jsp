<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ include file="include.jsp" %>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "회원가입")}</title>
<meta name="google" content="notranslate">
</head>
<body>
	<input type='hidden' id='publicKey' value='${publicKey}'>
	<div class="background">
		<div class="center-table">
			<form action="#" id='registForm'>
				<div class="center-table mg-bt-default2" style="height: 0;">
					<span class="title">${pb:msg(pageContext.request, "회원가입")}</span>
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
