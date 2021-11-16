/**
 * 글로벌변수선언
 * 변수선언은 let 으로 하며, 글로벌 gv_ 를 붙여서 선언한다.
 */

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