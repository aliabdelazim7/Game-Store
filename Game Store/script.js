// Enhanced Gaming Store JavaScript

// DOM Elements
const loadingOverlay = document.querySelector('.loading-overlay');
const header = document.querySelector('.header');
const searchToggle = document.getElementById('searchToggle');
const searchOverlay = document.getElementById('searchOverlay');
const searchInput = document.getElementById('searchInput');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.querySelector('.total-amount');
const quickViewModal = document.getElementById('quickViewModal');
const notification = document.getElementById('notification');
const dealTimer = document.getElementById('dealTimer');
const newsletterForm = document.getElementById('newsletterForm');

// Game Data
const gamesData = {
  witcher3: {
    name: "The Witcher 3: Wild Hunt",
    price: 39.99,
    originalPrice: 59.99,
    rating: 9.8,
    description: "Embark on an epic adventure in a vast open world full of monsters and magic.",
    tags: ["RPG", "Open World", "Fantasy"],
    platforms: ["PC", "PS4", "Xbox"],
    releaseDate: "2015",
    image: "photos/trending-01.jpg"
  },
  eldenring: {
    name: "Elden Ring",
    price: 59.99,
    originalPrice: 59.99,
    rating: 9.9,
    description: "Experience a breathtaking fantasy world created by FromSoftware.",
    tags: ["Action RPG", "Souls-like", "Fantasy"],
    platforms: ["PC", "PS4", "PS5", "Xbox"],
    releaseDate: "2022",
    image: "photos/trending-02.jpg"
  },
  fortnite: {
    name: "Fortnite",
    price: 0,
    originalPrice: 0,
    rating: 8.5,
    description: "Join the battle and be the last one standing in this exciting Battle Royale.",
    tags: ["Battle Royale", "Multiplayer", "Free-to-Play"],
    platforms: ["PC", "PS4", "PS5", "Xbox", "Mobile"],
    releaseDate: "2017",
    image: "photos/trending-03.jpg"
  }
};

// Cart Data
let cart = {
  items: [],
  total: 0
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  hideLoading();
  initializeHeader();
  initializeSearch();
  initializeCart();
  initializeGameCards();
  initializeDealTimer();
  initializeNewsletter();
  initializeAnimations();
  initializeEventListeners();
});

// Hide loading overlay
function hideLoading() {
  setTimeout(() => {
    loadingOverlay.style.opacity = '0';
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 500);
  }, 1500);
}

// Initialize header functionality
function initializeHeader() {
  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(navLink => {
          navLink.classList.remove('active');
        });
        link.classList.add('active');
      }
    });
  });
}

// Initialize search functionality
function initializeSearch() {
  // Toggle search overlay
  searchToggle.addEventListener('click', () => {
    searchOverlay.style.display = 'flex';
    searchInput.focus();
  });

  // Close search overlay
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.style.display = 'none';
    }
  });

  // Search functionality
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    performSearch(query);
  });

  // Search suggestions
  document.querySelectorAll('.suggestion-item').forEach(item => {
    item.addEventListener('click', () => {
      searchInput.value = item.querySelector('span').textContent;
      performSearch(searchInput.value);
    });
  });
}

// Perform search
function performSearch(query) {
  const gameCards = document.querySelectorAll('.game-card');
  
  gameCards.forEach(card => {
    const gameName = card.querySelector('h3').textContent.toLowerCase();
    const gameTags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
    const gameDescription = card.querySelector('p').textContent.toLowerCase();
    
    const matches = gameName.includes(query) || 
                   gameTags.some(tag => tag.includes(query)) ||
                   gameDescription.includes(query);
    
    if (matches || query === '') {
      card.style.display = 'block';
      card.style.animation = 'fadeIn 0.5s ease';
    } else {
      card.style.display = 'none';
    }
  });
}

// Initialize cart functionality
function initializeCart() {
  // Toggle cart sidebar
  cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('open');
  });

  // Close cart sidebar
  closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
  });

  // Close cart on outside click
  document.addEventListener('click', (e) => {
    if (!cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
      cartSidebar.classList.remove('open');
    }
  });
}

// Add to cart
function addToCart(gameId) {
  const game = gamesData[gameId];
  if (!game) return;

  const existingItem = cart.items.find(item => item.id === gameId);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.items.push({
      id: gameId,
      name: game.name,
      price: game.price,
      image: game.image,
      quantity: 1
    });
  }
  
  updateCart();
  showNotification(`${game.name} added to cart!`, 'success');
}

// Update cart display
function updateCart() {
  // Update cart count
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  // Update cart items
  cartItems.innerHTML = '';
  
  cart.items.forEach(item => {
    const itemElement = createCartItemElement(item);
    cartItems.appendChild(itemElement);
  });
  
  // Update total
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalAmount.textContent = `$${cart.total.toFixed(2)}`;
}

// Create cart item element
function createCartItemElement(item) {
  const div = document.createElement('div');
  div.className = 'cart-item-element';
  div.innerHTML = `
    <div class="cart-item-image">
      <img src="${item.image}" alt="${item.name}">
    </div>
    <div class="cart-item-details">
      <h4>${item.name}</h4>
      <div class="cart-item-price">$${item.price.toFixed(2)}</div>
      <div class="cart-item-quantity">
        <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
      </div>
    </div>
    <button class="remove-item" data-id="${item.id}">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add event listeners
  div.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      const itemId = e.target.dataset.id;
      updateCartItemQuantity(itemId, action);
    });
  });
  
  div.querySelector('.remove-item').addEventListener('click', (e) => {
    const itemId = e.target.closest('.remove-item').dataset.id;
    removeFromCart(itemId);
  });
  
  return div;
}

// Update cart item quantity
function updateCartItemQuantity(itemId, action) {
  const item = cart.items.find(item => item.id === itemId);
  if (!item) return;
  
  if (action === 'increase') {
    item.quantity++;
  } else if (action === 'decrease' && item.quantity > 1) {
    item.quantity--;
  }
  
  updateCart();
}

// Remove from cart
function removeFromCart(itemId) {
  cart.items = cart.items.filter(item => item.id !== itemId);
  updateCart();
  showNotification('Item removed from cart', 'info');
}

// Initialize game cards
function initializeGameCards() {
  // Wishlist functionality
  document.querySelectorAll('.action-btn.wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const gameCard = e.target.closest('.game-card');
      const gameId = gameCard.dataset.game;
      toggleWishlist(gameId, btn);
    });
  });

  // Add to cart functionality
  document.querySelectorAll('.action-btn.cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const gameCard = e.target.closest('.game-card');
      const gameId = gameCard.dataset.game;
      addToCart(gameId);
    });
  });

  // Quick view functionality
  document.querySelectorAll('.action-btn.quick-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const gameCard = e.target.closest('.game-card');
      const gameId = gameCard.dataset.game;
      showQuickView(gameId);
    });
  });
}

// Toggle wishlist
function toggleWishlist(gameId, btn) {
  const isWishlisted = btn.classList.contains('active');
  
  if (isWishlisted) {
    btn.classList.remove('active');
    showNotification('Removed from wishlist', 'info');
  } else {
    btn.classList.add('active');
    showNotification('Added to wishlist!', 'success');
  }
}

// Show quick view modal
function showQuickView(gameId) {
  const game = gamesData[gameId];
  if (!game) return;

  const modalBody = quickViewModal.querySelector('.modal-body');
  modalBody.innerHTML = `
    <div class="quick-view-content">
      <div class="quick-view-image">
        <img src="${game.image}" alt="${game.name}">
      </div>
      <div class="quick-view-details">
        <h2>${game.name}</h2>
        <div class="quick-view-rating">
          <i class="fas fa-star"></i>
          <span>${game.rating}</span>
        </div>
        <p>${game.description}</p>
        <div class="quick-view-tags">
          ${game.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="quick-view-platforms">
          <span>Platforms:</span>
          ${game.platforms.map(platform => `<i class="fab fa-${platform.toLowerCase()}"></i>`).join('')}
        </div>
        <div class="quick-view-price">
          ${game.originalPrice > game.price ? `<span class="original-price">$${game.originalPrice.toFixed(2)}</span>` : ''}
          <span class="current-price">${game.price === 0 ? 'Free' : `$${game.price.toFixed(2)}`}</span>
        </div>
        <div class="quick-view-actions">
          <button class="add-to-cart-btn" onclick="addToCart('${gameId}')">
            <i class="fas fa-shopping-cart"></i>
            Add to Cart
          </button>
          <button class="wishlist-btn" onclick="toggleWishlist('${gameId}', this)">
            <i class="fas fa-heart"></i>
            Wishlist
          </button>
        </div>
      </div>
    </div>
  `;

  quickViewModal.style.display = 'flex';
}

// Initialize deal timer
function initializeDealTimer() {
  if (!dealTimer) return;

  // Set end time (2 days from now)
  const endTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);

  function updateTimer() {
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance < 0) {
      dealTimer.innerHTML = '<span class="expired">Deal Expired!</span>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    dealTimer.innerHTML = `
      <span class="time-unit">
        <span class="time-value">${days.toString().padStart(2, '0')}</span>
        <span class="time-label">Days</span>
      </span>
      <span class="time-unit">
        <span class="time-value">${hours.toString().padStart(2, '0')}</span>
        <span class="time-label">Hours</span>
      </span>
      <span class="time-unit">
        <span class="time-value">${minutes.toString().padStart(2, '0')}</span>
        <span class="time-label">Minutes</span>
      </span>
    `;
  }

  updateTimer();
  setInterval(updateTimer, 60000); // Update every minute
}

// Initialize newsletter
function initializeNewsletter() {
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    if (validateEmail(email)) {
      showNotification('Thank you for subscribing!', 'success');
      newsletterForm.reset();
    } else {
      showNotification('Please enter a valid email address', 'error');
    }
  });
}

// Validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Initialize animations
function initializeAnimations() {
  // Intersection Observer for fade-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  // Observe elements for animation
  document.querySelectorAll('.game-card, .category-card, .deal-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });

  // Animate numbers
  animateNumbers();
}

// Animate numbers
function animateNumbers() {
  const numberElements = document.querySelectorAll('.stat-number');
  
  numberElements.forEach(element => {
    const finalNumber = parseInt(element.textContent);
    const duration = 2000;
    const increment = finalNumber / (duration / 16);
    let currentNumber = 0;
    
    const timer = setInterval(() => {
      currentNumber += increment;
      if (currentNumber >= finalNumber) {
        currentNumber = finalNumber;
        clearInterval(timer);
      }
      element.textContent = Math.floor(currentNumber) + (element.textContent.includes('+') ? '+' : '');
    }, 16);
  });
}

// Initialize event listeners
function initializeEventListeners() {
  // Close modal on outside click
  if (quickViewModal) {
    quickViewModal.addEventListener('click', (e) => {
      if (e.target === quickViewModal) {
        quickViewModal.style.display = 'none';
      }
    });
  }

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (quickViewModal && quickViewModal.style.display === 'flex') {
        quickViewModal.style.display = 'none';
      }
      if (searchOverlay && searchOverlay.style.display === 'flex') {
        searchOverlay.style.display = 'none';
      }
      if (cartSidebar && cartSidebar.classList.contains('open')) {
        cartSidebar.classList.remove('open');
      }
    }
  });

  // CTA button animations
  document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      createRippleEffect(e);
    });
  });

  // Deal button
  document.querySelector('.deal-btn')?.addEventListener('click', () => {
    showNotification('Deal purchased successfully!', 'success');
  });

  // View all buttons
  document.querySelectorAll('.view-all-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showNotification('Loading more games...', 'info');
    });
  });
}

// Create ripple effect
function createRippleEffect(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');
  
  button.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Show notification
function showNotification(message, type) {
  const notificationElement = document.createElement('div');
  notificationElement.className = `notification ${type}`;
  notificationElement.innerHTML = `
    <div class="notification-content">
      <i class="notification-icon fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span class="notification-message">${message}</span>
    </div>
  `;
  
  document.body.appendChild(notificationElement);
  
  // Animate in
  setTimeout(() => {
    notificationElement.classList.add('show');
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notificationElement.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notificationElement);
    }, 300);
  }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .cart-item-element {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    margin-bottom: 10px;
  }
  
  .cart-item-image img {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
  }
  
  .cart-item-details {
    flex: 1;
  }
  
  .cart-item-details h4 {
    color: white;
    margin-bottom: 5px;
    font-size: 0.9em;
  }
  
  .cart-item-price {
    color: #ee626b;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .cart-item-quantity {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .qty-btn {
    background: rgba(1, 113, 249, 0.2);
    border: none;
    color: #0171f9;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .qty-btn:hover {
    background: #0171f9;
    color: white;
  }
  
  .remove-item {
    background: rgba(231, 76, 60, 0.2);
    border: none;
    color: #e74c3c;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .remove-item:hover {
    background: #e74c3c;
    color: white;
  }
  
  .quick-view-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  
  .quick-view-image img {
    width: 100%;
    border-radius: 15px;
  }
  
  .quick-view-details h2 {
    color: white;
    margin-bottom: 15px;
  }
  
  .quick-view-rating {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 15px;
  }
  
  .quick-view-rating i {
    color: #ffd700;
  }
  
  .quick-view-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 15px;
  }
  
  .quick-view-platforms {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .quick-view-platforms i {
    color: #0171f9;
    font-size: 1.2em;
  }
  
  .quick-view-actions {
    display: flex;
    gap: 15px;
  }
  
  .add-to-cart-btn,
  .wishlist-btn {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .add-to-cart-btn {
    background: linear-gradient(45deg, #ee626b, #ff6b6b);
    color: white;
  }
  
  .wishlist-btn {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  .add-to-cart-btn:hover,
  .wishlist-btn:hover {
    transform: translateY(-2px);
  }
  
  .expired {
    color: #e74c3c;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    .quick-view-content {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(style);

// Performance optimization
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  scrollTimeout = setTimeout(() => {
    // Handle scroll-based animations if needed
  }, 16);
});

// Initialize on window load
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
