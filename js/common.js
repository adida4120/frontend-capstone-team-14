document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('page-loaded');

    
    let menuBtn = document.querySelector('.menu-toggle');
    let navMenu = document.querySelector('.main-nav');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', function () {
            navMenu.classList.toggle('active');
        })
        
    }
});
