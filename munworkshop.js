// FAQ accordion - Enhanced for smoother animation using CSS max-height/opacity
document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('button');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
        // Close all other open items
        document.querySelectorAll('.faq-item.open').forEach(sib => {
            if (sib !== item) {
                sib.classList.remove('open');
                sib.querySelector('button').setAttribute('aria-expanded', 'false');
            }
        });

        // Toggle the current item
        const isOpen = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
});

// Reveal on scroll
const reveal = (entries, observer) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.opacity = 1;
            observer.unobserve(e.target);
        }
    });
};

const observer = new IntersectionObserver(reveal, { threshold: 0.12 });

document.querySelectorAll('.info-card, .who-card, .card').forEach(el => {
    el.style.transform = 'translateY(12px)';
    el.style.opacity = 0;
    el.style.transition = 'all .7s cubic-bezier(.1, .7, .1, 1)';
    observer.observe(el);
});

