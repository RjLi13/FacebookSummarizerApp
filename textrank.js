//Summarize items based on algorithm read from https://thetokenizer.com/2013/04/28/build-your-own-summary-tool/

exports.summarizeText = function summarizeText(rawText) {
	try{
		console.log("text to summarize: " + rawText);
		var result = "";
		var textToSum = [];
		for (var item in rawText) {
			textToSum.push.apply(textToSum, summarizeParagraph(rawText[item]));
		}
		var resultsArr = summarizeHelper(textToSum, Math.floor(textToSum.length / 3));
		for (var i = 0; i < resultsArr.length; i++) {
			result += resultsArr[i];
			result += "\n";
		}
		return result;
	} catch(err) {
		return "FAIL";
	}
}

function summarizeParagraph(paragraph) {
	var sentences = paragraph.split(/[\\.!?]/).filter(Boolean);
	// console.log("Sentences Array is: " + sentences);
	if (sentences.length < 3) {
		return sentences;
	}
	return summarizeHelper(sentences, 2);
}

function summarizeHelper(sentences, x) {
	var sentDict = {};
	for (var sentence1 in sentences) {
		var score = 0;
		for (var sentence2 in sentences) {
			if (sentences[sentence1] != sentences[sentence2]) {
				score += calculateIntersect(sentences[sentence1], sentences[sentence2]);
			}
		}
		sentDict[sentences[sentence1]] = score;
	}
	var items = Object.keys(sentDict).map(function(key) {
	    return [key, sentDict[key]];
	});

	// Sort the array based on the second element
	items.sort(function(first, second) {
	    return second[1] - first[1];
	});

	var newArr = items.slice(0, x);
	// console.log("newArr " + newArr);
	var resultArr = [];
	for (var i = 0; i < newArr.length; i++) {
		resultArr.push(newArr[i][0]);
	}
	return resultArr;
}

function calculateIntersect(sentence1, sentence2) {
	var wordsArr1 = sentence1.split(/[ ,]+/).filter(Boolean);
	var wordsArr2 = sentence2.split(/[ ,]+/).filter(Boolean);
	// console.log("wordsArr1 unsorted: " + wordsArr1);
	// console.log("wordsArr2 unsorted: " + wordsArr2);
	wordsArr1 = mergeSort(wordsArr1);
	wordsArr2 = mergeSort(wordsArr2);
	// console.log("wordsArr1 sorted: " + wordsArr1);
	// console.log("wordsArr2 sorted: " + wordsArr2);
	var i = 0;
	var j = 0;
	var countIntersect = 0;
	while (i < wordsArr1.length && j < wordsArr2.length) {
		if (wordsArr1[i] === wordsArr2[j]) {
			countIntersect += 1;
			i++;
			j++;
		}
		else if (wordsArr1[i].localeCompare(wordsArr2[j]) == -1) {
			i++;
		} else {
			j++;
		}
	}
	return countIntersect / ((wordsArr1.length + wordsArr2.length) / 2);
}

function mergeSort(array) {
	if (array.length < 2) {
		return array;
	}
	var mid =  Math.floor(array.length / 2);
	var firstHalf = array.slice(0, mid);
	var secondHalf = array.slice(mid);
	var sortedFirst = mergeSort(firstHalf);
	var sortedSecond = mergeSort(secondHalf);
	var i = 0;
	var j = 0;
	var result = [];
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
	return result;
}