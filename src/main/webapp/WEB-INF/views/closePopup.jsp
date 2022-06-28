<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>바로 닫히는 팝업</title>
<!-- Jquery -->
<script src="/script/jquery-3.6.0.min.js"></script>
<script type="text/javascript">

//네이버 간편로그인 연결(contents/my/privacyInfo)
if('${type}' == '/link/naver'){
	if('${state}' == 'success'){
		$(opener.document.getElementById('NAVER_YN')).prop('checked', true);
		opener.gf_toast(opener.gf_mlg('연결_되었습니다'), 'success');	
	}
}

window.close();
</script>
</head>
<body>
</body>
</html>