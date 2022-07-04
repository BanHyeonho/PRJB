# 프로젝트 구조
## 자바 : src/main/java/prjb/com
	- controller	: 컨트롤러 패키지
		*BroadController : 로드밸런싱 되지않고, 모든톰캣에서 실행되어야 하는 url
		*ComController : 공통모듈 컨트롤러 
		*MyController : 마이페이지모듈 컨트롤러
		*OauthController : Oauth모듈 컨트롤러
		*StController : 스트리밍모듈 컨트롤러

	- crypto		: 암호화 패키지
		*AES256Util : AES256암호화유틸클래스
		*Crypto : 암호화 어도테이션 클래스
		*CryptoBean : DTO 클래스를 사용시 암호화 적용
		*CryptoWrapperFactory : Mybatis model 클래스 암호화 자동적용 을 위한 클래스
		*HashBean : DTO 를 HashMap 사용시 암호화 적용 

	- init			: 설정 패키지
		*AsyncThreadConfiguration : 쓰레드 설정 클래스
		*InitBean : 톨캣부팅시 의존성 주입
		*PrjbServletContextListener : 톨캣부팅시 vm option 및 ServletContext 로드시 경로설정
		*RefreshableSqlSessionFactoryBean : xml 쿼리 변경시 자동적용 클래스(개발시에만 사용)

	- mapper		: 쿼리호출 패키지
		*ComDao : DTO 를 사용하지않고 Map을 사용하여 쿼리호출 

	- model			: data model 패키지

	- service		: 비즈니스로직 패키지
		*AsyncService : 쓰레드를 사용하여 병렬처리시 사용하는 서비스, 사용시 내부로직은 오버라이드 한다.
		*ComService : 공통모듈 비즈니스 로직 클래스(단순 CRUD, 그리드, 페이지 오픈 등)
		*ExceptionService : 에러발생 및 Exception 발생시 처리 클래스
		*MyService : 마이페이지 관련 비즈니스로직 클래스
		*OauthService : Oauth 관련 비즈니스로직 클래스
		*ScheduleService : cron 스케쥴 등록 및 실행 클래스
		*StService : 스트리밍 관련 비즈니스로직 클래스

	- util			: 유틸 패키지
		*ComInterceptor : 공통 interceptor
		*ComUtil : 공통 util성 메서드를 모아놓은 클래스
		*CryptoUtil : 암호화 메서드를 선언해 놓은 인터페이스, 톰캣 부팅시 의존성주입하여 암호화알고리즘, 암화화 키를 셋팅하여 인터페이스로 암/복호화 한다.
		*CustomFile : File 클래스에 없는 변수들을 추가하기 위한 커스텀 클래스
		*ErrorLogException : throw 로 에러를 발생시키는 경우 에러처리
		*FFmpegUtil : 동영상 인코딩 변경 클래스
		*FileUtil : 파일 관련 클래스
		*HttpUtil : Http요청 관련 클래스
		*ModifiableRequest : Request 객체 조작 클래스
		*OsUtil : 운영체제 명령어 실행 클래스(리눅스. 윈도우)
		*tldUtil : JSP 의 EL 태그 taglib function 정의 클래스

## 설정 : src/main/resources/config
		properties
			*common-config.properties : 개발,운영 모두 같은 설정값이어야 하는 경우
			*config-dev.properties : 개발환경 설정값, 개발시에만 사용하는 클래스명 등 / 예 : 파일루트 경로 , 리브레오피스 경로 , sqlSessionFactory
			*config-op.properties : 운영환경 설정값, 운영시에만 사용하는 클래스명 등 / 예 : 파일루트 경로, 리브레오피스 경로 , sqlSessionFactory
			*config-vm-dev.properties : 개발환경에 적용할 vm option 값(소스부팅이전에 적용해야하는 경우) / 파일인코딩, log4j 설정파일명, spring-reload 적용
			*config-vm-op.properties : 운영환경에 적용할 vm option 값(소스부팅이전에 적용해야하는 경우) / 파일인코딩, log4j 설정파일명
			*log4jdbc.log4j2.properties : log4j 프로퍼티
		xml
			*log4j2-dev.xml : 개발용 log4j 설정파일
			*log4j2-op.xml : 운영용 log4j 설정파일
			*mybatis-config.xml : 마이바티스 설정파일
		
## 마이바티스 쿼리 XML : src/main/resources/mapper
	
## 정적 파일 : src/main/webapp/resources
		*css : css폴더
		*icon : 아이콘 관련 폴더
		*img : 이미지 폴더
		*plugin : 자바스크립트 플러그인 폴더
		*script : 유틸성 자바스크립트 폴더
		*tld : taglib 설정 폴더
		*viewJs : 각 화면별 사용 자바스크립트 파일
	
## 화면 : src/main/webapp/WEB-INF/views
		*contents : 관리자메뉴(메뉴등록)에서 등록한 메뉴에 해당하는 jsp 폴더, 첫 '_' 는 폴더, 파일명에는 '_' 를 사용하지 않는다. 
		*error : 에러페이지
	
# 에러코드 정의
	9999 : 세션이 없는상태
	9998 : 사용자정의오류
	404 : 페이지경로오류

# 그리드조회쿼리 규칙
	조회쿼리 작성시 'id_' || (ROWNUM-1) AS "id" 를 무조건 추가한다.(그리드ROW별 ID 생성을 위함)
