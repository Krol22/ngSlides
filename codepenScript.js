(function(){
  
  const animations = {
    fade: {
      animationEnter: {
        transitions: [
          { css: 'opacity 0.3s ease-in-out 0.5s', from: 0, to: 1 },
          { css: 'left 0.8s ease-in-out', from: '1700px', to: '0px' }
        ],
      },
      animationLeave: {
        transitions: [
          { css: 'opacity 0.3s ease-in-out', from: 1, to: 0 },
         { css: 'left 0.8s ease-in-out', from: '0px', to: '-1700px' }
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

  let config = {
    repeat: true,
    timeout: 6000,
    startingSlide: 0,
    animation: animations.fade
  }; 
  
  let currentSlide = config.startingSlide;
  let slides = [];
  let timeout;
  let prevKeyCode = -1;
  let completed = true;
  let isPlaying = false;
  let currentAnimation = 'fade';
  
  /* =========== Setup buttons =========== */
  
  let slideClass = 'slide';
  let directiveClass = 'directive';
  
  
  
  let buttons = [
    { className: 'play', callback: play },
    { className: 'pause', callback: pause },
    { className: 'prev-slide', callback: goToPrevSlide },
    { className: 'next-slide', callback: goToNextSlide },
    { className: 'full-screen', callback: toggleFullScreen },
    { className: 'repeat', callback: toggleAutoRepeat },
  ];
  
  buttons.forEach(button => {
    document.getElementsByClassName(button.className)[0]
      .addEventListener('click', button.callback);
  });
  
  slides = document.getElementsByClassName('slide');
  
  let transitionEnterCss = '';
  animations[currentAnimation].animationEnter.transitions.forEach(transition => {
    transitionEnterCss += transition.css + ', ';
  });
  
  transitionEnterCss = transitionEnterCss.slice(0, -2);
  
  let transitionLeaveCss = '';
  animations[currentAnimation].animationLeave.transitions.forEach(transition => {
    transitionLeaveCss += transition.css + ', ';
  });
  
  transitionLeaveCss = transitionLeaveCss.slice(0, -2);
  
  for(let i = 0; i < slides.length; i++){
    if(i === currentSlide)
      continue;
    
    animations[currentAnimation].animationEnter.transitions.forEach(transition => {
      let property = transition.css.split(" ")[0];
      slides[i].style[property] = transition.from;
      slides[i].style.transition = transitionEnterCss;
    });
    
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
  
  function toggleFullScreen(){
    if(!document.webkitFullscreenElement){
      document.documentElement.webkitRequestFullscreen();
    } else if(document.webkitExitFullscreen) { 
      document.webkitExitFullscreen();
    }
  }
  
  function play(){
    isPlaying = true;
    getElementByClass('play').style.display = 'none';
    getElementByClass('pause').style.display = 'inline-block';
    
    repeat()
  }
  
  function pause(){
    isPlaying = false;
    getElementByClass('play').style.display = 'inline-block';
    getElementByClass('pause').style.display = 'none';
    
    clearInterval(timeout);
  }
  
  function toggleAutoRepeat(){
    if(!config.repeat){
      config.repeat = true;
      getElementByClass('repeat').classList.add('active');
    } else {
      config.repeat = false;
      getElementByClass('repeat').classList.remove('active');
    }
  }
  
  document.documentElement.addEventListener('keydown', function(event){
    
    event.preventDefault(); 
    
    if(event.keyCode == prevKeyCode){
      return
    }
    
    prevKeyCode = event.keyCode;
    
    if(event.keyCode === 39){
      if(isPlaying) {
        clearTimeout(timeout);
        repeat();
      }
      goToNextSlide();
    } else if(event.keyCode === 37){
      if(isPlaying) {
        clearTimeout(timeout);
        repeat();
      }
      goToPrevSlide();
    }
    
    if(event.keyCode === 32){
      if(isPlaying) {
        pause();
      } else {
        play();
      }
    }
    
    if(event.keyCode === 70){
      toggleFullScreen();
    }
    
    if(event.keyCode === 82){
      toggleAutoRepeat();
    }
    
  });
  
  document.documentElement.addEventListener('webkitfullscreenchange', handleFullscreenToggle);
  
  function handleFullscreenToggle(){
    let directiveElement = document.getElementsByClassName(directiveClass)[0];
    
    if(!document.webkitIsFullScreen){
      directiveElement.style.position = 'relative';
      document.documentElement.style.overflow = 'auto';
      directiveElement.classList.remove('directive-fullscreen');
      resize();
    } else {
      directiveElement.style.position = 'absolute';
      document.documentElement.style.overflow = 'hidden';
      directiveElement.classList.add('directive-fullscreen');
      resize();
    }
  };
  
  document.documentElement.addEventListener('keyup', () => {
    prevKeyCode = -1;
  });
  
  repeat();
  
  function repeat(){
    timeout = setInterval(function(){
      goToNextSlide();
    }, config.timeout);
  }
  
  function switchToSlide(slideNumber){
    if(slideNumber > slides.length - 1 || slideNumber < 0) 
      throw new Error('No slide with number: ', slideNumber, ' is presented.');
    
    completed = false; 
    
    let slide = document.getElementsByClassName('slide')[currentSlide];
    let nextSlide = document.getElementsByClassName('slide')[slideNumber];
    
    let currentAnimationEnter = animations[currentAnimation].animationEnter;
    let currentAnimationLeave = animations[currentAnimation].animationLeave; 
    
    let maxTimeLeave = 0; 
   
    currentAnimationLeave.transitions.forEach(transition => {
      let property = transition.css.split(" ")[0];
      
      slide.style[property] = transition.from;
      slide.style.transition = transitionLeaveCss;
      
      let time = transition.css.split(" ")[1];
      time = parseFloat(time, 10) * 1000;
      maxTimeLeave = maxTimeLeave > time ? maxTimeLeave : time; 
      
      slide.style[property] = transition.to;
    });
    
    setTimeout(() => {
      let maxTimeEnter = 0;
      
      nextSlide.style.transition = transitionEnterCss;
      
      currentAnimationEnter.transitions.forEach(transition => {
        let property = transition.css.split(" ")[0];
        slide.style.transition = 'none';
        slide.style[property] = transition.from;
        
        nextSlide.style[property] = transition.from;

        let time = transition.css.split(" ")[1];
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
  
  window.addEventListener('resize', resize);
  
  resize();
  
  function resize() {
    let containerHeight = document.getElementsByClassName('directive')[0].clientHeight;
    let containerWidth = document.getElementsByClassName('directive')[0].clientWidth;
    
    let element = document.getElementsByClassName('directive')[0]; 
    let screenRatio = screen.height / screen.width;
    
    scaleX = containerWidth / screen.width;
    
    let height = screenRatio * containerWidth;
    
    element.style.height = height + 'px';
    
    document.getElementsByClassName('slides')[0].style.zoom = scaleX;
  }
  
  function getElementByClass(className){
    return document.getElementsByClassName(className)[0];
  }
  
})();
