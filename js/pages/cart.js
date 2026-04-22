/* ============================================
   Cart Page
   ============================================ */
function renderCart() {
  const cart = DataStore.getCart();
  const products = DataStore.getProducts();

  if (cart.length === 0) {
    return `
      <div class="page-header">
        <div class="container">
          <h1>Keranjang</h1>
          <div class="breadcrumb">
            <a href="#/">Beranda</a> <span>/</span> <a href="#/pesan">Pesan</a> <span>/</span> <span>Keranjang</span>
          </div>
        </div>
      </div>
      <section class="section">
        <div class="container">
          <div class="empty-state">
            <div class="empty-icon">🛒</div>
            <h3>Keranjang Kosong</h3>
            <p>Belum ada produk di keranjang Anda</p>
            <a href="#/pesan" class="btn btn-primary">Mulai Belanja</a>
          </div>
        </div>
      </section>
    `;
  }

  const cartItems = cart.map(c => {
    const product = products.find(p => p.id === c.productId);
    if (!product) return null;
    return { ...c, product };
  }).filter(Boolean);

  const subtotal = cartItems.reduce((s, c) => s + c.product.price * c.qty, 0);

  return `
    <div class="page-header">
      <div class="container">
        <h1>Keranjang Belanja</h1>
        <div class="breadcrumb">
          <a href="#/">Beranda</a> <span>/</span> <a href="#/pesan">Pesan</a> <span>/</span> <span>Keranjang</span>
        </div>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="checkout-grid">
          <div>
            <div style="display: flex; flex-direction: column; gap: var(--space-md);">
              ${cartItems.map(c => `
                <div class="card product-order-card" id="cart-item-${c.productId}">
                  <img src="${c.product.image}" alt="${c.product.name}" class="product-thumb">
                  <div class="product-info">
                    <h4 style="margin-bottom: var(--space-xs);">${c.product.name}</h4>
                    <p class="text-light" style="font-size: var(--fs-sm);">Rp ${c.product.price.toLocaleString('id-ID')} / ${c.product.unit}</p>
                    <div class="flex items-center justify-between mt-md" style="flex-wrap: wrap; gap: var(--space-sm);">
                      <div class="qty-control">
                        <button onclick="updateCartItem('${c.productId}', ${c.qty - 1})">−</button>
                        <input type="number" value="${c.qty}" min="1" max="${c.product.stock}" onchange="updateCartItem('${c.productId}', parseInt(this.value) || 1)">
                        <button onclick="updateCartItem('${c.productId}', ${c.qty + 1})">+</button>
                      </div>
                      <div class="flex items-center gap-md">
                        <span class="product-price">Rp ${(c.product.price * c.qty).toLocaleString('id-ID')}</span>
                        <button class="btn btn-danger btn-sm" onclick="removeCartItem('${c.productId}')">✕</button>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
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
            <a href="#/checkout" class="btn btn-primary btn-lg" style="width: 100%; margin-top: var(--space-lg);">Lanjut ke Pembayaran →</a>
            <a href="#/pesan" class="btn btn-ghost btn-sm" style="width: 100%; margin-top: var(--space-sm);">← Lanjut Belanja</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function updateCartItem(productId, qty) {
  if (qty < 1) {
    removeCartItem(productId);
    return;
  }
  const product = DataStore.getProductById(productId);
  if (product && qty > product.stock) {
    showToast('Stok tidak mencukupi!', 'error');
    return;
  }
  DataStore.updateCartQty(productId, qty);
  navigateTo('#/keranjang');
}

function removeCartItem(productId) {
  DataStore.removeFromCart(productId);
  navigateTo('#/keranjang');
  showToast('Produk dihapus dari keranjang', 'info');
}
