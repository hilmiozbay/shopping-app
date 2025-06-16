const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Veri yükleme
let products = [];
let categories = [];
let users = [];
let reviews = [];
let favorites = [];

// Session management (basit)
let sessions = {};

// Veri dosyalarını okuma
try {
    const productsData = fs.readFileSync('./data/products.json', 'utf8');
    products = JSON.parse(productsData);
    
    const categoriesData = fs.readFileSync('./data/categories.json', 'utf8');
    categories = JSON.parse(categoriesData);
    
    const usersData = fs.readFileSync('./data/users.json', 'utf8');
    users = JSON.parse(usersData);
    
    const reviewsData = fs.readFileSync('./data/reviews.json', 'utf8');
    reviews = JSON.parse(reviewsData);
    
    const favoritesData = fs.readFileSync('./data/favorites.json', 'utf8');
    favorites = JSON.parse(favoritesData);
} catch (error) {
    console.log('Veri dosyaları oluşturuluyor...');
}

// API Routes
// Tüm ürünleri getir
app.get('/api/products', (req, res) => {
    const { category, search, minPrice, maxPrice } = req.query;
    let filteredProducts = [...products];

    // Kategori filtresi
    if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
    }

    // Arama filtresi
    if (search) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.description.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Fiyat filtresi
    if (minPrice) {
        filteredProducts = filteredProducts.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
        filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(maxPrice));
    }

    res.json(filteredProducts);
});

// Tek ürün getir
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ message: 'Ürün bulunamadı' });
    }
    res.json(product);
});

// Kategorileri getir
app.get('/api/categories', (req, res) => {
    res.json(categories);
});

// Popüler ürünleri getir
app.get('/api/products/popular', (req, res) => {
    const popularProducts = products
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
    res.json(popularProducts);
});

// Utility functions
function generateId(array) {
    return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
}

function saveData(filename, data) {
    try {
        fs.writeFileSync(`./data/${filename}`, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error saving ${filename}:`, error);
        return false;
    }
}

// AUTH ROUTES
// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password && u.isActive);
    
    if (!user) {
        return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }
    
    // Basit session oluştur
    const sessionId = Math.random().toString(36).substr(2, 9);
    sessions[sessionId] = {
        userId: user.id,
        email: user.email,
        role: user.role,
        createdAt: new Date()
    };
    
    res.json({
        success: true,
        sessionId,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            avatar: user.avatar
        }
    });
});

// Register
app.post('/api/auth/register', (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    
    // Email kontrolü
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'Bu email zaten kayıtlı' });
    }
    
    const newUser = {
        id: generateId(users),
        email,
        password,
        firstName,
        lastName,
        role: 'user',
        avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100`,
        createdAt: new Date().toISOString(),
        isActive: true
    };
    
    users.push(newUser);
    saveData('users.json', users);
    
    res.json({ success: true, message: 'Kayıt başarılı' });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    const { sessionId } = req.body;
    delete sessions[sessionId];
    res.json({ success: true });
});

// Session kontrol
app.get('/api/auth/session/:sessionId', (req, res) => {
    const session = sessions[req.params.sessionId];
    if (!session) {
        return res.status(401).json({ message: 'Geçersiz session' });
    }
    
    const user = users.find(u => u.id === session.userId);
    res.json({
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            avatar: user.avatar
        }
    });
});

// REVIEWS ROUTES
// Ürün yorumlarını getir
app.get('/api/products/:id/reviews', (req, res) => {
    const productId = parseInt(req.params.id);
    const productReviews = reviews.filter(r => r.productId === productId);
    
    // Kullanıcı bilgilerini ekle
    const reviewsWithUsers = productReviews.map(review => {
        const user = users.find(u => u.id === review.userId);
        return {
            ...review,
            user: {
                firstName: user?.firstName || 'Anonim',
                lastName: user?.lastName || 'Kullanıcı',
                avatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
            }
        };
    });
    
    res.json(reviewsWithUsers);
});

// Yorum ekle
app.post('/api/products/:id/reviews', (req, res) => {
    const { sessionId, rating, comment } = req.body;
    const productId = parseInt(req.params.id);
    
    const session = sessions[sessionId];
    if (!session) {
        return res.status(401).json({ message: 'Giriş gerekli' });
    }
    
    const newReview = {
        id: generateId(reviews),
        productId,
        userId: session.userId,
        rating: parseInt(rating),
        comment,
        createdAt: new Date().toISOString(),
        helpful: 0,
        reported: false
    };
    
    reviews.push(newReview);
    saveData('reviews.json', reviews);
    
    res.json({ success: true, review: newReview });
});

// FAVORITES ROUTES
// Kullanıcı favorilerini getir
app.get('/api/favorites/:sessionId', (req, res) => {
    const session = sessions[req.params.sessionId];
    if (!session) {
        return res.status(401).json({ message: 'Giriş gerekli' });
    }
    
    const userFavorites = favorites.filter(f => f.userId === session.userId);
    const favoriteProducts = userFavorites.map(fav => {
        const product = products.find(p => p.id === fav.productId);
        return { ...product, favoriteId: fav.id };
    });
    
    res.json(favoriteProducts);
});

// Favorilere ekle/çıkar
app.post('/api/favorites', (req, res) => {
    const { sessionId, productId } = req.body;
    
    const session = sessions[sessionId];
    if (!session) {
        return res.status(401).json({ message: 'Giriş gerekli' });
    }
    
    const existingFavorite = favorites.find(f => f.userId === session.userId && f.productId === productId);
    
    if (existingFavorite) {
        // Favorilerden çıkar
        favorites.splice(favorites.indexOf(existingFavorite), 1);
        saveData('favorites.json', favorites);
        res.json({ success: true, action: 'removed' });
    } else {
        // Favorilere ekle
        const newFavorite = {
            id: generateId(favorites),
            userId: session.userId,
            productId: parseInt(productId),
            createdAt: new Date().toISOString()
        };
        
        favorites.push(newFavorite);
        saveData('favorites.json', favorites);
        res.json({ success: true, action: 'added' });
    }
});

// ADMIN ROUTES
// Admin kontrolü middleware
function requireAdmin(req, res, next) {
    const sessionId = req.headers['session-id'];
    const session = sessions[sessionId];
    
    if (!session || session.role !== 'admin') {
        return res.status(403).json({ message: 'Admin yetkisi gerekli' });
    }
    
    next();
}

// Ürün ekle (Admin)
app.post('/api/admin/products', requireAdmin, (req, res) => {
    const newProduct = {
        id: generateId(products),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    saveData('products.json', products);
    
    res.json({ success: true, product: newProduct });
});

// Ürün güncelle (Admin)
app.put('/api/admin/products/:id', requireAdmin, (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Ürün bulunamadı' });
    }
    
    products[productIndex] = { ...products[productIndex], ...req.body };
    saveData('products.json', products);
    
    res.json({ success: true, product: products[productIndex] });
});

// Ürün sil (Admin)
app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Ürün bulunamadı' });
    }
    
    products.splice(productIndex, 1);
    saveData('products.json', products);
    
    res.json({ success: true });
});

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login sayfası
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Admin paneli
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Server başlatma
app.listen(PORT, () => {
    console.log(`🚀 E-ticaret sunucusu http://localhost:${PORT} adresinde çalışıyor`);
}); 