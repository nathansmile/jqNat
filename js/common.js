/** JS Document 
 * 通用JS函数库
 * 邮件格式检测、换行符的替换
 * 文件负责：姜季廷  版权：六合矩阵
 * 2013年4月
 **/
 
// 检测邮箱格式是否正确，传入：字符串，传出：正确返回true，错误返回false
function checkMail(str){ 
	var strReg=""; 
	var r;
	//strReg=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/i; 
	strReg=/^\w+((-\w+)|(\.\w+))*\@{1}\w+\.{1}\w{2,4}(\.{0,1}\w{2}){0,1}/ig; 
	r=str.search(strReg); 
	if(r==-1){
		return false;
	}
	else{
		return true;
	}
}
//以下三个函数主要用于xml与html之间的转换
//在显示时将文本中的\n转换成<br>,后一个反之，其效果为html中显示为<br>，修改时采用\n
//姜季廷2013.1 设计
function nToBr(oldStr)
{
	var reg,newstr;
	reg = new RegExp(/(\n)/g);
	newstr=oldStr.replace(reg,"<br>");
	return newstr;
}
function brToN(oldStr)
{
	var reg,newstr;
	reg = new RegExp(/(<br>)/g);
	newstr=oldStr.replace(reg,"\n");
	return newstr;
}
//将空格转换为&nbsp;
//姜季廷2013.6 设计
function spaceToHtml(oldStr)
{
	var reg,newstr;
	reg = new RegExp(/( )/g);
	newstr=oldStr.replace(reg,"&nbsp;");
	return newstr;
}