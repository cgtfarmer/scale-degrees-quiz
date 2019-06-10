
const ENTER_KEY_CODE = 13;
const THREE_SECONDS = 3000;

var app = angular.module('myApp', []);

var correctAnswer;

var selectedKey = "C";
var activeKeys = ["C"];
var activeScaleDegreesMap = {};

app.controller('myCtrl', function($scope, $http) {

	$http.get("data.json")
		.then(function(response) {
			console.log(response);
			$scope.data = response.data;
			initActiveScaleDegreesMap();
			console.log(activeScaleDegreesMap);
			displayQuestion($scope);
		});

	$scope.checkAnswer = function(event) {
		if(wasTriggeredByClickOrEnter(event)) {
			// var correctAnswer = $scope.data[selection]["a"].toLowerCase();

			if(answerIsUndefinedOrIncorrect($scope.answer, correctAnswer)) {
				$("#result-icon").stop();
				$("#result-icon").html("&cross;");
				$("#result-icon").css("color", "#FF0000");
				$("#result-icon").css("opacity", "1");
				$("#result-icon").animate({opacity: 0}, THREE_SECONDS);
			} else {
				$("#result-icon").stop();
				$("#result-icon").html("&#x2713;");
				$("#result-icon").css("color", "#00FF00");
				$("#result-icon").css("opacity", "1");
				$("#result-icon").animate({opacity: 0}, THREE_SECONDS);

				displayQuestion($scope);
			}

			$scope.answer = "";
		}
	}

	$scope.toggleHelpTable = function() {
		var state = $("#help-btn").prop("value");
		if(state == "Show Help") {
			$("#help-table").show();
			$("#help-btn").prop("value", "Hide Help");
		} else {
			$("#help-table").hide();
			$("#help-btn").prop("value", "Show Help");
		}
	}

});

function answerIsUndefinedOrIncorrect(answer, correctAnswer) {
	return (answer == undefined) || (answer.toLowerCase() != correctAnswer);
}

function wasTriggeredByClickOrEnter(event) {
	return (event == undefined) || (event.keyCode == ENTER_KEY_CODE);
}

function displayQuestion($scope) {
	console.log(activeScaleDegreesMap);
	// activeKeys = ["C", "F", "G"]; // Remove this
	activeKeys = ["C"]; // Remove this

	var rn = Math.floor(Math.random() * activeKeys.length);
	var keySelection = activeKeys[rn];
	console.log("Key Selection: " + keySelection);

	activeScaleDegreesMap["C"][4] = 0;
	activeScaleDegreesMap["C"][5] = 0;
	activeScaleDegreesMap["C"][2] = 0;

	var activeScaleDegrees = fetchActiveScaleDegreesOfKey(keySelection);
	var rn = Math.floor(Math.random() * activeScaleDegrees.length);

	$scope.keySelection = keySelection;
	$scope.scaleDegreeSelection = activeScaleDegrees[rn];
	console.log($scope.scaleDegreeSelection);
	correctAnswer = $scope.data[$scope.keySelection][$scope.scaleDegreeSelection].toLowerCase();
	return;
}

function fetchActiveScaleDegreesOfKey(keySelection) {
	var key = activeScaleDegreesMap[keySelection];

	var activeScaleDegrees = [];
	for(sd in key) {
		if(key[sd] == 1) {
			activeScaleDegrees.push(sd);
		}
	}

	console.log(activeScaleDegrees);
	return activeScaleDegrees;
}

function initActiveScaleDegreesMap() {
	var keys = ["C", "D", "E", "F", "G", "A", "B",
				"Db", "Eb", "Gb", "Ab", "Bb"]

	for(i = 0; i < keys.length; i++) {
		var key = keys[i];
		var sdMap = {};

		for(j = 1; j <= 7; j++) {
			sdMap[j] = 1;
		}

		 activeScaleDegreesMap[key] = sdMap;
	}

	return;
}

