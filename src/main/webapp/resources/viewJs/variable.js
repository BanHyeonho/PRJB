/**
 * 글로벌변수선언
 * 변수선언은 let, const 으로 하며, 글로벌 gv_ 를 붙여서 선언한다.
 */
//그리드엑셀다운로드 스타일
let gv_excelOptions = {
	      headerStyle: {
	          font: {
	              bold: true,  //enable bold
	              font: 12, // font size
	              color: '00ffffff' //font color --Note: Add 00 before the color code
	          },
	          fill: {   //fill background
	              type: 'pattern', 
	              patternType: 'solid',
	              fgColor: '00428BCA' //background color --Note: Add 00 before the color code
	          }
	      },
	      cellStyle: {
	          font: {
	              bold: false,  //enable bold
	              font: 12, // font size
	              color: '00000000' //font color --Note: Add 00 before the color code
	          },
	          fill: {   //fill background
	              type: 'pattern',
	              patternType: 'solid',
	              fgColor: '00ffffff' //background color --Note: Add 00 before the color code
	          }
	      },
	  };

//첨부파일 최대용량 20GB
const gv_fileMaxSize = 21474836480;

//첨부파일명 최대길이
const gv_fileNameMaxlength = 60;