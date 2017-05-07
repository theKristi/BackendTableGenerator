var jsonBuilder=require('./../buildjson.js');
exports.tableWizard=function(req, res){
	console.log("in wizard");
	res.render('tableGenerator/wizard');
};
exports.generate=function(req, res){
	console.log("in generate");
	//res.render('tableGenerator/wizard');
/*var columns=req.body.columns;
var rows=req.body.rows;
var list=jsonBuilder.buildList(columns, rows);
redirect('table',list);*/
};
exports.table=function(req, res){
//req.body.list

}