//build the json objects for a given number of attributes
exports.buildList=function(columns, rows){
	var list=[];
	function newObject(columns){
		var newObject={};
		for(var i=0; i<columns;i++)
		{
			newObject['Column'+i]=Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
		}
		return newObject;
	}
	for(var j = 0; j < rows; j++) {
		list.push(newObject(columns));
	}
	return list;
}