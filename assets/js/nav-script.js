/**
 * Navigation Handler for Woods & Spices
 * Handles mobile menu behavior, scrolling, and overlay interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('nav-toggle');
    if (!navToggle) return;

    const navLinks = document.querySelectorAll('.nav-links a');
    const navOverlay = document.querySelector('.nav-overlay');

    // Toggle body scroll when menu opens/closes
    navToggle.addEventListener('change', () => {
        if (navToggle.checked) {
            document.body.style.overflow = 'hidden';
            // Also ensure any open dropdowns are closed
            const dropdown = document.querySelector(".user-dropdown");
            if (dropdown) dropdown.classList.remove("show");
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            navToggle.checked = false;
            document.body.style.overflow = '';
        });
    }

    // Close menu when link or action button is clicked
    const closeTriggers = document.querySelectorAll('.nav-links a, .account-btn, .cart-link');
    closeTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            if (navToggle.checked) {
                navToggle.checked = false;
                document.body.style.overflow = '';
            }
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navToggle.checked) {
            navToggle.checked = false;
            document.body.style.overflow = '';
        }
    });
});
