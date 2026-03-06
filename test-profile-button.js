// Profile Button Test Script
// Add this to browser console to test the profile button

console.log('=== Profile Button Test ===');

// Check if account button exists
const accountBtn = document.getElementById('accountBtn');
console.log('Account button found:', !!accountBtn);

// Check if dropdown exists
const dropdown = document.querySelector('.user-dropdown');
console.log('Dropdown found:', !!dropdown);

// Check if auth object exists
console.log('Auth object exists:', typeof auth !== 'undefined');

// Test click handler
if (accountBtn) {
    console.log('Account button onclick:', accountBtn.onclick);
    console.log('Attempting to trigger click...');
    accountBtn.click();
    
    setTimeout(() => {
        const isShowing = dropdown?.classList.contains('show');
        console.log('Dropdown showing after click:', isShowing);
        
        if (isShowing) {
            console.log('✅ Profile button is working!');
        } else {
            console.log('❌ Profile button click did not show dropdown');
            console.log('Dropdown classes:', dropdown?.className);
        }
    }, 100);
} else {
    console.log('❌ Account button not found');
}
