document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.minimal-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            // Note: The inputs in contact.html might not have IDs, so we select by query if needed or add IDs if we edit HTML.
            // Looking at the view_file output for contact.html:
            // Inputs don't have IDs, just structure.
            // <div class="input-block"><input type="text" placeholder="Your Name" required></div>
            // We'll rely on order or add IDs. Adding IDs is safer.

            // Let's grab inputs by order for now if we don't want to edit HTML extensively, 
            // but editing HTML to add IDs is better practice. 
            // However, to be quick and clean with the tools:
            const inputs = contactForm.querySelectorAll('input, textarea');
            const name = inputs[0].value;
            const email = inputs[1].value;
            const subject = inputs[2].value;
            const message = inputs[3].value;

            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Create message object
            const inquiry = {
                id: Date.now(),
                name,
                email,
                subject,
                message,
                read: false,
                created_at: new Date().toISOString()
            };

            // Save to localStorage (Mock Backend)
            const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            messages.push(inquiry);
            localStorage.setItem('contactMessages', JSON.stringify(messages));

            // Feedback
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
});
