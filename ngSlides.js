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
    '<div class="slides" ng-transclude></div>' +
    '<div class="slide-buttons">' +
    '  <div ng-click="prevSlide()" class="slide-button prev-slide"><i class="fa fa-angle-left" aria-hidden="true"></i></div>' +
    '  <div ng-click="fullScreen()" class="slide-button full-screen"><i class="fa fa-window-maximize" aria-hidden="true"></i></div>' +
    '  <div ng-click="play()" class="slide-button play"><i class="fa fa-play" aria-hidden="true"></i></div>' +
    '  <div ng-click="pause()" class="slide-button pause"><i class="fa fa-pause" aria-hidden="true"></i></div>' +
    '  <div ng-click="repeat()" class="slide-button repeat"><i class="fa fa-repeat" aria-hidden="true"></i></div>' +
    '  <div ng-click="nextSlide()" class="slide-button next-slide"><i class="fa fa-angle-right" aria-hidden="true"></i></div>' +
    '</div>'


var $interval, $timeout;

angular.module('ngSlides', [])
    .directive('ngSlides', ['$interval', '$timeout', ngSlides]);

function ngSlides(_interval, _timeout) {
    $interval = _interval;
    $timeout = _timeout;

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
    var completed = true;

    var nextSlidePromise;

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
        $(slides[index]).addClass('slide');

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

    scope.prevSlide = goToPrevSlide;
    scope.fullScreen = toggleFullScreen;
    scope.play = play;
    scope.pause = pause;
    //scope.repeat = repeat;
    scope.nextSlide = goToNextSlide;

    function play(){
        isPlaying = true;

        playButton.css('display', 'none');
        pauseButton.css('display', 'inline-block');

        startSlideShow();
    }

    function pause(){
        isPlaying = false;

        playButton.css('display', 'inline-block');
        pauseButton.css('display', 'none');

        $interval.cancel(nextSlidePromise);
    }

    function goToPrevSlide(){
        if(!completed) return;

        if(currentSlide !== 0){
            switchToSlide(currentSlide - 1);
        } else if(config.repeat){
            switchToSlide(slides.length - 1);
        }
    }

    function goToNextSlide(){
        if(!completed) return;

        if(currentSlide !== slides.length - 1){
            switchToSlide(currentSlide + 1);
        } else if(config.repeat){
            switchToSlide(0);
        }
    }

    /**** Logic behind changin slides ****/

    function switchToSlide(slideNumber){
        if(slideNumber > slides.length - 1 || slideNumber < 0)
            throw new Error('No slide with number: ', slideNumber, ' is presented.');

        completed = false;

        var slide = slides[currentSlide];
        var nextSlide = slides[slideNumber];

        var currentAnimationEnter = predeclaredAnimations[animation].animationEnter;
        var currentAnimationLeave = predeclaredAnimations[animation].animationLeave;

        var maxTimeLeave = 0;

        currentAnimationLeave.transitions.forEach(transition => {
            var property = transition.css.split(" ")[0];

            slide.style[property] = transition.from;
            slide.style.transition = transitionLeaveCss;

            var time = transition.css.split(" ")[1];
            time = parseFloat(time, 10) * 1000;
            maxTimeLeave = maxTimeLeave > time ? maxTimeLeave : time;

            slide.style[property] = transition.to;
        });

        setTimeout(() => {
            var maxTimeEnter = 0;

            nextSlide.style.transition = transitionEnterCss;

            currentAnimationEnter.transitions.forEach(transition => {
                var property = transition.css.split(" ")[0];
                slide.style.transition = 'none';
                slide.style[property] = transition.from;

                nextSlide.style[property] = transition.from;

                var time = transition.css.split(" ")[1];
                time = parseFloat(time, 10) * 1000;
                maxTimeEnter = maxTimeEnter > time ? maxTimeEnter : time;

                nextSlide.style[property] = transition.to;
            });


            setTimeout(() => {
                currentSlide = slideNumber;
                completed = true;
            }, maxTimeEnter);

        }, maxTimeLeave);
    }

    startSlideShow();

    function startSlideShow() {
        nextSlidePromise = $interval(goToNextSlide, config.timeout);
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

    window.addEventListener('resize', resize);

    function resize() {
        var element = elem[0];
        var containerHeight = element.clientHeight,
            containerWidth = element.clientWidth;

        var screenRatio = screen.height / screen.width;
        scaleX = containerWidth / screen.width;
        var height = screenRatio * containerWidth;

        element.style.height = height + 'px';

        document.getElementsByClassName('slides')[0].style.zoom = scaleX;
        document.getElementsByClassName('slide-buttons')[0].style.zoom = scaleX;
    }

    resize();

};




})();
