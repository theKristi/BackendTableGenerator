var jsonBuilder=require('./../buildjson.js');
exports.tableWizard=function(req, res){
	//console.log("in wizard");
	res.render('tableGenerator/wizard');
};
exports.generate=function(req, res){

	var columns=req.query.columns;
	var rows=req.query.rows;
	//console.log("in generate. rows:"+rows+" columns: "+columns);
	var list=jsonBuilder.buildList(columns, rows);
	//console.log("length "+list.length);
	res.render('tableGenerator/table',{list:list});
};
