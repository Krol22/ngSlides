(function(){

this.predeclaredAnimations = {
    fade: {
      animationEnter: {
        transitions: [
          { css: 'opacity 0.3s ease-in-out 0.5s', from: 0, to: 1 },
        ],
      },
      animationLeave: {
        transitions: [
          { css: 'opacity 0.3s ease-in-out', from: 1, to: 0 },
        ],
      }
    },
    slide: {
      animationEnter: {
        transitions: [
          { css: 'left 0.8s ease-in-out', from: '1700px', to: '0px' }
        ],
      },
      animationLeave: {
        transitions: [
         { css: 'left 0.8s ease-in-out', from: '0px', to: '-1700px' }
        ],
      }
    }
};

this.templateString =
    '<div ng-transclude></div>' +
    '<div class="slide-buttons">' +
    '  <div ng-click="prevSlide()" class="slide-button prev-slide"><i class="fa fa-angle-left" aria-hidden="true"></i></div>' +
    '  <div ng-click="fullScreen()" class="slide-button full-screen"><i class="fa fa-window-maximize" aria-hidden="true"></i></div>' +
    '  <div ng-click="play()" class="slide-button play"><i class="fa fa-play" aria-hidden="true"></i></div>' +
    '  <div ng-click="pause()" class="slide-button pause"><i class="fa fa-pause" aria-hidden="true"></i></div>' +
    '  <div ng-click="repeat()" class="slide-button repeat"><i class="fa fa-repeat" aria-hidden="true"></i></div>' +
    '  <div ng-click="nextSlide()" class="slide-button next-slide"><i class="fa fa-angle-right" aria-hidden="true"></i></div>' +
    '</div>;'

this.ngSlidesController = function(scope, elem, attr) {
    var config = scope.config;

    var currentSlide;
    var repeat = config.repeat,
        timeout = config.timeout || 6000,
        animation = config.animation;

    if(animation === 'custom'){
        if(!config.customAnimation)
            throw new Error('You must provide customAnimation object in your config to use custom animation!');

        predeclaredAnimations.push(config.customAnimation)
    }

    var slides = elem.children();
    slides = slides.filter(function(index){
        return slides[index].tagName === 'NG-SLIDE';
    });

    scope.prevSlide = function() { };
    scope.fullScreen = function() { };
    scope.play = function() { };
    scope.pause = function() { };
    scope.repeat = function() { };
    scope.nextSlide = function() { };

};

this.ngSlides = function() {
    return {
        scope: {
            config: '=ngSlides',
        },
        link: this.ngSlidesController,
        restrict: 'A',
        template: this.templateString,
        transclude: true
    }
}


angular.module('ngSlides', [])
    .directive('ngSlides', this.ngSlides);

})();
