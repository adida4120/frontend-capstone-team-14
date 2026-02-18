const initAboutPage = () => {
    document.body.classList.add('page-loaded');
    const rawData = localStorage.getItem('moneyBuddyData');
    const data = JSON.parse(rawData) || []; 
    const targetCount = data.length; 
    const countElement = document.getElementById('total-actions-count'); 
    
    if (countElement && targetCount > 0) { 
        animateCounter(countElement, targetCount); 
    } 
    initScrollReveal(); 
};

document.addEventListener('DOMContentLoaded', initAboutPage); 

// שינוי ל-const: הפונקציה עצמה לא משתנה
const animateCounter = (element, target) => { 
    let current = 0; // נשאר let כי הערך משתנה בתוך האינטרוול
    const duration = 2000; 
    const stepTime = Math.max(duration / target, 75); 
    
    const timer = setInterval(() => { 
        current++; 
        element.innerText = current.toLocaleString(); 
        if (current >= target) { 
            clearInterval(timer); 
        } 
    }, stepTime); 
};

// שינוי ל-const
const initScrollReveal = () => { 
    const cards = document.querySelectorAll('.card-box, .team-card, .card-box-modern'); 
    const observer = new IntersectionObserver((entries) => { 
        entries.forEach(entry => { 
            if (entry.isIntersecting) { 
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "all 0.6s ease-out";
        observer.observe(card);
    });
};