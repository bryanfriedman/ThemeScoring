'use strict';

/**
 * @ngdoc function
 * @name themeScoringApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the themeScoringApp
 */
angular.module('themeScoringApp')
  .controller('MainCtrl', function ($scope, $localStorage, Criteria, Themes) {
  	var themeScoringAppCtl = this;
  	$scope.$storage = $localStorage;

    Criteria.query(function(data) {
        console.log('API criteria', data.body.results);
        themeScoringAppCtl._setCriteria(data.body.results);
    });

    themeScoringAppCtl._setCriteria = function(data) {
        $scope.$storage.criteriaList = data[0].value;
    };

    Themes.query(function(data) {
        console.log('API themes', data.body.results);
        themeScoringAppCtl._setThemes(data.body.results);
    });

    themeScoringAppCtl._setThemes = function(data) {
        var themes = data[0].value.themes || [];
        console.log('themes', themes);

	    $scope.$storage.themeList = themes;
    };

    $scope.addCriteria = function(name, weight) {
    	$scope.$storage.criteriaList[name] = { weight: weight };
    };

    $scope.removeCriteria = function(name) {
        delete $scope.$storage.criteriaList[name];

        for (var i = 0; i < $scope.$storage.themeList.length; i++) {
            delete $scope.$storage.themeList[i].criteria[name];
        }
    };

    $scope.addTheme = function(name) {
    	$scope.$storage.themeList.push({name: name});
    };

    $scope.removeTheme = function(name) {
        $scope.$storage.themeList = $scope.$storage.themeList.filter(function(obj) {
            return obj.name !== name;
        });
    };

    $scope.calculateScore = function(theme) {
    	var score = 0;

    	for (var key in theme.criteria) {
    		var criteria = $scope.$storage.criteriaList[key];
    		if (criteria) {
	    		score += theme.criteria[key] * criteria.weight;
    		}
    	}

    	return score.toFixed(1);
    };

    $scope.$watch('$storage.criteriaList', function(newVal) {
        if (!newVal) {
            console.log('nothing to save');
            return;
        }

        console.log('updating criteria list:', newVal);

	    Criteria.save(newVal,
        function(result) {
            console.log('saved criteriaList:', result);
        },
        function(err) {
            console.log('error:', err);
        });
	}, true);

    $scope.$watch('$storage.themeList', function(newVal) {
        if (!newVal) {
            console.log('nothing to save');
            return;
        }

        console.log('updating theme list:', newVal);

	    Themes.save(newVal,
        function(result) {
            console.log('saved themeList:', result);
        },
        function(err) {
            console.log('error:', err);
        });
	}, true);
  });
