1.에러코드 정의
	- 9999 : 세션이 없는상태
	- 9998 : 사용자정의오류 
	- 404 : 페이지경로오류

2.패키지구조
	- com : 공통패키지
		- controller	: 컨트롤러 패키지
		- crypto		: 암호화 패키지
		- init			: 설정 패키지
		- mapper		: 쿼리호출 패키지 
		- model			: data model 패키지
		- service		: 비즈니스로직 패키지
		- util			: 유틸 패키지

3.그리드조회쿼리 규칙
	- 조회쿼리 작성시 'id_' || (ROWNUM-1) AS "id" 를 무조건 추가한다.(그리드ROW별 ID 생성을 위함)
