// 1. DUMMY PRODUCT DATA (Same as before)
const DUMMY_PRODUCTS = [
    { id: 1, name: "Wireless Headphones", price: 99.99, image: "https://picsum.photos/300/200?random=1" },
    { id: 2, name: "Smartwatch Pro", price: 199.99, image: "https://picsum.photos/300/200?random=2" },
    { id: 3, name: "Portable Power Bank", price: 35.50, image: "https://picsum.photos/300/200?random=3" },
    { id: 4, name: "4K Monitor", price: 499.00, image: "https://picsum.photos/300/200?random=4" },
    { id: 5, name: "Mechanical Keyboard", price: 120.00, image: "https://picsum.photos/300/200?random=5" },
    { id: 6, name: "RGB Mousepad", price: 25.00, image: "https://picsum.photos/300/200?random=6" },
];

// 2. DOM Elements
const productList = document.getElementById('product-list');
const cartCountElement = document.getElementById('cart-count');
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalElement = document.getElementById('cart-total');

// 3. Cart Data
let cart = JSON.parse(localStorage.getItem('polymartCart')) || [];

// --- CORE CART LOGIC ---

// Function to calculate and update the total cart item count
function getTotalCartItems() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Function to save the cart and refresh the UI
function updateCartUI() {
    localStorage.setItem('polymartCart', JSON.stringify(cart));
    cartCountElement.textContent = getTotalCartItems();
    renderCartItems(); // Re-render the cart items whenever the cart data changes
}

// Function to handle adding a product to the cart
function handleAddToCart(event) {
    const productId = parseInt(event.target.dataset.id);
    const product = DUMMY_PRODUCTS.find(p => p.id === productId);

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    openCart(); // Open the cart sidebar when an item is added
}

// --- CART DISPLAY LOGIC ---

function openCart() {
    cartSidebar.classList.add('open');
    overlay.style.display = 'block';
}

function closeCart() {
    cartSidebar.classList.remove('open');
    overlay.style.display = 'none';
}

function renderCartItems() {
    cartItemsContainer.innerHTML = ''; // Clear existing items

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-message">Your cart is empty.</p>';
        cartTotalElement.textContent = '$0.00';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemHTML = document.createElement('div');
        cartItemHTML.className = 'cart-item';
        cartItemHTML.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="item-controls">
                <button data-id="${item.id}" data-action="decrease">-</button>
                <span>${item.quantity}</span>
                <button data-id="${item.id}" data-action="increase">+</button>
                <button data-id="${item.id}" data-action="remove">X</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemHTML);
    });

    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

// Function to handle quantity changes/removal from cart
function handleCartControls(event) {
    const target = event.target;
    if (!target.dataset.id || !target.dataset.action) return;

    const productId = parseInt(target.dataset.id);
    const action = target.dataset.action;

    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    switch (action) {
        case 'increase':
            cart[itemIndex].quantity += 1;
            break;
        case 'decrease':
            cart[itemIndex].quantity -= 1;
            if (cart[itemIndex].quantity <= 0) {
                // If quantity drops to 0, remove the item
                cart.splice(itemIndex, 1);
            }
            break;
        case 'remove':
            cart.splice(itemIndex, 1);
            break;
    }

    updateCartUI();
}

// --- INITIALIZATION ---

// Function to render all product cards on the main page
function renderProducts() {
    DUMMY_PRODUCTS.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        `;
        productList.appendChild(productCard);
    });

    // Attach event listeners to all 'Add to Cart' buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI(); // Initial cart count load
    
    // Attach event listeners for opening and closing the cart
    document.querySelector('.cart-icon').addEventListener('click', openCart);
    document.getElementById('close-cart-btn').addEventListener('click', closeCart);
    document.getElementById('overlay').addEventListener('click', closeCart);
    
    // Attach event listener for quantity controls and remove buttons
    cartItemsContainer.addEventListener('click', handleCartControls);
    
    // Simple alert for checkout button (since we're front-end only)
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        alert("Proceeding to a hypothetical checkout page... This requires a back-end!");
        closeCart();
    });
});