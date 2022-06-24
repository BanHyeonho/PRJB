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
const gv_fileNameMaxlength = 200;

//기본색상
const gv_color = ['#ef9a9a', '#90caf9', '#a5d6a7', '#fff59d', '#ffcc80', '#bcaaa4', '#eeeeee', '#f44336', '#2196f3', '#4caf50', '#ffeb3b', '#ff9800', '#795548', '#9e9e9e'];

//게이지차트 색상
const gv_gaugeColor = {
		pattern : ['#FF0000', '#F97600', '#F6C600', '#60B044'],
		values : [30, 60, 90, 100]
}