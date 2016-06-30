function Graph(rawText) {
	this.edgeDict = new Object()
	for each(sentence in rawText) {
		var vertex = new Vertex(sentence)
	}

Graph.prototype.addVertices = function() {
	
}



module.exports = Graph;


function Vertex(sentence) {
	this.sentence = sentence
	this.inSet = []
	this.outSet = []
	this.score = 0
}


function calcSimilarity(sentence1, sentence2){
	
}
