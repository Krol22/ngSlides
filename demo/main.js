angular.module('slidesDemo', ['ngSlides'])
    .controller('demoController', function($scope) {

        $scope.config = {
            repeat: false,
            timeout: 10000,
            animation: 'fade',
        };

    });