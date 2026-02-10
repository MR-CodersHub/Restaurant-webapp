document.addEventListener('DOMContentLoaded', () => {
    /* --- Dishes Slider Auto-Sliding with Seamless Loop --- */
    const slider = document.querySelector('.dishes-slider');
    
    if (slider) {
        // Clone original items to create loop illusion
        const originalCards = Array.from(slider.children);
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            slider.appendChild(clone);
        });

        const cardWidth = 300; // From CSS
        const gap = 30; // From CSS
        const scrollStep = cardWidth + gap;
        const intervalTime = 3000;
        let isHovered = false;

        // Pause on hover
        slider.addEventListener('mouseenter', () => isHovered = true);
        slider.addEventListener('mouseleave', () => isHovered = false);

        const autoSlide = () => {
            if (isHovered) return;

            // Calculate total width of original set
            // (Assuming all cards are same width)
            const maxScroll = originalCards.length * scrollStep;

            // If we've scrolled past the first set, reset instantly to 0 (or equivalent position)
            // But we want to do this BEFORE the next slide if possible, or AFTER.
            // Best strategy:
            // 1. Check current position.
            // 2. If >= maxScroll, reset to (current - maxScroll) INSTANTLY.
            // 3. Then scroll smoothly to +step.
            
            if (slider.scrollLeft >= maxScroll) {
                slider.scrollTo({
                    left: slider.scrollLeft - maxScroll,
                    behavior: 'auto' // Instant jump
                });
            }

            // Now slide forward smoothly
            // Use requestAnimationFrame or setTimeout to ensure instant jump rendered
            // But scrollBy works in queue usually.
            
            // To be safe, wait 50ms
            setTimeout(() => {
                slider.scrollBy({
                    left: scrollStep,
                    behavior: 'smooth'
                });
            }, 20);
        };

        setInterval(autoSlide, intervalTime);
    }
});
