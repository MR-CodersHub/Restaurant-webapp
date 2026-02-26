/**
 * Shopping Cart Management System for Woods & Spices Restaurant
 * 
 * Handles all cart operations including:
 * - Adding/removing items
 * - Quantity management
 * - Price calculations (subtotal, tax, total)
 * - localStorage persistence
 * - Cart badge updates
 * 
 * @author Woods & Spices Development Team
 * @version 1.0.0
 */

// Shopping Cart Management System
// Handles all cart operations including localStorage persistence

/**
 * ShoppingCart Class
 * Manages the shopping cart state and operations
 */
class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.TAX_RATE = 0.10; // 10% tax
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('restaurantCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('restaurantCart', JSON.stringify(this.cart));
        this.updateCartBadge();
    }

    // Add item to cart
    addToCart(name, price, quantity) {
        quantity = parseInt(quantity);
        if (quantity <= 0) return;

        // Check if item already exists
        const existingItem = this.cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({ name, price, quantity });
        }

        this.saveCart();
        this.showNotification(`${name} added to cart!`);
    }

    // Update item quantity
    updateQuantity(name, newQuantity) {
        newQuantity = parseInt(newQuantity);
        const item = this.cart.find(item => item.name === name);

        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(name);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.renderCart();
            }
        }
    }

    // Remove item from cart
    removeItem(name) {
        this.cart = this.cart.filter(item => item.name !== name);
        this.saveCart();
        this.renderCart();
    }

    // Clear entire cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.renderCart();
    }

    // Calculate subtotal
    getSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Calculate tax
    getTax() {
        return this.getSubtotal() * this.TAX_RATE;
    }

    // Calculate total
    getTotal() {
        return this.getSubtotal() + this.getTax();
    }

    // Get total item count
    getItemCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Update cart badge in navbar
    updateCartBadge() {
        const badge = document.querySelector('.cart-badge');
        const count = this.getItemCount();

        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 10);

        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Render cart items on cart page
    renderCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartSummary = document.querySelector('.cart-summary');

        if (!cartItemsContainer) return;

        // Clear existing items except the title
        const title = cartItemsContainer.querySelector('h1');
        cartItemsContainer.innerHTML = '';
        if (title) cartItemsContainer.appendChild(title);

        if (this.cart.length === 0) {
            // Show empty cart message
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-cart-message';
            emptyMessage.innerHTML = `
                <i class="fa-solid fa-cart-shopping"></i>
                <h2>Your cart is empty</h2>
                <p>Add some delicious items from our menu!</p>
                <a href="menu.html" class="btn">Browse Menu</a>
            `;
            cartItemsContainer.appendChild(emptyMessage);

            // Hide summary if empty
            if (cartSummary) cartSummary.style.display = 'none';
        } else {
            // Show summary
            if (cartSummary) cartSummary.style.display = 'flex';

            // Render each cart item
            this.cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>$${item.price.toFixed(2)} each</p>
                        <div class="quantity-controls">
                            <button onclick="cart.updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="cart.updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="item-actions">
                        <div class="price">$${(item.price * item.quantity).toFixed(2)}</div>
                        <button class="remove-btn" onclick="cart.removeItem('${item.name}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });

            // Add clear cart button
            const clearButton = document.createElement('button');
            clearButton.className = 'clear-cart-btn';
            clearButton.textContent = 'Clear Cart';
            clearButton.onclick = () => {
                if (confirm('Are you sure you want to clear your cart?')) {
                    this.clearCart();
                }
            };
            cartItemsContainer.appendChild(clearButton);
        }

        // Update summary
        this.updateSummary();
    }

    // Update cart summary
    updateSummary() {
        const subtotalEl = document.querySelector('.summary-line:nth-child(1) span:last-child');
        const taxEl = document.querySelector('.summary-line:nth-child(2) span:last-child');
        const totalEl = document.querySelector('.total span:last-child');

        if (subtotalEl) subtotalEl.textContent = `$${this.getSubtotal().toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${this.getTax().toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${this.getTotal().toFixed(2)}`;
    }

    // Handle checkout
    checkout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const total = this.getTotal();
        if (confirm(`Proceed to checkout? Total: $${total.toFixed(2)}`)) {
            this.clearCart();
            alert('Thank you for your order! Your order has been placed successfully.');
            window.location.href = 'index.html';
        }
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Update badge on page load
document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartBadge();

    // If on cart page, render cart
    if (document.querySelector('.cart-items')) {
        cart.renderCart();
    }

    // Setup checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => cart.checkout();
    }

    // Setup add to cart buttons on menu page
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Updated logic to find parent in new structure (.menu-row or .menu-card-premium)
            const menuRow = this.closest('.menu-row') || this.closest('.menu-card-premium'); // Fallback

            let name, price;

            if (menuRow.classList.contains('menu-row')) {
                // For Zig-Zag Layout
                name = menuRow.querySelector('h3').textContent;
                const priceText = menuRow.querySelector('.menu-row-price').textContent;
                price = parseFloat(priceText.replace('$', ''));
            } else {
                // Fallback for Card Grid (if mixed)
                name = menuRow.querySelector('h3').textContent;
                const priceText = menuRow.querySelector('.menu-price') ? menuRow.querySelector('.menu-price').textContent : menuRow.querySelector('.dish-price').textContent;
                price = parseFloat(priceText.replace('$', ''));
            }

            // Default to 1 if no quantity input exists
            const qtyInput = menuRow.querySelector('.quantity-input');
            const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

            cart.addToCart(name, price, quantity);

            // Reset quantity to 1 if input exists
            if (qtyInput) qtyInput.value = 1;
        });
    });
});
