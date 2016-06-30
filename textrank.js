//1. Identify text units that best define task at hand and add them as vertices in graph
//2. Identify relations that connect such text units and use these relations to draw edges between vertices in graph. Edges can be directed/undirected, unweighted/weighted
//3. Iterate the graph based ranking algorithm till convergence
//4. Sort vertices based on final score. use values attached to each vertex for ranking/selection decisions 
var Graph = require("./graph.js");

exports.summarizeText = function summarizeText(rawText) {
	try{
		var textG = new Graph();
		result = "";
		console.log(rawText);
		console.log("Yo baby");
		textG.addVertices();
		return result;
	} catch(err) {
		return "FAIL";
	}
}

