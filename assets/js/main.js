
const ENTER_KEY_CODE = 13;
const THREE_SECONDS = 3000;

var app = angular.module('myApp', []);

var correctAnswer;

var activeKeys = ["C"];

initInputsToCorrectState();

app.controller('myCtrl', function($scope, $http) {
	$scope.modeSelection = "Scale Degree";
	$scope.userSelectedKey = "C";

	$http.get("data.json")
		.then(function(response) {
			console.log(response);
			$scope.data = response.data;
			displayQuestion($scope);
		});

	$scope.alterActiveMode = function(event) {
		console.log(event);
		if(event.target.value.toLowerCase() == "scale-degree") {
			$scope.modeSelection = "Scale Degree";
		} else if(event.target.value.toLowerCase() == "note") {
			$scope.modeSelection = "Note"
		} else if(event.target.value.toLowerCase() == "both") {
			$scope.modeSelection = "Both"
		}

		displayQuestion($scope);
		return;
	}

	$scope.checkAnswer = function(event) {
		if(wasTriggeredByClickOrEnter(event)) {
			if($scope.keySelection.length > 0) {
				if(answerIsUndefinedOrIncorrect($scope.answer, correctAnswer)) {
					flashResultsIcon("&cross;", "#FF0000");
				} else {
					flashResultsIcon("&#x2713;", "#00FF00");
					displayQuestion($scope);
				}
			}

			$scope.answer = "";
		}
		return;
	}

	$scope.alterActiveKeys = function(event) {
		console.log(event);
		var key = event.target.value;
		$scope.userSelectedKey = key;
		var checked = event.target.checked;
		if(checked) {
			if(!activeKeys.includes(key)) {
				activeKeys.push(key);
			}
		} else {
			for(i = 0; i < activeKeys.length; i++) {
				if(activeKeys[i] == key) {
					activeKeys.splice(i, 1);
				}
			}
		}

		displayQuestion($scope);
		console.log(activeKeys);
		return;
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

		return;
	}

});

function flashResultsIcon(iconStr, colorStr) {
	$("#result-icon").stop();
	$("#result-icon").html(iconStr);
	$("#result-icon").css("color", colorStr);
	$("#result-icon").css("opacity", "1");
	$("#result-icon").animate({opacity: 0}, THREE_SECONDS);
	return;
}

function answerIsUndefinedOrIncorrect(answer, correctAnswer) {
	return (answer == undefined) || (answer.toLowerCase() != correctAnswer);
}

function wasTriggeredByClickOrEnter(event) {
	return (event == undefined) || (event.keyCode == ENTER_KEY_CODE);
}

function displayQuestion($scope) {

	var length = activeKeys.length;
	if(length > 0) {
		var rn = Math.floor(Math.random() * length);
		$scope.keySelection = activeKeys[rn];
		console.log("Key Selection: " + $scope.keySelection);

		rn = Math.floor(Math.random() * 7) + 1;
		if($scope.modeSelection.toLowerCase() == "scale degree") {
			$scope.question = rn;
			correctAnswer = $scope.data[$scope.keySelection][$scope.question].toLowerCase();
		} else {
			$scope.question = $scope.data[$scope.keySelection][rn];
			correctAnswer = rn.toString().toLowerCase();
		}

		console.log($scope.question);
	} else {
		$scope.keySelection = "";
		$scope.question = "";
	}

	return;
}

function initInputsToCorrectState() {
	$("#mode-options input:first").prop("checked", "true");
	$("#key-selection input").prop("checked", "");
	$("#key-selection input:first").prop("checked", "true");
	return;
}

