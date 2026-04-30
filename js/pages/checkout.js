/* ============================================
   Checkout Page
   ============================================ */
function renderCheckout() {
  const cart = DataStore.getCart();
  const products = DataStore.getProducts();

  if (cart.length === 0) {
    window.location.hash = '#/pesan';
    return '<div class="section container"><p>Redirecting...</p></div>';
  }

  const cartItems = cart.map(c => {
    const product = products.find(p => p.id === c.productId);
    return product ? { ...c, product } : null;
  }).filter(Boolean);
  const subtotal = cartItems.reduce((s, c) => s + c.product.price * c.qty, 0);

  return `
    <div class="page-header">
      <div class="container">
        <h1>Pembayaran</h1>
        <div class="breadcrumb">
          <a href="#/">Beranda</a> <span>/</span> <a href="#/keranjang">Keranjang</a> <span>/</span> <span>Checkout</span>
        </div>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="checkout-grid">
          <div class="checkout-form">
            <h3 class="mb-lg">Data Pemesan</h3>
            <div class="form-group">
              <label for="checkout-name">Nama Lengkap *</label>
              <input type="text" id="checkout-name" placeholder="Masukkan nama lengkap">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="checkout-phone">No. Handphone *</label>
                <input type="tel" id="checkout-phone" placeholder="08xxxxxxxxxx">
              </div>
              <div class="form-group">
                <label for="checkout-email">Email (opsional)</label>
                <input type="email" id="checkout-email" placeholder="email@contoh.com">
              </div>
            </div>
            <div class="form-group">
              <label for="checkout-address">Alamat Lengkap *</label>
              <textarea id="checkout-address" rows="3" placeholder="Masukkan alamat lengkap untuk pengiriman"></textarea>
            </div>
            <div class="form-group">
              <label for="checkout-notes">Catatan (opsional)</label>
              <textarea id="checkout-notes" rows="2" placeholder="Catatan tambahan untuk pesanan"></textarea>
            </div>

            <h3 class="mb-lg mt-xl">Metode Pembayaran</h3>
            <div class="payment-option selected" onclick="selectPayment('cod', this)" id="pay-cod">
              <input type="radio" name="payment" value="cod" checked>
              <div class="payment-label">
                <h5>💵 COD (Bayar di Tempat)</h5>
                <p>Bayar tunai saat produk diantarkan ke alamat Anda</p>
              </div>
            </div>
            <div class="payment-option" onclick="selectPayment('qris', this)" id="pay-qris">
              <input type="radio" name="payment" value="qris">
              <div class="payment-label">
                <h5>📱 QRIS</h5>
                <p>Scan QR code untuk pembayaran digital (GoPay, OVO, Dana, dll)</p>
              </div>
            </div>

            <div id="qris-section" class="hidden">
              <div class="qris-display">
                <div style="width:220px; height:220px; margin: 0 auto var(--space-md); background: white; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; border: 2px solid var(--color-border);">
                  <svg width="180" height="180" viewBox="0 0 180 180">
                    <rect width="180" height="180" fill="white"/>
                    <!-- Simplified QR pattern -->
                    <rect x="10" y="10" width="50" height="50" rx="4" fill="none" stroke="#1B4332" stroke-width="6"/>
                    <rect x="22" y="22" width="26" height="26" rx="2" fill="#1B4332"/>
                    <rect x="120" y="10" width="50" height="50" rx="4" fill="none" stroke="#1B4332" stroke-width="6"/>
                    <rect x="132" y="22" width="26" height="26" rx="2" fill="#1B4332"/>
                    <rect x="10" y="120" width="50" height="50" rx="4" fill="none" stroke="#1B4332" stroke-width="6"/>
                    <rect x="22" y="132" width="26" height="26" rx="2" fill="#1B4332"/>
                    <!-- Center pattern -->
                    <rect x="70" y="10" width="10" height="10" fill="#1B4332"/>
                    <rect x="90" y="10" width="10" height="10" fill="#1B4332"/>
                    <rect x="70" y="30" width="10" height="10" fill="#1B4332"/>
                    <rect x="100" y="30" width="10" height="10" fill="#1B4332"/>
                    <rect x="70" y="50" width="10" height="10" fill="#1B4332"/>
                    <rect x="90" y="50" width="10" height="10" fill="#1B4332"/>
                    <rect x="10" y="70" width="10" height="10" fill="#1B4332"/>
                    <rect x="30" y="70" width="10" height="10" fill="#1B4332"/>
                    <rect x="50" y="70" width="10" height="10" fill="#1B4332"/>
                    <rect x="70" y="70" width="40" height="40" rx="6" fill="#2D6A4F"/>
                    <text x="90" y="95" text-anchor="middle" fill="white" font-size="14" font-weight="bold">QRIS</text>
                    <rect x="120" y="70" width="10" height="10" fill="#1B4332"/>
                    <rect x="140" y="70" width="10" height="10" fill="#1B4332"/>
                    <rect x="160" y="70" width="10" height="10" fill="#1B4332"/>
                    <rect x="120" y="90" width="10" height="10" fill="#1B4332"/>
                    <rect x="150" y="90" width="10" height="10" fill="#1B4332"/>
                    <rect x="70" y="120" width="10" height="10" fill="#1B4332"/>
                    <rect x="90" y="120" width="10" height="10" fill="#1B4332"/>
                    <rect x="70" y="140" width="10" height="10" fill="#1B4332"/>
                    <rect x="100" y="140" width="10" height="10" fill="#1B4332"/>
                    <rect x="120" y="120" width="50" height="50" rx="4" fill="none" stroke="#52B788" stroke-width="3" stroke-dasharray="6"/>
                    <rect x="130" y="130" width="30" height="30" rx="2" fill="#52B788" opacity="0.2"/>
                    <text x="145" y="150" text-anchor="middle" fill="#2D6A4F" font-size="10" font-weight="bold">PAY</text>
                    <rect x="70" y="160" width="10" height="10" fill="#1B4332"/>
                    <rect x="90" y="160" width="10" height="10" fill="#1B4332"/>
                  </svg>
                </div>
                <p style="font-weight: 600; color: var(--color-primary);">Scan QR Code untuk Pembayaran</p>
                <p style="font-size: var(--fs-sm); color: var(--color-text-light);">Gunakan aplikasi e-wallet atau mobile banking Anda</p>
                <p style="font-size: var(--fs-xl); font-weight: 800; color: var(--color-primary); margin-top: var(--space-md);">
                  Rp ${subtotal.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <button id="btn-place-order" class="btn btn-primary btn-lg mt-xl" style="width: 100%;" onclick="placeOrder()">
              Konfirmasi Pesanan (COD)
            </button>
          </div>

          <div class="cart-summary">
            <h3>Ringkasan Pesanan</h3>
            ${cartItems.map(c => `
              <div class="cart-summary-row">
                <span>${c.product.name} × ${c.qty}</span>
                <span>Rp ${(c.product.price * c.qty).toLocaleString('id-ID')}</span>
              </div>
            `).join('')}
            <div class="cart-summary-row total">
              <span>Total</span>
              <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

let selectedPayment = 'cod';

function selectPayment(method, el) {
  selectedPayment = method;
  document.querySelectorAll('.payment-option').forEach(o => {
    o.classList.remove('selected');
    o.querySelector('input').checked = false;
  });
  el.classList.add('selected');
  el.querySelector('input').checked = true;

  const qrisSection = document.getElementById('qris-section');
  const btnPlaceOrder = document.getElementById('btn-place-order');
  
  if (method === 'qris') {
    qrisSection.classList.remove('hidden');
    btnPlaceOrder.textContent = 'Bayar Sekarang (QRIS)';
  } else {
    qrisSection.classList.add('hidden');
    btnPlaceOrder.textContent = 'Konfirmasi Pesanan (COD)';
  }
}

function placeOrder() {
  const name = document.getElementById('checkout-name').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();
  const address = document.getElementById('checkout-address').value.trim();
  const notes = document.getElementById('checkout-notes').value.trim();

  if (!name || !phone || !address) {
    showToast('Mohon lengkapi data pemesan (nama, HP, alamat)', 'error');
    return;
  }

  const cart = DataStore.getCart();
  const products = DataStore.getProducts();
  const items = cart.map(c => {
    const p = products.find(pr => pr.id === c.productId);
    return { productId: c.productId, qty: c.qty, price: p ? p.price : 0 };
  });
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  // If QRIS, simulate payment gateway delay
  if (selectedPayment === 'qris') {
    // Show Loading Overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0'; overlay.style.left = '0';
    overlay.style.width = '100vw'; overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(255,255,255,0.9)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.innerHTML = `
      <div style="font-size: 3rem; animation: pulse 1.5s infinite;">⏳</div>
      <h3 class="mt-md">Memverifikasi Pembayaran...</h3>
      <p class="text-light text-center" style="max-width: 300px;">Mohon tunggu, sistem sedang mengecek status pembayaran Anda dengan Payment Gateway.</p>
    `;
    document.body.appendChild(overlay);

    // Simulate 3.5s delay for webhook/callback
    setTimeout(() => {
      document.body.removeChild(overlay);
      finalizeOrder(name, phone, address, notes, items, total, 'diproses');
    }, 3500);
  } else {
    // If COD, process immediately with status 'menunggu'
    finalizeOrder(name, phone, address, notes, items, total, 'menunggu');
  }
}

function finalizeOrder(name, phone, address, notes, items, total, status) {
  const cart = DataStore.getCart();
  
  // Create order
  const order = DataStore.addOrder({
    customer: { name, phone, address, notes },
    items,
    total,
    payment: selectedPayment,
    status: status
  });

  // Only add income if payment is already processed (QRIS)
  // For COD, admin will add it when status is updated to 'selesai'
  if (status === 'diproses' && selectedPayment === 'qris') {
    DataStore.addFinance({
      type: 'pemasukan',
      category: 'Penjualan Online',
      description: `Pesanan ${order.id} — ${name}`,
      amount: total,
      date: new Date().toISOString().split('T')[0]
    });
  }

  // Update stock
  cart.forEach(c => {
    const product = DataStore.getProductById(c.productId);
    if (product) {
      DataStore.updateProduct(c.productId, { stock: Math.max(0, product.stock - c.qty) });
    }
  });

  // Clear cart
  DataStore.clearCart();

  // Show success
  const app = document.getElementById('app');
  app.innerHTML = renderNavbar() + `
    <div class="page-header">
      <div class="container">
        <h1>Pesanan ${selectedPayment === 'qris' ? 'Berhasil Dibayar' : 'Diterima'}</h1>
      </div>
    </div>
    <section class="section">
      <div class="container container-narrow">
        <div class="order-success">
          <div class="success-icon">✅</div>
          <h2>Terima Kasih!</h2>
          <p class="text-light mt-md mb-lg">
            ${selectedPayment === 'qris' 
              ? 'Pembayaran Anda telah berhasil diverifikasi oleh sistem. Pesanan Anda akan segera diproses.' 
              : 'Pesanan Anda telah kami terima dan sedang menunggu konfirmasi admin.'}
          </p>
          <div class="card card-body text-left">
            <div class="cart-summary-row"><span class="font-semibold">No. Pesanan</span><span class="badge badge-primary">${order.id}</span></div>
            <div class="cart-summary-row"><span class="font-semibold">Nama</span><span>${name}</span></div>
            <div class="cart-summary-row"><span class="font-semibold">Telepon</span><span>${phone}</span></div>
            <div class="cart-summary-row"><span class="font-semibold">Alamat</span><span>${address}</span></div>
            <div class="cart-summary-row"><span class="font-semibold">Pembayaran</span><span class="badge ${selectedPayment === 'qris' ? 'badge-info' : 'badge-accent'}">${selectedPayment === 'qris' ? 'QRIS (Lunas)' : 'COD'}</span></div>
            <div class="cart-summary-row total"><span>Total</span><span>Rp ${total.toLocaleString('id-ID')}</span></div>
          </div>
          <p class="text-light mt-lg" style="font-size: var(--fs-sm);">
            ${selectedPayment === 'cod' 
              ? 'Siapkan pembayaran tunai saat produk diantar ke alamat Anda.' 
              : 'Terima kasih telah menggunakan pembayaran digital.'}
          </p>
          <div class="flex justify-center gap-md mt-xl">
            <a href="#/" class="btn btn-secondary">← Kembali ke Beranda</a>
            <a href="#/pesan" class="btn btn-primary">Pesan Lagi</a>
          </div>
        </div>
      </div>
    </section>
  ` + renderFooter();
}
