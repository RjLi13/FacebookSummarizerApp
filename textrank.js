//1. Identify text units that best define task at hand and add them as vertices in graph
//2. Identify relations that connect such text units and use these relations to draw edges between vertices in graph. Edges can be directed/undirected, unweighted/weighted
//3. Iterate the graph based ranking algorithm till convergence
//4. Sort vertices based on final score. use values attached to each vertex for ranking/selection decisions 

exports.summarizeText = function summarizeText(rawText) {
	try{
		var result = "";

		return result;
	} catch(err) {
		return "FAIL";
	}
}

function summarizeParagraph(paragraph) {


}

function calculateIntersect(sentence1, sentence2) {
	var wordsArr1 = sentence1.split(" ");
	var wordsArr2 = sentence2.split(" ");
	mergeSort(wordsArr1);
	mergeSort(wordsArr2);
}

function mergeSort(array) {
	if (array.length < 2) {
		return array
	}
	var mid =  Math.floor(array.length / 2);
	var firstHalf = array.slice(0, mid);
	var secondHalf = array.slice(mid);
	var sortedFirst = mergeSort(firstHalf);
	var sortedSecond = mergeSort(secondHalf);
	var i = 0;
	var j = 0;
	var result = []
	while (sortedFirst.length > i && sortedSecond.length > j) {
		if (sortedFirst[i].localeCompare(sortedSecond[j]) == -1) {
			result.push(sortedFirst[i]);
			i++;
		} else {
			result.push(sortedSecond[j]);
			j++;
		}
	}
	if (i == sortedFirst.length) {
		result.push.apply(result, sortedSecond);
	}
	if (j == sortedSecond.length) {
		result.push.apply(result, sortedFirst)
	}
	return result
}