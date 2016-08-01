//Summarize items based on algorithm read from https://thetokenizer.com/2013/04/28/build-your-own-summary-tool/

exports.summarizeText = function summarizeText(rawText) {
	try{
		var result = "";
		var textToSum = [];
		for (var item in rawText) {
			textToSum.push(summarizeParagraph(item));
		}
		var resultsArr = summarizeHelper(textToSum, Math.floor(textToSum.length / 3));
		for (var sumSent in resultsArr) {
			result += sumSent;
		}
		return result;
	} catch(err) {
		return "FAIL";
	}
}

function summarizeParagraph(paragraph) {
	var sentences = paragraph.split(".");
	if (sentences.length < 2) {
		return paragraph;
	}
	return summarizeHelper(sentences, 1)[0];

function summarizeHelper(sentences, x) {
	var sentDict = {};
	for (var sentence1 in sentences) {
		var score = 0;
		for (var sentence2 in sentences) {
			if (sentence1 != sentence2) {
				score += calculateIntersect(sentence1, sentence2);
			}
		}
		sentDict[sentence1] = score;
	}
	var items = Object.keys(sentDict).map(function(key) {
	    return [key, sentDict[key]];
	});

	// Sort the array based on the second element
	items.sort(function(first, second) {
	    return first[1] - second[1];
	});

	// Create a new array with only the first 5 items
	var newArr = items.slice(0, x);
	var resultArr = [];
	for (var miniArr in newArr) {
		resultArr.push(miniArr[0])
	}
	return resultArr
}

function calculateIntersect(sentence1, sentence2) {
	var wordsArr1 = sentence1.split(" ");
	var wordsArr2 = sentence2.split(" ");
	wordsArr1 = mergeSort(wordsArr1);
	wordsArr2 = mergeSort(wordsArr2);
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