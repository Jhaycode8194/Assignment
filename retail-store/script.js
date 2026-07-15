(function() {
    // ----- product catalog -----
    const products = [
        { id: 1, name: 'T-shirt', price: 19.99, emoji: '👕' },
        { id: 2, name: 'Jeans', price: 39.99, emoji: '👖' },
        { id: 3, name: 'Sneakers', price: 49.99, emoji: '👟' },
        { id: 4, name: 'Cap', price: 14.99, emoji: '🧢' },
        { id: 5, name: 'Sunglasses', price: 24.99, emoji: '🕶️' },
        { id: 6, name: 'Watch', price: 59.99, emoji: '⌚' },
        { id: 7, name: 'Backpack', price: 34.99, emoji: '🎒' },
        { id: 8, name: 'Socks', price: 8.99, emoji: '🧦' },
    ];

    // ----- state -----
    let cart = [];  // array of { id, name, price, emoji, quantity }

    // DOM elements
    const productGrid = document.getElementById('productGrid');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalSpan = document.getElementById('cartTotal');
    const cartCountBadge = document.getElementById('cartCount');
    const cartTotalDisplay = document.getElementById('cartTotalDisplay');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const clearCartBtn = document.getElementById('clearCartBtn');

    // ----- render products -----
    function renderProducts() {
        productGrid.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-emoji">${product.emoji}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price.toFixed(2)}</div>
                <button class="add-btn" data-id="${product.id}"><i class="fas fa-plus-circle"></i> Add</button>
            `;
            productGrid.appendChild(card);
        });

        // attach event listeners to all add buttons
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const productId = parseInt(this.dataset.id);
                const product = products.find(p => p.id === productId);
                if (product) addToCart(product);
            });
        });
    }

    // ----- cart helpers -----
    function addToCart(product) {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ 
                id: product.id, 
                name: product.name, 
                price: product.price, 
                emoji: product.emoji, 
                quantity: 1 
            });
        }
        updateCartUI();
    }

    function removeFromCart(productId) {
        const index = cart.findIndex(item => item.id === productId);
        if (index !== -1) {
            const item = cart[index];
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            updateCartUI();
        }
    }

    function clearCart() {
        cart = [];
        updateCartUI();
    }

    // ----- update UI (cart items, total, badge) -----
    function updateCartUI() {
        // 1. render cart items
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<div class="empty-cart-message"><i class="fas fa-bag-shopping"></i> Cart is empty</div>`;
        } else {
            let html = '';
            cart.forEach(item => {
                const totalItemPrice = (item.price * item.quantity).toFixed(2);
                html += `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <span class="cart-item-emoji">${item.emoji}</span>
                            <span class="cart-item-name">${item.name}</span>
                            <span class="cart-item-qty">✕${item.quantity}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:0.3rem;">
                            <span class="cart-item-price">$${totalItemPrice}</span>
                            <button class="item-remove" data-id="${item.id}" title="remove one"><i class="fas fa-minus-circle"></i></button>
                        </div>
                    </div>
                `;
            });
            cartItemsContainer.innerHTML = html;

            // attach remove event listeners
            document.querySelectorAll('.item-remove').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const id = parseInt(this.dataset.id);
                    removeFromCart(id);
                });
            });
        }

        // 2. update total and badge
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalFormatted = total.toFixed(2);
        cartTotalSpan.textContent = `$${totalFormatted}`;
        cartTotalDisplay.textContent = `$${totalFormatted}`;

        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountBadge.textContent = itemCount;
    }

    // ----- checkout (demo) -----
    function checkout() {
        if (cart.length === 0) {
            alert('Your cart is empty. Add some products first!');
            return;
        }
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemNames = cart.map(item => `${item.emoji} ${item.name} (x${item.quantity})`).join('\n');
        alert(`🧾 Sale complete!\n\nItems:\n${itemNames}\n\nTotal: $${total.toFixed(2)}\n\nThank you for your purchase!`);
        // clear cart after checkout (optional)
        clearCart();
    }

    // ----- event binding -----
    checkoutBtn.addEventListener('click', checkout);
    clearCartBtn.addEventListener('click', function() {
        if (cart.length === 0) return;
        if (confirm('Clear the entire cart?')) {
            clearCart();
        }
    });

    // ----- init -----
    renderProducts();
    updateCartUI();

    console.log('🛒 Retail store ready. Click "Add" to sell!');
})();