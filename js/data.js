/* ============================================
   KOPMAS ASEM KEMBAR — Data Store
   Wraps localStorage with helper methods
   and seeds initial demo data
   ============================================ */

const DataStore = {
  // --- Generic CRUD ---
  _get(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch { return []; }
  },

  _set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  _getObj(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || {};
    } catch { return {}; }
  },

  _setObj(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // --- Products ---
  getProducts() { return this._get('kopmas_products'); },
  setProducts(data) { this._set('kopmas_products', data); },
  getProductById(id) { return this.getProducts().find(p => p.id === id); },
  addProduct(product) {
    const items = this.getProducts();
    product.id = 'PRD-' + Date.now();
    product.createdAt = new Date().toISOString();
    items.push(product);
    this.setProducts(items);
    return product;
  },
  updateProduct(id, updates) {
    const items = this.getProducts().map(p => p.id === id ? { ...p, ...updates } : p);
    this.setProducts(items);
  },
  deleteProduct(id) {
    this.setProducts(this.getProducts().filter(p => p.id !== id));
  },

  // --- Cart ---
  getCart() { return this._get('kopmas_cart'); },
  setCart(data) { this._set('kopmas_cart', data); },
  addToCart(productId, qty = 1) {
    const cart = this.getCart();
    const existing = cart.find(c => c.productId === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ productId, qty });
    }
    this.setCart(cart);
    window.dispatchEvent(new Event('cart-updated'));
  },
  updateCartQty(productId, qty) {
    let cart = this.getCart();
    if (qty <= 0) {
      cart = cart.filter(c => c.productId !== productId);
    } else {
      cart = cart.map(c => c.productId === productId ? { ...c, qty } : c);
    }
    this.setCart(cart);
    window.dispatchEvent(new Event('cart-updated'));
  },
  removeFromCart(productId) {
    this.setCart(this.getCart().filter(c => c.productId !== productId));
    window.dispatchEvent(new Event('cart-updated'));
  },
  clearCart() {
    this.setCart([]);
    window.dispatchEvent(new Event('cart-updated'));
  },
  getCartCount() {
    return this.getCart().reduce((sum, c) => sum + c.qty, 0);
  },
  getCartTotal() {
    const products = this.getProducts();
    return this.getCart().reduce((sum, c) => {
      const product = products.find(p => p.id === c.productId);
      return sum + (product ? product.price * c.qty : 0);
    }, 0);
  },

  // --- Orders ---
  getOrders() { return this._get('kopmas_orders'); },
  setOrders(data) { this._set('kopmas_orders', data); },
  addOrder(order) {
    const items = this.getOrders();
    order.id = 'ORD-' + Date.now();
    order.createdAt = new Date().toISOString();
    order.status = 'menunggu';
    items.push(order);
    this.setOrders(items);
    return order;
  },
  updateOrderStatus(id, status) {
    const items = this.getOrders().map(o => o.id === id ? { ...o, status } : o);
    this.setOrders(items);
  },

  // --- Agenda ---
  getAgenda() { return this._get('kopmas_agenda'); },
  setAgenda(data) { this._set('kopmas_agenda', data); },
  addAgenda(item) {
    const items = this.getAgenda();
    item.id = 'AGD-' + Date.now();
    items.push(item);
    this.setAgenda(items);
    return item;
  },
  updateAgenda(id, updates) {
    const items = this.getAgenda().map(a => a.id === id ? { ...a, ...updates } : a);
    this.setAgenda(items);
  },
  deleteAgenda(id) {
    this.setAgenda(this.getAgenda().filter(a => a.id !== id));
  },

  // --- Finance ---
  getFinance() { return this._get('kopmas_finance'); },
  setFinance(data) { this._set('kopmas_finance', data); },
  addFinance(item) {
    const items = this.getFinance();
    item.id = 'FIN-' + Date.now();
    item.createdAt = new Date().toISOString();
    items.push(item);
    this.setFinance(items);
    return item;
  },
  updateFinance(id, updates) {
    const items = this.getFinance().map(f => f.id === id ? { ...f, ...updates } : f);
    this.setFinance(items);
  },
  deleteFinance(id) {
    this.setFinance(this.getFinance().filter(f => f.id !== id));
  },
  getFinanceSummary() {
    const items = this.getFinance();
    const income = items.filter(f => f.type === 'pemasukan').reduce((s, f) => s + f.amount, 0);
    const expense = items.filter(f => f.type === 'pengeluaran').reduce((s, f) => s + f.amount, 0);
    const extra = items.filter(f => f.type === 'dana_tambahan').reduce((s, f) => s + f.amount, 0);
    return { income, expense, extra, balance: income + extra - expense };
  },

  // --- Auth ---
  getAdmin() {
    return this._getObj('kopmas_admin');
  },
  setAdmin(data) {
    this._setObj('kopmas_admin', data);
  },
  isLoggedIn() {
    return !!localStorage.getItem('kopmas_logged_in');
  },
  login(username, password) {
    const admin = this.getAdmin();
    if (admin.username === username && admin.password === password) {
      localStorage.setItem('kopmas_logged_in', 'true');
      return true;
    }
    return false;
  },
  logout() {
    localStorage.removeItem('kopmas_logged_in');
  },

  // --- Seed Data ---
  seed() {
    if (localStorage.getItem('kopmas_seeded')) return;

    // Admin credentials
    this.setAdmin({ username: 'admin', password: 'admin123' });

    // Products
    this.setProducts([
      {
        id: 'PRD-001',
        name: 'Pakcoy Segar Premium',
        description: 'Pakcoy segar berkualitas tinggi, dipanen langsung dari kebun KOPMAS Asem Kembar. Ditanam secara organik tanpa pestisida berbahaya.',
        price: 8000,
        unit: 'ikat',
        stock: 150,
        image: 'assets/images/pakcoy-product.png',
        benefits: 'Kaya vitamin A, vitamin C, dan kalsium. Baik untuk kesehatan tulang dan mata.',
        quality: 'Organik, segar, bebas pestisida',
        createdAt: '2026-01-15T08:00:00.000Z'
      },
      {
        id: 'PRD-002',
        name: 'Pakcoy Baby',
        description: 'Pakcoy muda berukuran kecil dengan daun yang sangat lembut. Cocok untuk salad, tumis, dan sup.',
        price: 10000,
        unit: 'ikat',
        stock: 80,
        image: 'assets/images/pakcoy-product.png',
        benefits: 'Tekstur lebih lembut, rasa lebih manis, nutrisi lebih padat.',
        quality: 'Dipanen muda, segar hari ini',
        createdAt: '2026-02-01T08:00:00.000Z'
      },
      {
        id: 'PRD-003',
        name: 'Paket Pakcoy Keluarga',
        description: 'Paket hemat berisi 5 ikat pakcoy segar, cukup untuk kebutuhan keluarga selama seminggu.',
        price: 35000,
        unit: 'paket',
        stock: 40,
        image: 'assets/images/pakcoy-product.png',
        benefits: 'Lebih hemat, stok sayur segar untuk seminggu.',
        quality: 'Dikemas rapi, tahan 5-7 hari di kulkas',
        createdAt: '2026-03-10T08:00:00.000Z'
      }
    ]);

    // Agenda
    this.setAgenda([
      {
        id: 'AGD-001',
        title: 'Penanaman Pakcoy Periode April',
        description: 'Kegiatan penanaman bibit pakcoy untuk periode April 2026. Semua anggota KOPMAS diharapkan hadir.',
        date: '2026-04-20',
        time: '07:00',
        location: 'Kebun Asem Kembar',
        status: 'akan_datang',
        category: 'penanaman'
      },
      {
        id: 'AGD-002',
        title: 'Panen Raya Pakcoy',
        description: 'Pemanenan besar-besaran pakcoy yang sudah siap panen. Hasil panen akan didistribusikan ke pasar dan pemesan online.',
        date: '2026-04-25',
        time: '06:00',
        location: 'Kebun Asem Kembar',
        status: 'akan_datang',
        category: 'panen'
      },
      {
        id: 'AGD-003',
        title: 'Workshop Urban Farming',
        description: 'Pelatihan teknik bertanam pakcoy di lahan terbatas untuk masyarakat sekitar. Gratis dan terbuka untuk umum.',
        date: '2026-05-05',
        time: '09:00',
        location: 'Balai Desa Asem Kembar',
        status: 'akan_datang',
        category: 'workshop'
      },
      {
        id: 'AGD-004',
        title: 'Panen Perdana 2026',
        description: 'Panen pertama tahun 2026 telah berhasil dilakukan dengan hasil yang memuaskan.',
        date: '2026-03-15',
        time: '06:30',
        location: 'Kebun Asem Kembar',
        status: 'selesai',
        category: 'panen'
      }
    ]);

    // Finance
    this.setFinance([
      { id: 'FIN-001', type: 'pemasukan', category: 'Penjualan Pakcoy', description: 'Penjualan pakcoy ke Pasar Tradisional', amount: 2500000, date: '2026-03-01', createdAt: '2026-03-01T08:00:00.000Z' },
      { id: 'FIN-002', type: 'pemasukan', category: 'Penjualan Pakcoy', description: 'Penjualan online bulan Maret', amount: 1800000, date: '2026-03-15', createdAt: '2026-03-15T08:00:00.000Z' },
      { id: 'FIN-003', type: 'pengeluaran', category: 'Benih', description: 'Pembelian benih pakcoy 5kg', amount: 350000, date: '2026-03-02', createdAt: '2026-03-02T08:00:00.000Z' },
      { id: 'FIN-004', type: 'pengeluaran', category: 'Pupuk', description: 'Pupuk organik dan kompos', amount: 500000, date: '2026-03-05', createdAt: '2026-03-05T08:00:00.000Z' },
      { id: 'FIN-005', type: 'pengeluaran', category: 'Operasional', description: 'Biaya air dan listrik kebun', amount: 200000, date: '2026-03-10', createdAt: '2026-03-10T08:00:00.000Z' },
      { id: 'FIN-006', type: 'dana_tambahan', category: 'Hibah Pemerintah', description: 'Bantuan program ketahanan pangan desa', amount: 5000000, date: '2026-02-20', createdAt: '2026-02-20T08:00:00.000Z' },
      { id: 'FIN-007', type: 'pemasukan', category: 'Penjualan Pakcoy', description: 'Penjualan ke restoran lokal', amount: 3200000, date: '2026-04-01', createdAt: '2026-04-01T08:00:00.000Z' },
      { id: 'FIN-008', type: 'pengeluaran', category: 'Alat Pertanian', description: 'Pembelian selang dan sprinkler', amount: 450000, date: '2026-04-05', createdAt: '2026-04-05T08:00:00.000Z' },
      { id: 'FIN-009', type: 'pemasukan', category: 'Penjualan Pakcoy', description: 'Penjualan langsung di kebun', amount: 900000, date: '2026-04-10', createdAt: '2026-04-10T08:00:00.000Z' },
      { id: 'FIN-010', type: 'dana_tambahan', category: 'Donasi', description: 'Donasi dari komunitas pecinta organik', amount: 1500000, date: '2026-04-12', createdAt: '2026-04-12T08:00:00.000Z' }
    ]);

    // Sample orders
    this.setOrders([
      {
        id: 'ORD-001',
        customer: { name: 'Budi Santoso', phone: '081234567890', address: 'Jl. Merdeka No. 45, Surabaya' },
        items: [{ productId: 'PRD-001', qty: 5, price: 8000 }, { productId: 'PRD-002', qty: 2, price: 10000 }],
        total: 60000,
        payment: 'cod',
        status: 'selesai',
        createdAt: '2026-04-01T10:30:00.000Z'
      },
      {
        id: 'ORD-002',
        customer: { name: 'Siti Aminah', phone: '081298765432', address: 'Jl. Pahlawan No. 12, Sidoarjo' },
        items: [{ productId: 'PRD-003', qty: 1, price: 35000 }],
        total: 35000,
        payment: 'qris',
        status: 'diproses',
        createdAt: '2026-04-10T14:15:00.000Z'
      },
      {
        id: 'ORD-003',
        customer: { name: 'Ahmad Fauzi', phone: '082112345678', address: 'Jl. Kenari No. 7, Gresik' },
        items: [{ productId: 'PRD-001', qty: 10, price: 8000 }, { productId: 'PRD-002', qty: 5, price: 10000 }],
        total: 130000,
        payment: 'cod',
        status: 'menunggu',
        createdAt: '2026-04-14T09:00:00.000Z'
      }
    ]);

    localStorage.setItem('kopmas_seeded', 'true');
  }
};

// Seed on load
DataStore.seed();
