angular.module('slidesDemo', ['ngSlides'])
    .controller('demoController', function($scope) {

        $scope.config = {
            repeat: false,
            timeout: 2000,
            animation: 'fade',
        };

    });
