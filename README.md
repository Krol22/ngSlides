# ngSlides
## Angular 1.6 module for creating presentations on webpage.

You can download this module directly from github page. And add it with CSS file directly to html page.

Dependencies: JQuery 3.2, Angular 1.6 and font awesome css.

## Basic using

1. Add this module to module that will use ngSlides

```javascript

angular.module('yourmodule', ['ngSlides']);
```

2. Create configuration object for ngSlides directive

```javascript

// Available options

var configuration = {
    timeout: 5000,
    animation: 'fade',
    toolbarVisibility: true,
    toolbarAutohide: true,
    autoStart: true
};
```

3. Add directive to html page

```html

<div class="directive" ng-slides="configuration">
    <ng-slide>
        Slide code
    </ng-slide>
    ...
</div>
```

## Available animations

⋅⋅* slide
⋅⋅* fade

## Custom animations

1. Declare custom animation object:

```javascript

    customAnimation: {
        animationEnter: {
            transitions: [
                { css: 'opacity 1s linear', from: 0, to: 1 },
                ( ... )
            ]
        },
        animationLeave: {
            transitions: [
                { css: 'opacity 0.5s ease-in-out', from: 1, to: 0 },
                ( ... )
            ]
        }
    }
```

2. Configure ngSlide:

```javascript

    var configuration = {
        (...)
        animation: 'custom'
        customAnimation: customAnimation
    }
```

## API

Module exposes an basic API. To use it you need to pass an empty object to directive

```html

<div ng-slide="configuration" ng-slide-api="apiObject">
    (...)
</div>
```

### Available methods:

⋅⋅* toggleToolbar()
⋅⋅* toggleAutohide()
⋅⋅* prevSlide()
⋅⋅* fullscreen()
⋅⋅* play()
⋅⋅* pause()
⋅⋅* loop()
⋅⋅* nextSlide()
