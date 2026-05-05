/* ============================================
   KOPMAS ASEM KEMBAR — Main App (Router)
   ============================================ */

// --- Utility Functions ---
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatCurrency(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

function getStatusBadge(status) {
  const map = {
    menunggu: { class: 'badge-accent', label: 'Menunggu' },
    diproses: { class: 'badge-info', label: 'Diproses' },
    selesai: { class: 'badge-success', label: 'Selesai' },
    dibatalkan: { class: 'badge-danger', label: 'Dibatalkan' }
  };
  const s = map[status] || { class: 'badge-secondary', label: status };
  return `<span class="badge ${s.class}">${s.label}</span>`;
}

function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// --- Navbar ---
function renderNavbar() {
  const cartCount = DataStore.getCartCount();
  return `
    <nav class="navbar" id="main-navbar">
      <div class="container">
        <a href="#/" class="nav-brand">
          <div class="brand-icon">🌿</div>
          <span>KOPMAS<br><small style="font-size:0.6em; font-weight:400; opacity:0.8;">Asem Kembar</small></span>
        </a>
        <div class="nav-links" id="nav-links">
          <a href="#/" class="nav-link" data-page="home">Beranda</a>
          <a href="#/profil" class="nav-link" data-page="profil">Profil</a>
          <a href="#/produk" class="nav-link" data-page="produk">Produk</a>
          <a href="#/agenda" class="nav-link" data-page="agenda">Agenda</a>
          <a href="#/pesan" class="nav-link" data-page="pesan">Pesan</a>
          <a href="#/keranjang" class="nav-link nav-cart" data-page="keranjang">
            🛒 ${cartCount > 0 ? `<span class="cart-count">${cartCount}</span>` : ''}
          </a>
        </div>
        <button class="nav-toggle" onclick="toggleMobileNav()" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  `;
}

function renderFooter() {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="brand-text">🌿 KOPMAS Asem Kembar</div>
            <p>Kelompok Masyarakat Asem Kembar — menyediakan pakcoy segar berkualitas tinggi, ditanam secara organik untuk masyarakat.</p>
            <div class="social-links" style="justify-content: flex-start; margin-top: var(--space-md);">
              <a href="https://instagram.com/kopmas.asemkembar" target="_blank" class="social-link instagram" style="width:36px; height:36px; font-size:1rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/></svg>
              </a>
              <a href="https://tiktok.com/@kopmas.asemkembar" target="_blank" class="social-link tiktok" style="width:36px; height:36px; font-size:1rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.77-.39 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.29 8.29 0 005.58 2.15V11.7a4.83 4.83 0 01-3.77-1.24V6.69h3.77z"/></svg>
              </a>
            </div>
          </div>
          <div class="footer-col">
            <h5>Navigasi</h5>
            <a href="#/">Beranda</a>
            <a href="#/profil">Profil</a>
            <a href="#/produk">Produk</a>
            <a href="#/agenda">Agenda</a>
          </div>
          <div class="footer-col">
            <h5>Layanan</h5>
            <a href="#/pesan">Pesan Produk</a>
            <a href="#/keranjang">Keranjang</a>
          </div>
          <div class="footer-col">
            <h5>Kontak</h5>
            <a href="#">📍 Asem Kembar, Jawa Timur</a>
            <a href="tel:+6281234567890">📞 081-234-567-890</a>
            <a href="mailto:kopmas.asemkembar@gmail.com">📧 kopmas.asemkembar@gmail.com</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 KOPMAS Asem Kembar. Semua hak dilindungi.</span>
          <span>Dibuat dengan 💚 untuk petani lokal</span>
        </div>
      </div>
    </footer>
  `;
}

// --- Admin Layout ---
function renderAdminLayout(pageTitle, contentHTML) {
  const currentHash = window.location.hash;
  return `
    <div class="admin-layout">
      <aside class="admin-sidebar" id="admin-sidebar">
        <div class="sidebar-header">
          <div class="brand">
            <div class="brand-icon">🌿</div>
            <div>
              <div>KOPMAS</div>
              <div class="brand-sub">Admin Panel</div>
            </div>
          </div>
        </div>
        <nav class="sidebar-nav">
          <div class="sidebar-nav-label">Menu Utama</div>
          <a class="sidebar-link ${currentHash === '#/admin' || currentHash === '#/admin/' ? 'active' : ''}" href="#/admin">
            <span class="link-icon">📊</span> Dashboard
          </a>
          <div class="sidebar-nav-label">Manajemen</div>
          <a class="sidebar-link ${currentHash === '#/admin/produk' ? 'active' : ''}" href="#/admin/produk">
            <span class="link-icon">📦</span> Produk
          </a>
          <a class="sidebar-link ${currentHash === '#/admin/pesanan' ? 'active' : ''}" href="#/admin/pesanan">
            <span class="link-icon">🛒</span> Pesanan
          </a>
          <a class="sidebar-link ${currentHash === '#/admin/agenda' ? 'active' : ''}" href="#/admin/agenda">
            <span class="link-icon">📅</span> Agenda
          </a>
          <a class="sidebar-link ${currentHash === '#/admin/anggota' ? 'active' : ''}" href="#/admin/anggota">
            <span class="link-icon">👥</span> Anggota
          </a>
          <a class="sidebar-link ${currentHash === '#/admin/keuangan' ? 'active' : ''}" href="#/admin/keuangan">
            <span class="link-icon">💰</span> Keuangan
          </a>
          <a class="sidebar-link ${currentHash === '#/admin/laporan' ? 'active' : ''}" href="#/admin/laporan">
            <span class="link-icon">📋</span> Laporan
          </a>
        </nav>
        <div class="sidebar-footer">
          <a class="sidebar-link" href="#/">
            <span class="link-icon">🌐</span> Lihat Website
          </a>
          <a class="sidebar-link" href="#/" onclick="DataStore.logout()">
            <span class="link-icon">🚪</span> Logout
          </a>
        </div>
      </aside>
      <div class="sidebar-overlay" id="sidebar-overlay" onclick="toggleAdminSidebar()"></div>
      <main class="admin-main">
        <header class="admin-topbar">
          <div class="topbar-left">
            <button class="admin-toggle-sidebar" onclick="toggleAdminSidebar()">☰</button>
            <div>
              <h2>${pageTitle}</h2>
              <p>${formatDate(new Date().toISOString())}</p>
            </div>
          </div>
          <div class="topbar-right">
            <span class="text-light" style="font-size: var(--fs-sm);">👋 Halo, Admin</span>
          </div>
        </header>
        <div class="admin-content" id="admin-page-content">
          ${contentHTML}
        </div>
      </main>
    </div>
  `;
}

function renderAdminLogin() {
  if (DataStore.isLoggedIn()) {
    window.location.hash = '#/admin';
    return '';
  }
  return `
    <div class="login-page">
      <div class="login-card">
        <div class="login-logo">🌿</div>
        <h2>Admin Login</h2>
        <p class="login-subtitle">KOPMAS Asem Kembar — Panel Admin</p>
        <div class="login-error" id="login-error">Username atau password salah!</div>
        <form onsubmit="handleLogin(event)">
          <div class="form-group">
            <label for="login-user">Username</label>
            <input type="text" id="login-user" placeholder="Masukkan username" required>
          </div>
          <div class="form-group">
            <label for="login-pass">Password</label>
            <input type="password" id="login-pass" placeholder="Masukkan password" required>
          </div>
          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: var(--space-md);">Masuk</button>
        </form>
        <p class="mt-lg" style="font-size: var(--fs-xs); color: var(--color-text-light);">Default: admin / admin123</p>
        <a href="#/" class="btn btn-ghost btn-sm mt-md">← Kembali ke Website</a>
      </div>
    </div>
  `;
}

function handleLogin(e) {
  e.preventDefault();
  const user = document.getElementById('login-user').value;
  const pass = document.getElementById('login-pass').value;
  if (DataStore.login(user, pass)) {
    window.location.hash = '#/admin';
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
}

// --- Mobile Nav ---
function toggleMobileNav() {
  document.getElementById('nav-links').classList.toggle('open');
}

function toggleAdminSidebar() {
  document.getElementById('admin-sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('active');
}

// --- Router ---
function navigateTo(hash) {
  window.location.hash = hash;
  router();
}

function router() {
  const hash = window.location.hash || '#/';
  const app = document.getElementById('app');

  // Close mobile nav
  const navLinks = document.getElementById('nav-links');
  if (navLinks) navLinks.classList.remove('open');

  // Admin routes
  if (hash.startsWith('#/admin') && hash !== '#/admin/login') {
    if (!DataStore.isLoggedIn()) {
      window.location.hash = '#/admin/login';
      return;
    }

    let pageTitle = 'Dashboard';
    let content = '';

    switch (hash) {
      case '#/admin':
      case '#/admin/':
        pageTitle = 'Dashboard';
        content = renderAdminDashboard();
        break;
      case '#/admin/produk':
        pageTitle = 'Manajemen Produk';
        content = renderManageProducts();
        break;
      case '#/admin/pesanan':
        pageTitle = 'Manajemen Pesanan';
        content = renderManageOrders();
        break;
      case '#/admin/agenda':
        pageTitle = 'Manajemen Agenda';
        content = renderManageAgenda();
        break;
      case '#/admin/anggota':
        pageTitle = 'Struktur Organisasi';
        content = renderManageMembers();
        break;
      case '#/admin/keuangan':
        pageTitle = 'Laporan Keuangan';
        content = renderFinance();
        break;
      case '#/admin/laporan':
        pageTitle = 'Laporan Keuangan Formal';
        content = renderAdminReports();
        break;
      default:
        pageTitle = 'Dashboard';
        content = renderAdminDashboard();
    }

    app.innerHTML = renderAdminLayout(pageTitle, content);

    // Init charts after render
    setTimeout(() => {
      if (hash === '#/admin' || hash === '#/admin/') initDashboardCharts();
      if (hash === '#/admin/keuangan') initFinanceChart();
    }, 100);

    return;
  }

  // Admin login
  if (hash === '#/admin/login') {
    app.innerHTML = renderAdminLogin();
    return;
  }

  // Public routes
  let pageContent = '';

  switch (hash) {
    case '#/':
    case '#':
    case '':
      pageContent = renderHome();
      break;
    case '#/profil':
      pageContent = renderProfile();
      break;
    case '#/produk':
      pageContent = renderProducts();
      break;
    case '#/agenda':
      pageContent = renderAgenda();
      break;
    case '#/pesan':
      pageContent = renderOrder();
      break;
    case '#/keranjang':
      pageContent = renderCart();
      break;
    case '#/checkout':
      pageContent = renderCheckout();
      break;

    default:
      pageContent = `
        <div class="page-header">
          <div class="container"><h1>404</h1><p>Halaman tidak ditemukan</p></div>
        </div>
        <div class="section container text-center">
          <p class="mb-lg">Maaf, halaman yang Anda cari tidak ada.</p>
          <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
        </div>
      `;
  }

  app.innerHTML = renderNavbar() + pageContent + renderFooter();

  // Set active nav
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (hash === href || (hash === '' && href === '#/') || (hash === '#' && href === '#/')) {
      link.classList.add('active');
    }
  });

  // Scroll to top
  window.scrollTo(0, 0);
}

// --- Navbar scroll effect ---
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// --- Cart update listener ---
window.addEventListener('cart-updated', () => {
  const cartLink = document.querySelector('.nav-cart');
  if (cartLink) {
    const count = DataStore.getCartCount();
    const existing = cartLink.querySelector('.cart-count');
    if (existing) existing.remove();
    if (count > 0) {
      const badge = document.createElement('span');
      badge.className = 'cart-count';
      badge.textContent = count;
      cartLink.appendChild(badge);
    }
  }
});

// --- Init ---
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  DataStore.seed();

  // Initialize Firebase sync (if configured)
  if (typeof FirebaseSync !== 'undefined' && typeof FIREBASE_CONFIG !== 'undefined') {
    FirebaseSync.init(FIREBASE_CONFIG);
  }

  router();
});
