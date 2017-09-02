angular.module('slidesDemo', ['ngSlides'])
    .controller('demoController', function($scope) {

        $scope.testApi = {};
        $scope.toolbarVisibility = true;

        $scope.config = {
            loop: true,
            timeout: 5000,
            animation: 'fade',
            toolbarVisibility: $scope.toolbarVisibility,
            toolbarAutohide: true,
            autoStart: false,
        };

        $scope.toogleToolbar = function() {
            $scope.config.toolbarVisibility = !$scope.config.toolbarVisibility;
        }

    });
