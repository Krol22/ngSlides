(function(){

var predeclaredAnimations = {
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
    '</div>'


angular.module('ngSlides', [])
    .directive('ngSlides', ngSlides);

function ngSlides() {
    return {
        scope: {
            config: '=ngSlides',
        },
        link: this.ngSlidesController,
        restrict: 'A',
        template: this.templateString,
        transclude: true
    };
}

this.ngSlidesController = function(scope, elem, attr) {
    var config = scope.config;

    var isPlaying = true;

    var currentSlide = 0;
    var repeat = config.repeat,
        timeout = config.timeout || 6000,
        animation = config.animation;

    if(animation === 'custom'){
        if(!config.customAnimation)
            throw new Error('You must provide customAnimation object in your config to use custom animation!');

        predeclaredAnimations.push(config.customAnimation)
    }

    var slides = elem.children().find('ng-slide');
    slides = slides.filter(function(index){
        return slides[index].tagName === 'NG-SLIDE';
    });

    /**** Init transitions on slides ****/

    var transitionEnterCss = '';
    predeclaredAnimations[animation].animationEnter.transitions.forEach(function(transition) {
        transitionEnterCss += transition.css + ', ';
    });
    transitionEnterCss = transitionEnterCss.slice(0, -2);

    var transitionLeaveCss = '';
    predeclaredAnimations[animation].animationLeave.transitions.forEach(function(transition) {
        transitionLeaveCss += transition.css + ', ';
    });
    transitionLeaveCss = transitionLeaveCss.slice(0, -2);

    for(var index = 0; index < slides.length; index++){
        if(index === currentSlide)
            continue;

        predeclaredAnimations[animation].animationEnter.transitions.forEach(function(transition) {
            var property = transition.css.split(' ')[0];  
            $(slides[index]).css(property, transition.from);
            $(slides[index]).css('transition', transitionEnterCss);
        });

    }

    /**** Init buttons ****/

    var playButton = elem.find('.play');
    var pauseButton = elem.find('.pause');
    var nextSlide = elem.find('.next-slide');
    var prevSlide = elem.find('.prev-slide');
    var fullScreen = elem.find('.full-screen');
    var repeat = elem.find('.repeat');

    //scope.prevSlide = prevSlide;
    scope.fullScreen = toggleFullScreen;
    scope.play = play;
    scope.pause = pause;
    scope.repeat = repeat;
    //scope.nextSlide = nextSlide;

    function play(){
        isPlaying = true;

        playButton.css('display', 'none');
        pauseButton.css('display', 'inline-block');

        repeat();
    }

    function pause(){
        isPlaying = false;

        playButton.css('display', 'inline-block');
        pauseButton.css('display', 'none');

        clearInterval(timeout);
    }

    document.documentElement.addEventListener('webkitfullscreenchange', handleFullscreenToggle);

    function toggleFullScreen(){
        if(!document.webkitFullscreenElement){
            document.documentElement.webkitRequestFullscreen();
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    function handleFullscreenToggle(){
        if(!document.webkitIsFullScreen){
            elem.css('position', 'relative');
            $(document).css('overflow', 'auto');
            elem.removeClass('directive-fullscreen');
        } else {
            elem.css('position', 'absolute');
            $(document).css('overflow', 'hidden');
            elem.addClass('directive-fullscreen');
        }
    }

    function repeat() {

    }

};




})();
