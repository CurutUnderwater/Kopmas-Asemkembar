/* ============================================
   Order Page (Product listing for ordering)
   ============================================ */
function renderOrder() {
  const products = DataStore.getProducts();
  const cart = DataStore.getCart();

  return `
    <div class="page-header">
      <div class="container">
        <h1>Pesan Produk</h1>
        <p>Pilih produk pakcoy segar dan tambahkan ke keranjang</p>
        <div class="breadcrumb">
          <a href="#/">Beranda</a> <span>/</span> <span>Pesan</span>
        </div>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div style="display: flex; flex-direction: column; gap: var(--space-lg);" class="stagger">
          ${products.map(p => {
            const cartItem = cart.find(c => c.productId === p.id);
            const qty = cartItem ? cartItem.qty : 0;
            return `
              <div class="card product-order-card" id="order-card-${p.id}">
                <img src="${p.image}" alt="${p.name}" class="product-thumb">
                <div class="product-info">
                  <div class="flex items-center gap-sm mb-sm">
                    <span class="badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}">${p.stock > 0 ? `Stok: ${p.stock}` : 'Habis'}</span>
                  </div>
                  <h4>${p.name}</h4>
                  <p class="text-light" style="font-size: var(--fs-sm); margin-top: var(--space-xs);">${p.description.substring(0, 100)}...</p>
                  <div class="flex items-center justify-between mt-md" style="flex-wrap: wrap; gap: var(--space-md);">
                    <div class="product-price">Rp ${p.price.toLocaleString('id-ID')} <span class="text-light" style="font-size: var(--fs-sm); font-weight: 400;">/ ${p.unit}</span></div>
                    <div class="flex items-center gap-md">
                      ${qty > 0 ? `
                        <div class="qty-control">
                          <button onclick="updateOrderQty('${p.id}', ${qty - 1})">−</button>
                          <input type="number" value="${qty}" min="0" max="${p.stock}" onchange="updateOrderQty('${p.id}', parseInt(this.value) || 0)" id="qty-${p.id}">
                          <button onclick="updateOrderQty('${p.id}', ${qty + 1})">+</button>
                        </div>
                        <button class="btn btn-danger btn-sm" onclick="updateOrderQty('${p.id}', 0)">✕</button>
                      ` : `
                        <button class="btn btn-primary btn-sm" onclick="addToCartFromOrder('${p.id}')" ${p.stock <= 0 ? 'disabled' : ''}>
                          🛒 Tambah
                        </button>
                      `}
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        ${cart.length > 0 ? `
          <div class="mt-2xl" style="position: sticky; bottom: var(--space-lg); z-index: 10;">
            <div class="card" style="background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light)); color: white; padding: var(--space-lg);">
              <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: var(--space-md);">
                <div>
                  <p style="opacity: 0.8; font-size: var(--fs-sm);">${DataStore.getCartCount()} item di keranjang</p>
                  <h3 style="color: white;">Total: Rp ${DataStore.getCartTotal().toLocaleString('id-ID')}</h3>
                </div>
                <a href="#/keranjang" class="btn btn-accent btn-lg">Lihat Keranjang →</a>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

function addToCartFromOrder(productId) {
  DataStore.addToCart(productId, 1);
  navigateTo(window.location.hash);
  showToast('Produk ditambahkan!', 'success');
}

function updateOrderQty(productId, qty) {
  const product = DataStore.getProductById(productId);
  if (product && qty > product.stock) {
    showToast('Stok tidak mencukupi!', 'error');
    return;
  }
  DataStore.updateCartQty(productId, qty);
  navigateTo(window.location.hash);
}
