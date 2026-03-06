document.addEventListener('DOMContentLoaded', function() {

    const buyBtn = document.querySelector('.buy-btn');
    if (buyBtn) {
        buyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('🧦 Поздравляем! Ваш умный носок уже в пути!\n\nОн скоро приедет и начнет шпионить! 👀');
        });
    }

    const reviewCards = document.querySelectorAll('.review-card');
    reviewCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    let visitorCount = localStorage.getItem('sockVisitorCount') || 0;
    visitorCount++;
    localStorage.setItem('sockVisitorCount', visitorCount);
    
    console.log(`🧦 Вы ${visitorCount}-й посетитель сайта умных носков!`);
    
    console.log('%c🧦 УМНЫЙ НОСОК-ШПИОН 🧦', 'font-size: 20px; color: #ff1493; font-weight: bold;');
    console.log('%cВаши ноги под защитой! 👀', 'font-size: 12px; color: #39ff14;');
});