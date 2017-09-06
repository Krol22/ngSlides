angular.module('slidesDemo', ['ngSlides'])
    .controller('demoController', function($scope) {

        $scope.testApi = {};
        $scope.toolbarVisibility = true;
        $scope.slideNumber = 0;

        $scope.config = {
            loop: true,
            timeout: 5000,
            animation: 'cascade',
            toolbarVisibility: $scope.toolbarVisibility,
            toolbarAutohide: false,
            autoStart: false,
        };

        $scope.toogleToolbar = function() {
            $scope.config.toolbarVisibility = !$scope.config.toolbarVisibility;
        }

        $scope.selectSlide = function() {
            $scope.testApi.selectSlide($scope.slideNumber);
        }

    });
