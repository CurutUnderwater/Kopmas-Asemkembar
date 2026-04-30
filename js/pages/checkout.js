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
                <div id="qris-image-slot" style="width:220px; height:220px; margin: 0 auto var(--space-md); background: white; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; border: 2px solid var(--color-border);">
                  <!-- QRIS image will be injected dynamically by selectPayment() -->
                </div>
                <p style="font-weight: 600; color: var(--color-primary);">Scan QR Code untuk Pembayaran</p>
                <p style="font-size: var(--fs-sm); color: var(--color-text-light);">Gunakan aplikasi e-wallet atau mobile banking Anda</p>
                <p style="font-size: var(--fs-xl); font-weight: 800; color: var(--color-primary); margin-top: var(--space-md);">
                  Rp ${subtotal.toLocaleString('id-ID')}
                </p>
                <div style="margin-top: var(--space-lg); text-align: left; border-top: 1px dashed var(--color-border); padding-top: var(--space-md);">
                  <label for="qris-proof-upload" style="font-weight: 600; display: block; margin-bottom: 8px;">Upload Bukti Transfer *</label>
                  <input type="file" id="qris-proof-upload" accept="image/*" style="width: 100%; border: 1px solid var(--color-border); padding: 8px; border-radius: var(--radius-sm);" onchange="handleQrisProofUpload(event)">
                  <input type="hidden" id="qris-proof-base64">
                </div>

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

    // Dynamically inject QRIS image each time it's shown
    // so it always uses the latest data (from Firebase sync)
    const qrisImageSlot = document.getElementById('qris-image-slot');
    if (qrisImageSlot) {
      const qrisImage = DataStore.getSettings().qrisImage;
      if (qrisImage) {
        qrisImageSlot.innerHTML = `<img src="${qrisImage}" alt="QRIS" style="max-width:200px; max-height:200px; object-fit:contain;">`;
      } else {
        qrisImageSlot.innerHTML = `
          <div style="text-align:center; color: var(--color-text-light);">
            <div style="font-size:2.5rem;">📷</div>
            <p style="font-size:var(--fs-xs); margin-top:8px;">QRIS belum diatur admin</p>
          </div>`;
      }
    }
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

  // If QRIS, validate proof
  let paymentProofBase64 = null;
  if (selectedPayment === 'qris') {
    const proofInput = document.getElementById('qris-proof-base64');
    if (!proofInput || !proofInput.value) {
      showToast('Mohon upload bukti transfer terlebih dahulu', 'error');
      return;
    }
    paymentProofBase64 = proofInput.value;
  }

  // Finalize immediately
  finalizeOrder(name, phone, address, notes, items, total, selectedPayment === 'qris' ? 'diproses' : 'menunggu', paymentProofBase64);
}

function finalizeOrder(name, phone, address, notes, items, total, status, paymentProof) {
  const cart = DataStore.getCart();
  
  // Create order
  const order = DataStore.addOrder({
    customer: { name, phone, address, notes },
    items,
    total,
    payment: selectedPayment,
    status: status,
    paymentProof: paymentProof
  });

  // Only add income if payment is already processed (QRIS)
  // For COD, admin will add it when status is updated to 'selesai'
  if (status === 'diproses' && selectedPayment === 'qris') {
    DataStore.addFinance({
      orderId: order.id,
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
              : 'Terima kasih, bukti pembayaran Anda telah kami simpan.'}
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

function handleQrisProofUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('qris-proof-base64').value = e.target.result;
    showToast('Bukti transfer berhasil dipilih', 'success');
  };
  reader.readAsDataURL(file);
}
