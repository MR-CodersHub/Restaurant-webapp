document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    let current = 0;
    const intervalTime = 5000; // 5 seconds
    let slideInterval;

    const showSlide = (index) => {
        // Remove active class from current
        slides[current].classList.remove('active');
        if (dots.length > 0) dots[current].classList.remove('active');

        // Update current index
        current = index;

        // Add active class to new
        slides[current].classList.add('active');
        if (dots.length > 0) dots[current].classList.add('active');
    };

    const nextSlide = () => {
        const next = (current + 1) % slides.length;
        showSlide(next);
    };

    // Start auto rotation
    if (slides.length > 0) {
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    // Optional: Click on dots to navigate
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval); // Stop auto on interaction
            showSlide(index);
            slideInterval = setInterval(nextSlide, intervalTime); // Restart
        });
    });
});
