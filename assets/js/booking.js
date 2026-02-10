document.addEventListener('DOMContentLoaded', () => {
    // 1. Set minimum date to today
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // 2. Handle Booking Form Submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect data
            const name = document.getElementById('bookingName').value;
            const email = document.getElementById('bookingEmail').value;
            const phone = document.getElementById('bookingPhone').value;
            const guests = document.getElementById('bookingGuests').value;
            const date = document.getElementById('bookingDate').value;
            const time = document.getElementById('bookingTime').value;
            const location = document.getElementById('bookingLocation').value;
            const requests = document.getElementById('bookingRequests').value;

            // Simple validation (HTML5 'required' handles most)
            if (!name || !email || !phone || !guests || !date || !time || !location) {
                alert('Please fill in all required fields.');
                return;
            }

            // Create Booking Object
            const booking = {
                id: Date.now(),
                name,
                email,
                phone,
                guests,
                date,
                time,
                location,
                requests,
                status: 'Confirmed', // Mock confirmation
                created_at: new Date().toISOString()
            };

            // Save to localStorage (Mock Backend)
            const bookings = JSON.parse(localStorage.getItem('restaurantBookings') || '[]');
            bookings.push(booking);
            localStorage.setItem('restaurantBookings', JSON.stringify(bookings));

            // Success Feedback
            alert(`Table reserved successfully for ${date} at ${time}!\nWe have sent a confirmation to ${email}.`);
            bookingForm.reset();
        });
    }
});
