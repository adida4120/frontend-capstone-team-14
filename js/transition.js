let menuBtn= document.querySelector('.menu-toggle');
let navMenu =document.querySelector('.main-nav');

menuBtn.addEventListener('click', function(){
    navMenu.classList.toggle('active');
});
