// E-ticaret Uygulaması - Ana JavaScript Dosyası

// Global değişkenler
let products = [];
let categories = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let filteredProducts = [];

// DOM elementleri
const productsGrid = document.getElementById('productsGrid');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priceRange = document.getElementById('priceRange');
const sortBy = document.getElementById('sortBy');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const productModal = document.getElementById('productModal');
const modalBody = document.getElementById('modalBody');
const overlay = document.getElementById('overlay');

// Uygulama başlatma
document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
    await loadProducts();
    updateCartUI();
    setupEventListeners();
    checkUserSession();
});

// Event listener'ları kurma
function setupEventListeners() {
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyFilters();
                scrollToProducts();
            }
        });
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim() !== '') {
                scrollToProducts();
            }
        });
    }
}

// Debounce fonksiyonu
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Kategorileri yükleme
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        categories = await response.json();
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = `${category.icon} ${category.name}`;
            categoryFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
    }
}

// Ürünleri yükleme
async function loadProducts() {
    showLoading(true);
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        filteredProducts = [...products];
        displayProducts(filteredProducts);
    } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
        showError('Ürünler yüklenirken bir hata oluştu.');
    } finally {
        showLoading(false);
    }
}

// Ürünleri gösterme
function displayProducts(productsToShow) {
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-products">
                <div class="empty-icon">📦</div>
                <h3>Ürün bulunamadı</h3>
                <p>Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.featured ? '<div class="product-badge">Öne Çıkan</div>' : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="rating-text">(${product.rating})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Sepete Ekle
                    </button>
                    <button class="view-details-btn" onclick="showProductModal(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Yıldız puanı oluşturma
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Fiyat formatlama
function formatPrice(price) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0
    }).format(price);
}

// Filtreleri uygulama
async function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedPriceRange = priceRange.value;
    const sortOption = sortBy.value;

    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.append('category', selectedCategory);
    if (searchTerm) params.append('search', searchTerm);
    
    if (selectedPriceRange !== 'all') {
        const [min, max] = selectedPriceRange.split('-');
        params.append('minPrice', min);
        params.append('maxPrice', max);
    }

    showLoading(true);
    
    try {
        const response = await fetch(`/api/products?${params.toString()}`);
        filteredProducts = await response.json();
        
        // Apply client-side sorting
        applySorting(filteredProducts, sortOption);
        displayProducts(filteredProducts);

        // Arama sonuçlarını göster
        if (searchTerm) {
            const searchResultsCount = filteredProducts.length;
            const searchMessage = searchResultsCount > 0 
                ? `"${searchTerm}" için ${searchResultsCount} sonuç bulundu`
                : `"${searchTerm}" için sonuç bulunamadı`;
            
            const searchInfo = document.createElement('div');
            searchInfo.className = 'search-info';
            searchInfo.innerHTML = `
                <div class="search-message">${searchMessage}</div>
                ${searchResultsCount === 0 ? '<button onclick="clearSearch()" class="clear-search-btn">Aramayı Temizle</button>' : ''}
            `;
            
            const existingSearchInfo = document.querySelector('.search-info');
            if (existingSearchInfo) {
                existingSearchInfo.remove();
            }
            
            document.querySelector('.section-title').after(searchInfo);
        }
    } catch (error) {
        console.error('Filtreleme hatası:', error);
        showError('Filtreleme sırasında bir hata oluştu.');
    } finally {
        showLoading(false);
    }
}

// Apply sorting
function applySorting(products, sortOption) {
    switch (sortOption) {
        case 'price-low':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            products.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            products.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            products.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
            break;
    }
}

// Sepete ekleme
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showNotification(`${product.name} sepete eklendi!`, 'success');
}

// Sepeti kaydetme
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Sepet UI güncelleme
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatPrice(total);

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <h3>Sepetiniz boş</h3>
                <p>Ürün eklemek için alışverişe başlayın!</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                        <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="background: #ff4757; margin-left: 10px;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Sepet miktarı güncelleme
function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    updateCartUI();
}

// Sepetten çıkarma
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Sepeti açma/kapama
function toggleCart() {
    cartSidebar.classList.toggle('active');
}

// Ürün detayı gösterme
function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    modalBody.innerHTML = `
        <div style="padding: 2rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
                <div>
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 10px;">
                </div>
                <div>
                    <div style="color: #667eea; font-weight: 500; margin-bottom: 0.5rem;">${product.category}</div>
                    <h2 style="margin-bottom: 1rem; color: #333;">${product.name}</h2>
                    <p style="color: #666; margin-bottom: 1rem; line-height: 1.6;">${product.description}</p>
                    
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="color: #ffd700;">${generateStars(product.rating)}</div>
                        <span style="color: #666;">(${product.rating} puan)</span>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                        <span style="font-size: 2rem; font-weight: 700; color: #27ae60;">${formatPrice(product.price)}</span>
                        ${product.originalPrice ? `<span style="color: #999; text-decoration: line-through;">${formatPrice(product.originalPrice)}</span>` : ''}
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <strong>Stok:</strong> ${product.stock} adet
                    </div>
                    
                    <button onclick="addToCart(${product.id}); closeModal();" 
                            style="width: 100%; background: #667eea; color: white; border: none; padding: 15px; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer;">
                        <i class="fas fa-cart-plus"></i> Sepete Ekle
                    </button>
                </div>
            </div>
        </div>
    `;
    
    productModal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Modal kapatma
function closeModal() {
    productModal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Ödeme
function checkout() {
    if (cart.length === 0) {
        showNotification('Sepetiniz boş!', 'warning');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderSummary = cart.map(item => `${item.name} x${item.quantity}`).join('\n');
    
    if (confirm(`Siparişinizi onaylıyor musunuz?\n\n${orderSummary}\n\nToplam: ${formatPrice(total)}`)) {
        // Simulate order processing
        showNotification('Siparişiniz alındı! Teşekkür ederiz.', 'success');
        cart = [];
        saveCart();
        updateCartUI();
        toggleCart();
    }
}

// Ürünlere kaydırma
function scrollToProducts() {
    document.getElementById('productsSection').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Loading gösterme
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}

// Show error message
function showError(message) {
    productsGrid.innerHTML = `
        <div class="empty-products">
            <div class="empty-icon">⚠️</div>
            <h3>Hata</h3>
            <p>${message}</p>
            <button onclick="loadProducts()" style="margin-top: 1rem; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Tekrar Dene
            </button>
        </div>
    `;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    switch (type) {
        case 'success':
            notification.style.background = '#27ae60';
            break;
        case 'error':
            notification.style.background = '#e74c3c';
            break;
        case 'warning':
            notification.style.background = '#f39c12';
            break;
        default:
            notification.style.background = '#3498db';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Mobil menü (placeholder)
function toggleMobileMenu() {
    // Mobile menu functionality can be implemented here
    console.log('Mobile menu toggle');
}

// Session kontrolü
async function checkUserSession() {
    const sessionId = localStorage.getItem('sessionId');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (sessionId && user.id) {
        try {
            const response = await fetch(`/api/auth/session/${sessionId}`);
            if (response.ok) {
                const data = await response.json();
                showUserSection(data.user);
            } else {
                clearUserSession();
            }
        } catch (error) {
            clearUserSession();
        }
    } else {
        showLoginButton();
    }
}

// Kullanıcı bölümünü göster
function showUserSection(user) {
    document.getElementById('userSection').style.display = 'block';
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('userName').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('userAvatar').src = user.avatar;
    
    // Admin ise admin paneli butonunu ekle
    if (user.role === 'admin') {
        const adminBtn = document.createElement('a');
        adminBtn.href = '/admin';
        adminBtn.style.cssText = 'color: #ffd700; text-decoration: none; margin-left: 10px; padding: 5px 10px; background: rgba(255,215,0,0.2); border-radius: 5px;';
        adminBtn.innerHTML = '<i class="fas fa-cog"></i> Admin';
        document.getElementById('userSection').appendChild(adminBtn);
    }
}

// Giriş butonunu göster
function showLoginButton() {
    document.getElementById('userSection').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'block';
}

// Session temizle
function clearUserSession() {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
    showLoginButton();
}

// Çıkış yap
function logout() {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        const sessionId = localStorage.getItem('sessionId');
        
        if (sessionId) {
            fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            });
        }
        
        clearUserSession();
        showNotification('Başarıyla çıkış yaptınız!', 'success');
    }
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Arama temizleme
function clearSearch() {
    searchInput.value = '';
    applyFilters();
    document.querySelector('.search-info')?.remove();
} 