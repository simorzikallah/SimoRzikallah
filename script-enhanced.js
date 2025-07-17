// Enhanced E-commerce JavaScript for Macomg

// Shopping Cart System
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({...product, quantity: 1});
        }
        this.saveCart();
        this.updateCartCount();
        this.showNotification(`${product.name} added to cart!`);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartCount();
            }
        }
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Product Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 79.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        description: "Premium wireless headphones with noise cancellation"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        description: "Advanced fitness tracking smartwatch"
    },
    {
        id: 3,
        name: "Designer T-Shirt",
        price: 29.99,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        description: "Comfortable cotton designer t-shirt"
    },
    {
        id: 4,
        name: "Running Shoes",
        price: 89.99,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        description: "Professional running shoes for athletes"
    },
    {
        id: 5,
        name: "Coffee Maker",
        price: 149.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1517668808426-b7f4adc21237?w=400",
        description: "Automatic coffee maker with timer"
    },
    {
        id: 6,
        name: "Desk Lamp",
        price: 39.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400",
        description: "Modern LED desk lamp with adjustable brightness"
    },
    {
        id: 7,
        name: "Yoga Mat",
        price: 24.99,
        category: "sports",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
        description: "Non-slip exercise yoga mat"
    },
    {
        id: 8,
        name: "Dumbbells Set",
        price: 119.99,
        category: "sports",
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400",
        description: "Adjustable dumbbells set for home gym"
    }
];

// Initialize Cart
const cart = new ShoppingCart();

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadProducts();
    setupEventListeners();
    setupMobileMenu();
    setupScrollEffects();
}

// Load Products
function loadProducts() {
    const productGrid = document.getElementById('featured-products');
    if (!productGrid) return;

    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = product.category;
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
        </div>
    `;
    
    return card;
}

// Add to Cart Function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.addItem(product);
    }
}

// Event Listeners
function setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterProducts(filter);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Filter Products
function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Newsletter Submit
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (email) {
        alert(`Thank you for subscribing with ${email}! You'll receive our latest updates.`);
        e.target.reset();
    }
}

// Mobile Menu
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

// Scroll Effects
function setupScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(102, 126, 234, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.category-card, .product-card, .feature-card').forEach(el => {
        observer.observe(el);
    });
}

    // Search Functionality
    function setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const productCards = document.querySelectorAll('.product-card');
                
                productCards.forEach(card => {
                    const productName = card.querySelector('h3').textContent.toLowerCase();
                    if (productName.includes(searchTerm)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
    }

    // Checkout functionality
    function checkout() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Your cart is empty. Please add some items before checking out.');
            return;
        }
        
        window.location.href = 'payment.html';
    }

    // Update cart click to redirect to payment
    function updateCartClick() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', function(e) {
                e.preventDefault();
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                if (cart.length === 0) {
                    alert('Your cart is empty. Please add some items before checking out.');
                    return;
                }
                window.location.href = 'payment.html';
            });
        }
    }

    // Add checkout button to navigation
    function addCheckoutButton() {
        const navIcons = document.querySelector('.nav-icons');
        if (navIcons) {
            const checkoutBtn = document.createElement('a');
            checkoutBtn.href = 'javascript:void(0)';
            checkoutBtn.className = 'checkout-nav';
            checkoutBtn.innerHTML = '<i class="fas fa-credit-card"></i> Checkout';
            checkoutBtn.addEventListener('click', checkout);
            navIcons.appendChild(checkoutBtn);
        }
    }

    // Add checkout button to cart
    function addCartCheckout() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount && parseInt(cartCount.textContent) > 0) {
            const cartContainer = document.createElement('div');
            cartContainer.className = 'cart-checkout';
            cartContainer.innerHTML = `
                <button onclick="checkout()" class="checkout-btn">
                    <i class="fas fa-credit-card"></i> Checkout
                </button>
            `;
            
            // Add to cart section or navigation
            const navContainer = document.querySelector('.nav-container');
            if (navContainer) {
                navContainer.appendChild(cartContainer);
            }
        }
    }

// Utility Functions
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

// CSS Animation Keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);

// Initialize search when DOM is ready
document.addEventListener('DOMContentLoaded', setupSearch);
